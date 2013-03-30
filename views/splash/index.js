// index.js
var util = require('util'), mu = require('mu2');

var fs = require('fs');

var ExpressView = function(pack) {
	console.log(app);
	this.name = pack.name;
	app.get(pack.express.url,this.handleRequest.bind(this));
	this.initialize(pack);
};

ExpressView.prototype.initialize = function(pack) {};

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