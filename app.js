var fs = require('fs');
var express = require('express');
var packagejson = require('./package.json');

function extendPackage(env) {
	if(env.dependencies) {
		var deps = env.dependencies;
		for(var key in deps){
			packagejson.dependencies[key] = deps[key];
		}
	}
}

/*
	Module
	@constructor
	@desc model for views and modules
*/
function Module(name, env, folder){
	if(folder) this.folder = folder;
	else this.folder = 'views';
	this.settings = {
		libraries : '',
		env     : env,
		name    : name
	};
}
Module.prototype.load = function(){
		var settings = this.settings;
		// attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
		var isCore = /^\.\//;
		this.exports = require('./'+ this.folder + '/'+this.name+'/index.js');
		return this;
};

/*
	Package
	@constructor
	@desc model for views and modules
*/
function Package(name, env, folder){
	if(folder) this.folder = folder;
	else this.folder = 'views';
	this.settings = {
		libraries : '',
		env     : env,
		name    : name
	};
}
Package.prototype.load = function(o){
		var settings = this.settings;
		attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
		if(o.assets) app.use('/' + this.name, express.static('./'+ this.folder + '/'+ this.name + '/assets'));
		var isCore = /^\.\//;
		// if(attributes.clientDeps){
		// 	for(var d=0,len=attributes.clientDeps.length;d<len;d++){
		// 		if(!isCore.test(attributes.clientDeps[d])) settings.libraries += '<script src="/js/'+attributes.clientDeps[d]+'.js"></script>';
		// 		else settings.libraries += '<script src="'+attributes.clientDeps[d]+'.js"></script>';
		// 	}
		// }
		// if(attributes.partials){
		// 	settings.partials = [];
		// 	var partials = attributes.partials;
		// 	for(var p=0,l=partials.length;p<l;p++){
		// 		var pname = attributes.partials[p];
		// 		var part = fs.readFileSync('./'+ this.folder + '/'+this.name+'/partials/'+pname,'utf8');
		// 		part = ';parts["'+pname.replace('.html','')+'"] = \'' + part.replace(/\s*\n\s*/g,'') + '\';';
		// 		settings.partials[p] = {};
		// 		settings.partials[p].name = attributes.partials[p].replace('.html','');
		// 		settings.partials[p].value = part;
		// 	}
		// }
		this.exports = require('./'+ this.folder + '/'+this.name+'/index.js');
		if(typeof this.exports.prototype === 'object') new this.exports(this);
		else if(typeof this.exports === 'function') this.exports.call(this);
};

// load api
// the api folder works just like the views folder
// what you do inside the folder will be different
exports.loadAPI = function() {
	var apis = fs.readdirSync('./api');
	if(apis){
		var packages = [];
		for(var i=0,len=apis.length;i<len;i++){
			if(fs.statSync('./api/'+apis[i]).isDirectory()){
				var env;
				var folderapis = fs.readdirSync('./api/'+apis[i]);
				if(require('./api/'+apis[i]+'/package.json')){
					env = require('./api/'+apis[i]+'/package.json');
				} else {
					env = app.env;
				}
				var pack = new Package(apis[i],env,"api");
				pack.name = apis[i];
				packages.push(pack);
			}
		}
		for(var a=0,l=packages.length;a<l;a++){
			packages[a].load({
				assets : false
			});
		}
	}
}

exports.loadViews = function() {
	// load views
	var views = fs.readdirSync('./views');
	if(views) {
		var packages = [];
		for(var i=0,len=views.length;i<len;i++){
			if(fs.statSync('./views/'+views[i]).isDirectory()){
				var env;
				var folderFiles = fs.readdirSync('./views/'+views[i]);
				if(require('./views/'+views[i]+'/package.json')){
					env = require('./views/'+views[i]+'/package.json');
				} else {
					env = app.env;
				}
				var pack = new Package(views[i],env);
				extendPackage(env);
				pack.name = views[i];
				packages.push(pack);
			}
		}
		for(var a=0,l=packages.length;a<l;a++){
			packages[a].load({
				assets : true
			});
		}
	}
}

exports.loadModules = function() {
	// load modules
	var files = fs.readdirSync('./modules');
	var packages = [];
	if(files.length){
		for(var i=0,len=files.length;i<len;i++){
			if(fs.statSync('./modules/'+files[i]).isDirectory()){
				var env;
				var folderFiles = fs.readdirSync('./modules/'+files[i]);
				require('./modules/'+files[i]+'/package.json') ?
					env = require('./modules/'+files[i]+'/package.json') : env = app.env;
				var pack = new Module(files[i],env,'modules');
				pack.name = files[i];
				packages.push(pack);
			}
		}
		app.modules = {};
		for(var a=0,l=packages.length;a<l;a++){
			var module = packages[a].load();
			app.modules[module.name] = module.exports;
		}
	}
	
};

exports.createPackage = function() {
	/* build package.json */

	// pull packages from views,api, and modules


	// extend with current package.json

	// write to file
	fs.writeFileSync('./package.json', JSON.stringify(packagejson, null, 4)); 

}