// index.js
var util = require('util'), mu = require('mu2');

var fs = require('fs');

var ExpressView = function(pack) {
	this.name = pack.name;
	this.initialize(pack);
};

ExpressView.prototype.initialize = function(pack) {
	app.get(pack.express.url,this.handleRequest.bind(this));
};

ExpressView.prototype.handleRequest = function(req,res){

	if (process.env.NODE_ENV == 'development') {
		mu.clearCache();
	}

	var stream = mu.compileAndRender('./views/'+ this.name +'/index.html', {
			"session" : req.session,
			"view" : this
	});

	util.pump(stream, res);
};

module.exports = ExpressView;