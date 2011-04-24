var settings = require('./settings.js');
var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative,
    fs = require('fs'),
    crud = require('./db.js');
    
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

var htmlTemplate = '';
fs.readFile(__dirname + '/theme/template.html',encoding='utf8',function(err,data){
  if(err) console.log(err);
  htmlTemplate = data;
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
    if(contenttype[n].form != ''){
      var cform = {};
      cform.title = contenttype[n].Meta.title;
      cform.form = contenttype[n].Form;
      cform.view = contenttype[n].View;
      ctype[cform.title] = cform;
    }
  }
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
  if(filters.form != undefined){
    console.log('looking for form');
    var content = {};
    content.forms = ctype[filters.form].form;
    substitute(htmlTemplate, content,function(html){
      res.end(html);  
    });
  } else {
    var config = {'limit':8,'sort':[['date', -1]]};
    crud.read(filters,config,'posts',function(posted,err){
            if(req.cookies.loggedin == 1){
              var logged = true;
            } else {
              var logged = false;
            }
            if(callback != ''){
              var parts = {};
              forPosts(posted,function(array){
                parts.posts = array.join('');
                console.log(parts);
                substitute(htmlTemplate,parts,function(html){
                  res.writeHead(200,{'Content-Type':'text/html'});
                  res.end(html);            
                });
              });
            } else {
              callback(posted);
            }
    });
  }
};

/*
 *  Get Form
 *
 */
exports.getForm = function(res,options){
  var forms = [];
  var formType = options.ctype;
  forms.forms = ctype[formType].form;
  console.log(forms);
  substitute(htmlTemplate,forms,function(html){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(html);            
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
  var user = req.cookies.user;
  crud.create(blogpost,user,function(err,docs){
    if(err){
      console.log(err);
    } else {
      res.send('saved new post\n</p><a href="/">Head Back Home</a></p>\n');
    }
  });
/*  console.log(req.body);
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
  }); */
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
 *  Substitute
 *  takes template (string), array of content, and callback
 *  returns template with content
 */
function substitute(string,array,callback){
  var re = /<:\s(\w+)\s:>/g;
  var searchString = string;
  var result = searchString.match(re);
  for (i=0;i<result.length;i++){
    var reg = /\s(\w+)\s/;
    var tarray = reg.exec(result[i]);
    var templateName = tarray[1];
    var replacement = array[templateName];
    searchString = searchString.replace(result[i],replacement);
  }
  callback(searchString);
};
/* Simple For Each */
function forPosts(array,callback){
  var renderedPosts = [];
  for (i=0;i<array.length;i++){
    var type = array[i].submit;
    var view = ctype[type].view;
    substitute(view,array[i],function(rendered){
      renderedPosts[i] = rendered;
    });
  }
  callback(renderedPosts);
};

/*
 *  Create User
 *  Creates hash of password
 *  Creates entry in murray.users with username and hash
 *  (todo)
 */