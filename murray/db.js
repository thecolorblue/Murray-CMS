// We need this to look up what database you want to use
var settings = require('./settings.js');

// A couple extra variables
var dbdriverfile = __dirname + '/dbs/' + settings.database + '.js';

// require db 'driver'
var dbDriver = require(dbdriverfile);

// Setup Db object
var Db = {};

// set functions from 'driver' to functions for murray
Db.get = dbDriver.get;
Db.post = dbDriver.post;
Db.put = dbDriver.put;
Db.delete = dbDriver.delete;

// export so murray can use them
module.exports = Db;