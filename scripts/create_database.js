/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `email` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    `isVerified` tinyint(2) NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`username` ASC) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.notes_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `title` VARCHAR(50) NOT NULL, \
    `note` VARCHAR(3000) NOT NULL, \
    `email` VARCHAR(20) NOT NULL, \
    `isVerified` tinyint(2) NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`username` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
