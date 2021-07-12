// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
const nodemailer = require("nodemailer");

var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
// inserting user and password
// inserting default note ("Welcome to the MyNotes")
                    async function mailer(){

                        let host = "localhost:3000";

                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'mynotesverify@gmail.com',// email
                            pass: 'SAVAGE110',// password
                            expires: 2000,
                        },
                        });
                    
                        // send mail with defined transport object
                        let info = await transporter.sendMail({
                            from: '"MyNotes Email Verification" <mynotesverify@mynotes.com>', // sender address
                            to: req.body.username, // list of receivers // no receipent defined
                            subject: "Verify Your Email", // Subject line
                            // text: "Test text", // plain text body
                            html: "<p>Hi "+req.body.username+", dont share this code to another human, include <b>MyNotes</b> team!</p></br>Your Code Is:"+rand, // html body
                            });
                    
                        console.log("Message sent: %s", info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                        // khusus link verifikasi
                        // if ((req.protocol + "://" + req.get('host')) == ("http://"+ host)){
                        //     if(req.query.id == rand){
                        //         connection.query("UPDATE users SET isVerified=? WHERE email=?",[1, newUserMysql.username]);
                        //     }
                        // }
                        }

                    // verified=1, unverifiy=null
                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
                    mailer().rand; //memanggil function mailer
                    connection.query("INSERT INTO notes ( id, title, note, email ) values ('','Welcome To The MyNotes','This is example of your note, note that you reading terms and use!',?)", [newUserMysql.username]),
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =======================================================================; 21e,o.l[12.]==
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // // kesalahan debugging, kode ditunda Error: Failed to serialize user into session
                // connection.query('SELECT isVerified FROM users WHERE email=?',[username], (err, results, rows) => {
                //     console.log(rows)
                //         if (err)
                //         throw err;
                //         if (rows.isVerified == 1){
                //             return done(false, req.flash('verifyMessage', 'Please verify your email first!'));
                //         } else {
                //             return done(null, rows[0]);
                //         } //bagaimana cara mengidentifikasi null dan int di mysql dengan javascript?
                // });

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password)) //mencocokkan password kedalam database yang di hash
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};

// code verivication declared
let rand = Math.floor((Math.random()* 120)+ 12);
module.exports.rand = rand
