var express = require('express');

module.exports = function(){

  app.configure(function(){
    app.use(express.bodyParser({ uploadDir: __dirname + '/tmp' }));
    app.use(express.cookieParser('secret phrase'));
    app.use(express.session({
        secret: 'super secret do not share'
    }));
    app.use(express.static(__dirname + '/public'));
  });

};