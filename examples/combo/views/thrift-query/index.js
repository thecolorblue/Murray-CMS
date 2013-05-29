// index.js

module.exports = function(package) {
	app.thrift.methods.query = function(query, callback) {
		// broadcast to socket.io that a query happened
		app.express.io.broadcast.emit('query',query);

		// make our query from the database
		// the database is accessed through a module
		app.modules.mongodb.findOne({ _id : query._id }, function(addresses) {
			callback(null, addresses);
		});
	};
};

// views will create our routes
