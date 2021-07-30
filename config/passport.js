// config/passport.js
'use strict';
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
const linkVer = '/entermail';

var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport, app) {

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

                    // verified=1, unverifiy=null
                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
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
                // rows[0] is a data for session(serialize);
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                
                
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password)) //mencocokkan password kedalam database yang di hash
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                
                let datausr = rows[0]; // defined serialize data user info login

                // seleksi value isVerified
                connection.query('SELECT isVerified FROM users WHERE email=?',[username], (err, results, rows) => {
                    console.log(results); //json row data packet of isVerified
                    // console.log(rows);
                    try {
                    let parseR = JSON.stringify(results); //result harus dijadikan string dahulu
                    let hasil = JSON.parse(parseR); //lalu di parser
                    console.log(hasil); //menampilkan hasil parser json (object)
                    let kpy = Object.values(hasil[0]) // mengambil array di dalam object
                    console.log(kpy); // null/1? null=unverified 1=verified
                        if (kpy == 1){ // mengecek apakah value sama dengan 1?
                            console.log('uwis verifikasi');
                            return done(null, datausr); // Error: Failed to serialize user into session, why place in if conditional
                        } else {
                        console.log('urg verifikasi');
                        return done(null, false, req.flash('loginMessage', 'Please verify your email first! Click <a href="'+ linkVer+'">Here</a>')); // cara menaruh link di flash message?
                        // menampilkan button/link untuk menuju ke halaman verifikasi
                        }
                    } catch (err) {
                        console.log('error mas e');
                        throw err;
                    }
                }
            );

                });
            })
    );
};

// code verivication declared & exporting to routes.js
let rand = Math.floor((Math.random()* 120)+ 12);
module.exports.rand = rand
