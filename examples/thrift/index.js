var thrift = require('thrift');

var Address = require('../../model/Addressbook.js'),
    types = require('../../model/addressbook_types.js');

var addressbook = [];


module.exports = function(settings) {
	var server = thrift.createServer(Address, module.exports.methods);

	server.listen(settings.port);
};

module.exports.methods = {};

// example view

module.exports = function() {
	app.thrift.methods.lookup = function() {};
};