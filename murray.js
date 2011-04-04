exports.getposts = function(db,req,res){
  db.open(function(err, db){
    db.collection('local', function(err, collection){
      collection.find({}, {'limit':8,'sort':[['date', -1]]}, function(err, cursor){
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
};
exports.createpost = function(db,req,res,posts){
  var blogpost = req.body;
  db.open(function(err, db){
    db.collection('settings', function(err, collection){
      collection.find({'postcount':'num'}, function(err, cursor){
        cursor.toArray(function(err, posted){
          var postnum = posted[0].actual;
          blogpost.pid = postnum + 1;
          blogpost.date = new Date();
          blogpost.user = req.cookies.user;
          console.log(blogpost);
          posts('local.local').save(blogpost);
          res.send('saved new post');
          collection.update(
            {'postcount':'num'},
            {'postcount':'num','actual':blogpost.pid}, 
            function(err,docs){
              db.close();
          });            
        });
      });
    });
  });
};
exports.login = function(db,req,res){
  db.open(function(err, db){
    db.collection('users', function(err, collection){
      collection.find({}, function(err, cursor){
        cursor.toArray(function(err, posted){
          for (var i = 0; i < posted.length; i++){
            if(posted[i].name == req.body.name && posted[i].pass == req.body.password){
              res.cookie('loggedin', '1', 
                { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
              res.cookie('user', req.body.name, 
                { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
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
};
exports.logout = function(){
  res.clearCookie('loggedin','user' );
  res.send('logged out');
};