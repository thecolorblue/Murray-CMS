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

Mongo.post = function(blogpost, user,callback){
  db.open(function(err, db){
    db.collection('settings',function(err,collection){
      collection.find({}, function(err,cursor){
        cursor.toArray(function(err,posted){
          var postnum = posted[0].postcount;
          blogpost.pid = ++postnum;
          blogpost.date = new Date();
          blogpost.user = user;
          db.collection('posts', function(err, collection){
            collection.insert([blogpost],function(err,docs){
              db.collection('settings',function(err,collection){
                collection.update({name:'postcounter'},
                  {$inc:{postcount:1}},{safe:true},
                  function(err,docs){
                  if(err)console.log(err);
                  db.close;
                  callback(err,docs);
                });
              });
            });
          });
        });
      });
    });
  });
};

Mongo.put = function(){};

Mongo.delete = function(){};

module.exports = Mongo;