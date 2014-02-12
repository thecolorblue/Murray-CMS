var fs = require('fs');
var express = require('express');
var packagejson = require('./package.json');
var coffee = require('coffee-script');

app = {
  find: function (name, group) {
    var i, j, k;
    if (group) {
      if (group === 'services') {
        for (i in app.services) {
          if (name === app.services[i].name) return app.services[i].exports;
        }
      } else if (group === 'modules' || group === 'controllers') {
        for (j = 0; j < app[group].length; j++) {
          if (name === app[group][j].name) return app[group][j].exports;
        }
      }
    } else {
      for (i in app.services) {
        if (name === app.services[i].name) return app.services[i].exports;
      }
      for (j in app.modules) {
        if (name === app.modules[j].name) return app.modules[j].exports;
      }
      for (k = 0; k < app.controllers.length; k++) {
        if (name === app.controllers[k].name) return app.controllers[k].exports;
      }
    }
  },
  services: {}
};

function extendPackage(env) {
  if (env.dependencies) {
    var deps = env.dependencies;
    for (var key in deps) {
      packagejson.dependencies[key] = deps[key];
    }
  }
}

/*
	Module
	@constructor
	@desc model for controllers and modules
*/
function Module(name, env, folder) {
  if (folder) this.folder = folder;
  else this.folder = 'controllers';
  this.settings = {
    libraries: '',
    env: env,
    name: name
  };
}
Module.prototype.load = function () {
  var settings = this.settings;
  // attributes = require('./'+ this.folder + '/'+this.name+'/package.json');
  var isCore = /^\.\//;
  this.exports = require('./' + this.folder + '/' + this.name + '/index.js');
  return this;
};

/*
	Package
	@constructor
	@desc model for controllers and modules
*/
function Package(name, env, folder) {
  if (folder) this.folder = folder;
  else this.folder = 'controllers';
  this.settings = {
    libraries: '',
    env: env,
    name: name
  };
}
Package.prototype.load = function (o) {
  var settings = this.settings;
  this.attributes = require('./' + this.folder + '/' + this.name + '/package.json');
  var isCore = /^\.\//;
  this.exports = require('./' + this.folder + '/' + this.name + '/index');
  if (o.assets) app.services.express.exports.use('/' + this.name, express.static('./' + this.folder + '/' + this.name + '/assets'));
};
Package.prototype.init = function (options) {
  if (this.folder === 'controllers' && typeof this.exports.prototype === 'object') new this.exports(this.attributes);
  else if (typeof this.exports === 'function') this.exports.call(this.attributes);
};

function Interface(name, env, folder) {
  if (folder) this.folder = folder;
  else this.folder = 'controllers';
  this.settings = {
    libraries: '',
    env: env,
    name: name
  };  
}
Interface.prototype = {
  constructor: Interface,
  load: function (o) {
    var settings = this.settings;
    this.attributes = require('./' + this.folder + '/' + this.name + '/package.json');
    var isCore = /^\.\//;
    this.exports = require('./' + this.folder + '/' + this.name + '/index');
    this.init = this.exports.init;
  }
};

// load services
// the services folder works just like the controllers folder
// what you do inside the folder will be different
exports.loadServices = function () {
  services = fs.readdirSync(__dirname + '/services');
  if (services) {
    var packages = [];
    for (var i = 0, len = services.length; i < len; i++) {
      if (fs.statSync(__dirname + '/services/' + services[i]).isDirectory()) {
        var env;
        var folderservices = fs.readdirSync(__dirname + '/services/' + services[i]);
        if (require(__dirname + '/services/' + services[i] + '/package.json')) {
          env = require(__dirname + '/services/' + services[i] + '/package.json');
        } else {
          env = app.env;
        }
        var pack = new Interface(services[i], env, 'services');
        pack.name = services[i];
        packages.push(pack);
      }
    }
    for (var a = 0, l = packages.length; a < l; a++) {
      // services don't have assets
      packages[a].load({
        assets: false
      });
      app.services[packages[a].name] = packages[a];
    }
  }
};

exports.loadControllers = function () {
  // load controllers
  var controllers = fs.readdirSync('./controllers');
  if (controllers) {
    var packages = app.controllers = [];
    for (var i = 0, len = controllers.length; i < len; i++) {
      if (fs.statSync('./controllers/' + controllers[i]).isDirectory()) {
        var env;
        var folderFiles = fs.readdirSync('./controllers/' + controllers[i]);
        if (require('./controllers/' + controllers[i] + '/package.json')) {
          env = require('./controllers/' + controllers[i] + '/package.json');
        } else {
          env = app.env;
        }
        var pack = new Package(controllers[i], env);
        extendPackage(env);
        pack.name = controllers[i];
        packages.push(pack);
      }
    }
    var l = packages.length;
    for (var a = 0; a < l; a++) {
      packages[a].load({
        assets: true
      });
    }
    for (var b = 0; b < l; b++) {
      packages[b].init({});
    }
  }
};

exports.loadModules = function () {
  // load modules
  var files = fs.readdirSync('./modules');
  var packages = [];
  if (files.length) {
    for (var i = 0, len = files.length; i < len; i++) {
      if (fs.statSync('./modules/' + files[i]).isDirectory()) {
        var env;
        var folderFiles = fs.readdirSync('./modules/' + files[i]);
        require('./modules/' + files[i] + '/package.json') ?
          env = require('./modules/' + files[i] + '/package.json') : env = app.env;
        var pack = new Module(files[i], env, 'modules');
        pack.name = files[i];
        packages.push(pack);
      }
    }
    app.modules = {};
    for (var a = 0, l = packages.length; a < l; a++) {
      var module = packages[a].load();
      app.modules[module.name] = module.exports;
    }
  }
};

exports.initServices = function () {
  var services = app.services;
  for (var i in services) {
    console.log('initializing:', services[i].folder, services[i].name);
    if (typeof services[i].init === 'function') services[i].init();
  }
};

exports.createPackage = function () {
  /* build package.json */

  // pull packages from controllers, services, and modules


  // extend with current package.json

  // write to file
  fs.writeFileSync('./package.json', JSON.stringify(packagejson, null, 4));

}