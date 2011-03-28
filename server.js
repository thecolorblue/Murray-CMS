var connect = require('connect'),
    app = require('express').createServer(),
    express = require('express'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative,
    posts = require('mongous').Mongous;

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'superkey'}));
app.use(express.static(__dirname + '/resources'));
var db = new Db('local', new Server('127.0.0.1', 27017, {}));

app.get('/', function(req, res){
  db.open(function(err, db){
    db.collection('local', function(err, collection){
      collection.find({}, {'sort':[['date', -1]]}, function(err, cursor){
        cursor.toArray(function(err, posted){
          if(req.cookies.loggedin == 1){
            var logged = 'you are logged in';
          } else {
            var logged = 'you should log in';
          }
          
          res.render('index.jade', {posts: posted, logged: logged});
          db.close();
        });
      });
    });
  });
});
app.get('/tag/:tag', function(req,res){
  res.send('looking for tags: ' + req.params.tag);
});

app.get('/new', function(req,res){
  console.log(req);
  res.render('newpost.jade');  
});
app.post('/brandnew', function(req, res){
  var blogpost = req.body;
  blogpost.date = new Date();
  blogpost.user = req.cookies.user;
  console.log(blogpost);
  posts('local.local').save(blogpost);
  res.send('saved new post');
});

app.get('/login', function(req,res){
  res.render('loginform.jade');
});
app.post('/login', function(req,res){
  db.open(function(err, db){
    db.collection('users', function(err, collection){
      collection.find({}, function(err, cursor){
        cursor.toArray(function(err, posted){
          for (var i = 0; i < posted.length; i++){
            if(posted[i].name == req.body.name && posted[i].pass == req.body.password){
              res.cookie('loggedin', '1', { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
              res.cookie('user', req.body.name, { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
              res.send('You logged in!');  
            } else {
              res.send('sorry, try again');
            }
          }
          db.close();
        });
      });
    });
  });
});

app.get('/logout', function(req,res){
  res.clearCookie('loggedin','user' );
  res.send('logged out');
});

app.listen(3000);

console.log('running at localhost:3000');
