# Murray CMS

This is more of an example than it is a CMS like express. There is no bootsrap helper to get you started, or plugins. What you see is what you get. 

That being said, I introduce Murray. 

Murray is designed to be lightweight and get out of your way as much as possible. It was built out of necessity. 

The inspiration came from a lack of features form require(). 
It does that it has to, but interacting between modules within 
a project is still tedious. For example, a controller should
not have to know where in the file system the model is held to
access its properties. This is the problem I wanted to solve
with Murray. 

Murray is named after [Elizabeth Murray](http://www.pbs.org/art21/artists/elizabeth-murray).


## Getting Started

Copy this repo into a folder. 

	git clone https://github.com/thecolorblue/Murray-CMS.git

Create your own copy of default.settings.js.

	mv default.settings.js development.settings.js

Create your schema.js and routes.js. Then edit the splash view, or create your own.

And you should be good to go. 


## Requirements

Murray is pretty opinionated right now. In the future this will change. You have to use Mongoose (and by default Mongodb), express, and mu2(mustache templates). 

If you run into any problems create an issue at https://github.com/thecolorblue/Murray-CMS

## Folders

### Views

Murray expects the folders in views to have a specific structure. Each folder needs an index.html, an index.js, and a package.json file. The html file will be your public page, index.js will be run on the server, and package.json will tell murray any settings specific to that view. 

Your index.js file should look something like this...

	modules.exports = function() {
		// this = package.json
	};

The context of the function you are setting as the exports will be whatever you put in package.json, so you will have access to your settings (although changing them will not do anything). This function will be run automatically when the view is loaded. Inside that function you will want to register any routes. 


	var Page = function(pack) {
		this.name = pack.name;
		app.get('/',this.handleRequest.bind(this));
	};

	Page.prototype.handleRequest = function(req,res){

		if (process.env.NODE_ENV == 'development') {
			mu.clearCache();
		}
		
		var stream = mu.compileAndRender('./views/'+ this.name +'/index.html', {
				"session" : req.session,
				"view" : this
		});

		util.pump(stream, res);
	};

	module.exports = Page;
	
What is the advantage of using prototype here?
Using prototype allows you to take advantage of javascript object oriented features. 
Adding functions to your page from somewhere else is very simple, just make sure they
are available either in your app object or thru require(). 

You also have access to anything you put in the views package.json file in the first argument
of the Page constructor function. As you can see in the example, we are setting the name
of the view from the name value in package.json.

If you have used this mustache template engine before, you will notice that I am passing the context to the template. This is not required by Murray but is a nice little trick since the context will have the folder name, which is needed for including things from the assets folder of this view. 

Oh right, the assets folder. If there is an assets folder in your view, Murray will make it accessible at /{{view.name}}/{{staticFile}}. This is not as verbose as other CMS's, you might run into naming issues with alot of pages, but thats not what Murray really excels at. It was originally designed for apps with only a couple pages, and heavy amounts of client side javascript. 

### Public

The public folder is pretty basic. Murray sets it up just like a express static folder. All the files in there will be available at /{{ file_name }}. I suggest putting  your javascript in /js, css in /css, and images in /images, so that you do not run into issues with any views with the same name. Keep in mind, this folder should only have assets that you are using on multiple pages. Anything specific to one page can go in that pages assets folder. 

### Modules

Modules are very simple, they are just a collection of functions or settings. I use them as models for outside resources, for example facebook integration. Each one needs an index.js and a package.json. The package.json file is empty for now, just there for future-proofing. Make sure to put an empty object in or it will error. 

The index file is setup more like a classic plugin you would require().

	module.exports = {
		post : function(options) {

			},
		login : function(req, res) {

		},
		oauth : function(accessKey, accesSecret) {

		}
	};

Do not put any application specific settings in here. Those should go in your settings file. 

## Files

TODO 
