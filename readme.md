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

Check out the examples in the examples folder. There is one using express, one using thrift and one that combines the two.

## Requirements

Murray is pretty laid back, its only requirements are coffeescript and cson which lets you write .json files in coffeescript. All other requirements that you will need are related to either the interfaces or the views that you write. 

## Folders

### Interfaces

Interfaces are the IO of your application. Express, mongoose, thrift, MySQL will all get their own folder in /interfaces. Each interface file requires a index.js and a package.json file. Everything thing else in the folder will be ignored by murray and can be used to organize interface requirements. An example of this in the express demo is the routes.cson file that is read index.js.

There are two steps to loading an interface. You might not need the second one so you can ignore it if you want. First, the index.js file is loaded. Module.exports in index.js will be set to app.interfaces[interface_name]. 


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

### app.js

This is the very first thing that loads. It creates the global app object and provides some helpers. Your server.js file will need to run the helpers to load everything in the correct order. 

The global app object does have one helper that will help you search thru your interfaces/modules/views. app.find() will look through the interfaces, modules, and views for whatever you pass as the first argument. Look at the examples for how this is done. 

## Todo

- tests
- connect plugin integration