var app = require('express').createServer(),
    express = require('express'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative,
    murray = require('./murray.js');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'superkey'}));
app.use(express.static(__dirname + '/resources'));
var db = new Db('local', new Server('127.0.0.1', 27017, {}));

app.get('/', function(req, res){
  murray.getposts(db,req,res);
});
app.get('/tag/:tag', function(req,res){
  res.send('looking for tags: ' + req.params.tag);
});
app.get('/user/:user',function(req,res){
  res.send('looking for posts by: ' + req.params.user);
});
app.get('/archive/:date',function(req,res){
  res.send('looking for posts in:' + req.params.user);
});
app.get('/page/:page', function(req,res){
  res.send('looking for page: ' + req.params.page);
});
app.get('/file/:file', function(req,res){
  res.send('looking for file: ' + req.params.file);
});

app.get('/admin/posts', function(req,res){
  if (user.type === 'admin'){
    res.send('page showing all posts in a table.');
  }
});
app.get('/admin/users', function(req,res){
  if(user.type === 'admin'){
    res.send('page to administer users on blog.');  
  }
});
app.get('/admin/settings', function(req,res){
  if(user.type === 'admin'){
    res.send('page to edit and view blog settings');
  }
});

app.get('/new', function(req,res){
  console.log(req);
  res.render('newpost.jade');  
});
app.post('/create/post', function(req, res){
  murray.createpost(db,req,res,posts);
});
app.post('/create/user', function(req,res){
  res.send('user ' + res.body.user + ' created.');
});

app.get('/login', function(req,res){
  res.render('loginform.jade');
});
app.post('/login', function(req,res){
  murray.login(db,req,res);
});

app.get('/logout', function(req,res){
  murray.logout;
});

app.listen(3000);

console.log('running at localhost:3000');
