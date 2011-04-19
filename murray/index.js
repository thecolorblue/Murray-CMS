//  Murray CMS Helpers
var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative,
    fs = require('fs');
    
var db = new Db('murray', new Server('127.0.0.1', 27017, {}));

/* Building the sidebar from /plugins folder */
var plugins = {};
var sidebar = [];
var pluginfolder = __dirname + '/plugins';
fs.readdir(pluginfolder,function(err,files){
  for (var i = 0;i < files.length;i++){
    var filetype = /\Wjs$/;
    if (filetype.test(files[i]) == true){
      var title = files[i].replace(filetype, '');
      var file = pluginfolder + '/' + files[i];
      plugins[title] = require(file);
      
    }  
  }
  for (var n in plugins){
    if(plugins[n].sidebaritem != undefined){
      sidebar.push(plugins[n].sidebaritem);
    }
  }
});

var contenttype = {};
var ctype = {};
var cfolder = __dirname + '/ctypes';
fs.readdir(cfolder,function(err,files){
  for (var i = 0;i < files.length;i++){
    var filetype = /\Wjs$/;
    if (filetype.test(files[i]) == true){
      var title = files[i].replace(filetype, '');
      var file = cfolder + '/' + files[i];
      contenttype[title] = require(file);
      
    }  
  }
  for (var n in contenttype){
    console.log(contenttype[n]);
    if(contenttype[n].form != ''){
      var cform = {};
      cform.title = contenttype[n].Meta.title;
      cform.form = contenttype[n].Form;
      ctype[cform.title] = cform;
      console.log(cform);
    }
  }
  console.log(ctype);
});

/*
 *  Get Posts
 *  pulls all of the posts in 'posts' collection
 *  sends first 8 to be rendered reverse sorted by date
 *  checks if user is logged in
 */
exports.getposts = function(req,res,options,callback){
  var filters = {};
  if(options != undefined){
    if(options.pid != undefined){
      options.pid = parseFloat(options.pid);
    }
    filters = options;
  }
  var config = {'limit':8,'sort':[['date', -1]]};
  db.open(function(err, db){
    db.collection('posts', function(err, collection){
      collection.find(filters,config, function(err, cursor){
        cursor.toArray(function(err, posted){
          if(req.cookies.loggedin == 1){
            var logged = true;
          } else {
            var logged = false;
          }
          if(callback != ''){
          console.log(posted);
          console.log(sidebar);
          res.render('index.jade', {posts: posted, logged: logged, sidebar:sidebar,ctype:ctype});
          } else {
            callback();
          }
          db.close();
        });
      });
    });
  });
};
/*
 *  Create Post
 *  Looks for postcount for pid of new post
 *  adds date and pid to new post
 *  saves new post in murray.posts
 */
exports.createpost = function(req,res,newpost){
  var blogpost = req.body;
  console.log(req.body);
  db.open(function(err, db){
    db.collection('settings', function(err, collection){
      collection.find({}, function(err, cursor){
        cursor.toArray(function(err, posted){
          var postnum = posted[0].postcount;
          console.log(posted[0].postcount);
          blogpost.pid = ++postnum;
          blogpost.date = new Date();
          blogpost.user = req.cookies.user;
          console.log(blogpost);
          db.collection('posts',function(err,collection){
            collection.insert([blogpost],function(err,docs){
              db.collection('settings',function(err,collection){
                collection.update({name:'postcounter'},
                  {$inc:{postcount:1}}, {safe:true},
                  function(err,docs){
                    console.log(err);
                    console.log(docs);
                    db.close();
                    res.send('saved new post\n</p><a href="/">Head Back Home</a></p>\n');
                  }
                );            
              });
            });
          });
        });
      });
    });
  });
};
/*
 *  Login
 *  Handles checking username and password is correct
 *  and creates cookies
 */
exports.login = function(req,res){
  db.open(function(err, db){
    db.collection('users', function(err, collection){
      collection.find({}, function(err, cursor){
        cursor.toArray(function(err, users){
          for (var i = 0; i < users.length; i++){
            if(users[i].name == req.body.name && users[i].pass == req.body.password){
              res.cookie('loggedin', '1', 
                { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
              res.cookie('user', req.body.name, 
                { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
              res.send('You logged in!\n</p><a href="/">Head Back Home</a></p>');  
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
/*
 *  Logout
 *  clears out loggedin and user cookie
 */
exports.logout = function(req,res){
  res.clearCookie('loggedin','user' );
  res.send('logged out');
};

/*
 *  isIn
 *  Checks to see if the user is logged in
 *  returns the callback given
 */
exports.isIn = function(cookie, callback){
  if(cookie.loggedin == 1){
    callback();
  } else {
    console.log('you need to log in for this');
  }
};

exports.plugins = function(folder,callback){
  fs.readdir(folder,function(err,files){
    for (var i = 0;i < files.length;i++){
      var filetype = /\Wjs$/;
      if (filetype.test(files[i]) == true){
        var title = files[i].replace(filetype, '');
        exports.ext[title] = require(folder + '/' + files[i]);
      }
    }
    callback();
  });
};
/*
 *  Create User
 *  Creates hash of password
 *  Creates entry in murray.users with username and hash
 *  (todo)
 */