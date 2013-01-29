var fs = require('fs');
var express = require('express');


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
Package.prototype.load = function(){
		var settings = this.settings;
		attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
		app.use('/' + this.name, express.static('./'+ this.folder + '/'+ this.name + '/assets'));
		var isCore = /^\.\//;
		if(attributes.clientDeps){
			for(var d=0,len=attributes.clientDeps.length;d<len;d++){
				if(!isCore.test(attributes.clientDeps[d])) settings.libraries += '<script src="/js/'+attributes.clientDeps[d]+'.js"></script>';
				else settings.libraries += '<script src="'+attributes.clientDeps[d]+'.js"></script>';
			}
		}
		if(attributes.partials){
			settings.partials = [];
			var partials = attributes.partials;
			for(var p=0,l=partials.length;p<l;p++){
				var pname = attributes.partials[p];
				var part = fs.readFileSync('./'+ this.folder + '/'+this.name+'/partials/'+pname,'utf8');
				part = ';parts["'+pname.replace('.html','')+'"] = \'' + part.replace(/\s*\n\s*/g,'') + '\';';
				settings.partials[p] = {};
				settings.partials[p].name = attributes.partials[p].replace('.html','');
				settings.partials[p].value = part;
			}
		}
		this.exports = require('./'+ this.folder + '/'+this.name+'/index.js');
		if(typeof this.exports === 'function') this.exports.call(this);
};


// load views
fs.readdir('./views',function(err,files){
	var packages = [];
	for(var i=0,len=files.length;i<len;i++){
		if(fs.statSync('./views/'+files[i]).isDirectory()){
			var env;
			var folderFiles = fs.readdirSync('./views/'+files[i]);
			if(require('./views/'+files[i]+'/package.json')){
				env = require('./views/'+files[i]+'/package.json');
			} else {
				env = app.env;
			}
			var pack = new Package(files[i],env);
			pack.name = files[i];
			packages.push(pack);
		}
	}
	for(var a=0,l=packages.length;a<l;a++){
		packages[a].load();
	}
});

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