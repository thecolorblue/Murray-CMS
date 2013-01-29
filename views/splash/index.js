// index.js
var util = require('util'), mu = require('mu2');
module.exports = function(){
	var view = this;

	app.get('/',function(req,res){
		if (process.env.NODE_ENV == 'development') {
			mu.clearCache();
		}

		var stream = mu.compileAndRender('./'+ view.name +'/index.html', { 
				"view" : view
		});

		util.pump(stream, res);
	});
};
