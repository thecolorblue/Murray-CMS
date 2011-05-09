var app = require('express').createServer(),
    express = require('express'),
    murray = require('./murray'),
    fs = require('fs');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'superkey'}));
app.use(express.static(__dirname + '/resources'));


app.get('/', function(req, res){
  console.log(murray.ext);
  murray.getposts(req,res);
});
app.get('/new/:ctype', function(req,res){
  var obj = {};
  obj.ctype = req.params.ctype;
  murray.getForm(res,obj);
});
app.get('/admin/posts', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('page showing all posts in a table.');
  });
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

app.post('/create/post', function(req, res){
  console.log(req.cookies);
  murray.isIn(req.cookies,function(){
    murray.createpost(req,res);
  });
});
app.post('/create/user', function(req,res){
  murray.isIn(req.cookies,function(){
    res.send('user ' + res.body.user + ' created.');
  });
});

app.get('/login', function(req,res){
  res.render('loginform.jade',{posts: '', logged: '',sidebar:''});
});
app.post('/login', function(req,res){
res.cookie('loggedin', 1, 
          { path: '/', expires: new Date(Date.now() + 900000)});
  murray.login(req,res);
});

app.get('/logout', function(req,res){
  murray.logout(req,res);
});


app.listen(3000);

console.log('running at localhost:3000');
