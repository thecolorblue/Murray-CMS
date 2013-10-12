// index.js
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

module.exports = {
	app : server,
	io  : io
};

module.exports.init = function(package) {
	server.listen(package.port);
};

// views will create our routes
