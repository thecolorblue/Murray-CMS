

// A couple extra variables
var dbdriverfile = __dirname + '/chauffeurs/' + murrayCMS.settings.database + '.js';

// require db 'driver'
var dbDriver = require(dbdriverfile);

// Setup Db object
var Db = {};

// set functions from 'driver' to functions for murray
Db.create = dbDriver.create;
Db.read = dbDriver.read;
Db.update = dbDriver.update;
Db.delete = dbDriver.delete;

// export so murray can use them
module.exports = Db;