var connect = require('connect'),
    app = require('express').createServer(),
    express = require('express'),
    db = require('mongous').Mongous,
    problog = require('./problog.js');

app.use(express.bodyParser());

app.get('/', function(req, res){
  db('local.local').find(5, function(reply){
    res.render('index.jade', {posts: reply.documents});
    console.log(reply.documents)
  });
});
app.get('/new', function(req,res){
  res.render('newpost.jade');  
});
app.post('/brandnew', function(req, res){
  console.log(req.body)
  db('local.local').save(req.body);
  res.send('saved new post');
});
app.get('/login', function(req,res){
  res.render('loginform.jade');
});
app.post('/login', function(req,res){
  res.send('You logged in!');  
});
app.listen(3000);
console.log('running at localhost:3000');