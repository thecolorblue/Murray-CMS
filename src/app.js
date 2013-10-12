var fs = require('fs');
var express = require('express');
var packagejson = require('./package.json');
app = {
	find: function(name, group) {
		var i, j, k;
		if(group) {
			if(group === 'interfaces') {
				for (i in app.interfaces) {
					if(name === app.interfaces[i].name) return app.interfaces[i].exports;
				}
			} else if(group === 'modules' || group === 'views') {
				for (j = 0; j < app[group].length; j++) {
					if(name === app[group][j].name) return app[group][j].exports;
				}
			}
		} else {
			for (i in app.interfaces) {
				if(name === app.interfaces[i].name) return app.interfaces[i].exports;
			}
			for (j = 0; j < app.modules.length; j++) {
				if(name === app.modules[j].name) return app.modules[j].exports;
			}
			for (k = 0; k < app.views.length; k++) {
				if(name === app.views[k].name) return app.views[k].exports;
			}
		}
	}
};
var interfaces = [];
var coffee = require('coffee-script');

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
		this.attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
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
		this.exports = require('./'+ this.folder + '/'+this.name+'/index');
		if(o.assets) app.interfaces.express.exports.use('/' + this.name, express.static('./'+ this.folder + '/'+ this.name + '/assets'));
};
Package.prototype.init = function(options) {
	if(typeof this.exports.prototype === 'object') new this.exports(this.attributes);
	else if(typeof this.exports === 'function') this.exports.call(this.attributes);
};

function Interface(name, env, folder){
	if(folder) this.folder = folder;
	else this.folder = 'views';
	this.settings = {
		libraries : '',
		env     : env,
		name    : name
	};
}
Interface.prototype.load = function(o){
		var settings = this.settings;
		this.attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
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
		this.exports = require('./'+ this.folder + '/'+this.name+'/index');
		this.init = this.exports.init;		
};

// load api
// the api folder works just like the views folder
// what you do inside the folder will be different
exports.loadAPI = function() {
	var package, interfaces, env, folderinterfaces, packages, i, pack, a;

	app.interfaces = {};
	interfaces = fs.readdirSync('./interfaces');
	if(interfaces){
		packages = [];
		for(i=0, len=interfaces.length; i<len; i++){
			if(fs.statSync('./interfaces/'+interfaces[i]).isDirectory()){
				folderinterfaces = fs.readdirSync('./interfaces/'+interfaces[i]);
				if(require('./interfaces/'+interfaces[i]+'/package.json')){
					env = require('./interfaces/'+interfaces[i]+'/package.json');
				} else {
					env = app.env;
				}
				pack = new Interface(interfaces[i],env,"interfaces");
				pack.name = interfaces[i];
				packages.push(pack);
			}
		}
		for(a=0, l=packages.length; a<l; a++){
			// interfaces don't have assets
			package = packages[a];
			package.load({
				assets : false
			});
			app.interfaces[package.name] = package;
		}
	}
};

exports.loadViews = function() {
	// load views
	var views = fs.readdirSync('./views');
	if(views) {
		var packages = app.views = [];
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
		var l=packages.length;
		for(var a=0;a<l;a++){
			packages[a].load({
				assets : true
			});
		}
		for(var b=0;b<l;b++) {
			packages[b].init({});
		}
	}
};

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

exports.initInterfaces = function() {
	var interfaces = app.interfaces;
	for(var i in interfaces) {
		console.log('initializing:',interfaces[i].folder,interfaces[i].name);
		if(typeof interfaces[i].init === "function") interfaces[i].init();
	}
};

exports.createPackage = function() {
	/* build package.json */

	// pull packages from views,api, and modules


	// extend with current package.json

	// write to file
	fs.writeFileSync('./package.json', JSON.stringify(packagejson, null, 4)); 

}