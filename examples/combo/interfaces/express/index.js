var express = require('express');

module.exports = app = express();

module.exports.init = function(package) {
	app.listen(package.port);
};

// views will create our routes