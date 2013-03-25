// index.js
var util = require('util'), mu = require('mu2');

var fs = require('fs');

var Page = function(pack) {
	this.name = pack.name;
	app.get('/',this.handleRequest.bind(this));
};

Page.prototype.handleRequest = function(req,res){

	if (process.env.NODE_ENV == 'development') {
		mu.clearCache();
	}
	
	var stream = mu.compileAndRender('./views/'+ this.name +'/index.html', {
			"session" : req.session,
			"view" : this
	});

	util.pump(stream, res);
};

module.exports = Page;