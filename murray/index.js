var settings = require('./settings.js');
var fs = require('fs'),
    crud = require('./db.js');
var app = require('express').createServer();
var express = require('express');

app.use(express.cookieParser());
app.use(express.session({secret:'hamburgers'}));
   
/* Building all the pieces you will need later */
var plugins = {};  // general plugins
var sidebar = [];  // array of elements to go in sidebar of template
var widgets = [];  // text strings that go into the sidebar
var gadgets = [];  // a sidebar element that needs some extra processing
var appliances = {};  // plugins that add functionality to Murray

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
var pretestjson = fs.readFileSync(__dirname+'/themes/brandnew/index.json','utf8');
var themesFolder = __dirname + '/themes';
var testjson = JSON.parse(pretestjson);

fs.readdir(themesFolder, function(err,files){
  var tempatesAvailable = {};
  for(var i = 0; i < files.length ; i++){
    if(files[i] != 'template.html' && files[i] != '.DS_Store'){
      var templatejson = JSON.parse(fs.readFileSync(__dirname+'/themes/'+files[i]+'/index.json','utf8'));
      var template = {};
      template.name = templatejson.Name;
    }
  }
});

var htmlTemplate = '';
function getTemplate(templateName,callback){
  var error = {};
  var foundTemplate = '';
  if(templateName === 'default'){
    fs.readFile(
      __dirname + '/theme/template.html',
      encoding='utf8',
      function(err,data){
        if(err) console.log(err);
        htmlTemplate = data;
        callback(error,foundTemplate);
      }
    );
  } else {
    for(var i=0;i<templatesAvailable.length;i++){
      if(templateName == templatesAvailable[i].Name){
        fs.readFile(
          __dirname+'/theme/'+templatesAvailable[i].Name+'index.html',
          encoding='utf8',
          function(err,data){
            if(err){console.log(err)};
            htmlTemplate = data;
            callback(error,foundTemplate);
          }  
        );
      } else {
        error.push = 'template' + templateName + 'could not be found';
        callback(error,foundTemplate);
      }
    }  
  }
}
var ctype = {};
var cfolder = __dirname + '/ctypes';
fs.readdir(cfolder,function(err,files){
  var contenttype = {};
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
              parts.sidebar = sidebar;
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
};
/*
 *  Login
 *  Handles checking username and password is correct
 *  and creates cookies
 */
exports.login = function(req,res){
  var config = {'sort':[['date', -1]]};
  var loggedin = false;
  crud.read({},config,'users',function(users,err){
    for (var i = 0; i < users.length; i++){
      if(users[i].name == req.body.name && users[i].pass == req.body.password){
        res.cookie('loggedin', 1, 
          { path: '/', expires: new Date(Date.now() + 900000)});
        res.cookie('user', req.body.name, 
          { path: '/', expires: new Date(Date.now() + 900000)});
        loggedin = true;
      } 
    }
    if (loggedin = true){
      res.send('You logged in!\n</p><a href="/">Head Back Home</a></p>');  
    } else {
      res.send('you should try again');
    }
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
 
/*
 *  Appliance Prototype
 *  creates an appliance
 *  (todo) create hooks in Murray
 */
function Appliance(name, hook){
  this.name = name;
  this.hook = hook;
}
Appliance.prototype = {
  process: function(input){
    this.functions.push(input);
  }
}
 