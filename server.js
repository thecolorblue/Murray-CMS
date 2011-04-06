var app = require('express').createServer(),
    express = require('express'),
    murray = require('./murray.js');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'superkey'}));
app.use(express.static(__dirname + '/resources'));

app.get('/', function(req, res){
  murray.getposts(req,res);
});
app.get('/:id/:value',function(req,res){
  var obj = {};
  obj[req.params.id] = req.params.value;
  murray.getposts(req,res,obj);
});
app.get('/archive/:date',function(req,res){
  res.send('looking for posts in:' + req.params.user);
});
app.get('/file/:file', function(req,res){
  res.send('looking for file: ' + req.params.file);
});

app.get('/admin/posts', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('page showing all posts in a table.');
  });
});
app.get('/admin/users', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('page to administer users on blog.');  
  });
});
app.get('/admin/settings', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('page to edit and view blog settings');
  });
});

app.get('/new', function(req,res){
  console.log(req);
  res.render('newpost.jade');  
});
app.post('/create/post', function(req, res){
  murray.isIn(req.cookies,function(){
    murray.createpost(req,res,posts);
  });
});
app.post('/create/user', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('user ' + res.body.user + ' created.');
  });
});

app.get('/login', function(req,res){
  res.render('loginform.jade');
});
app.post('/login', function(req,res){
  murray.login(req,res);
});

app.get('/logout', function(req,res){
  murray.logout;
});

app.listen(3000);

console.log('running at localhost:3000');
