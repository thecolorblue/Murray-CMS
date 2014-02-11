var fs = require('fs');
var path = require('path');
var exp = require('express');
var http = require('http');
var express = exp();

express.configure(function () {
  express.use(exp.bodyParser({
    uploadDir: process.env.CLOUD_DIR || path.resolve(__dirname, '../../', 'tmp')
  }));

  express.use(exp.cookieParser('secret phrase'));
  express.use(exp.session({
    cookie: {
      maxAge: 1000000
    }
  }));

  express.use('/images', exp.static(process.env.CLOUD_DIR || './tmp'));
  express.use(exp.static('./public'));
});

module.exports = express;

module.exports.init = function () {

  // a quick hack to get facebook login working
  // remove when we add middleware support to murray

  var i, route, controller,
    routes = require('cson').parseFileSync(__dirname + '/routes.cson');
  for (i in routes) {
    route = i.split(/ +/);
    controller = routes[i].split('.');
    try {
      express[route[0]](
        route[1],
        app.find(controller[0])[controller[1]]
      );
    } catch (e) {
      console.log('error loading route', route, controller);
    }
  }

  express.listen(process.env.PORT || this.attributes.port);
};

// views will create our routes