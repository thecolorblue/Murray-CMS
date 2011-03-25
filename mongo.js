var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative;

var db = new Db('local', new Server('127.0.0.1', 27017,{}));
db.open(function(err, db){
  db.collection('local', function(err, collection){
    collection.find({}, {'sort':[['date', -1]]}, function(err, cursor){
      cursor.each(function(err, author){
        if(author != null){
          console.log(author);
        }
      });
    });
  });
});
