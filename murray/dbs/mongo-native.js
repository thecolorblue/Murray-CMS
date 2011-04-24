var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    BSON = require('mongodb').BSONNative,
    Server = require('mongodb').Server;
    
var db = new Db('murray', new Server('127.0.0.1', 27017, {}));

Mongo = {};

Mongo.get = function(filters,config,collection,callback){
  db.open(function(err, db){
    db.collection('posts', function(err, collection){
      collection.find(filters,config, function(err, cursor){
        cursor.toArray(function(err, posted){
          callback(posted,err);
          db.close();
        });
      });
    });
  });
};

Mongo.post = function(){};

Mongo.put = function(){};

Mongo.delete = function(){};

module.exports = Mongo;