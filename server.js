var express = require('express');
app = express();


// if you want different settings for different environments
// not required
app.configure('production', require('./production.settings.js'));
app.configure('development', require('./development.settings.js'));

var murray = require('./app.js');

require('./schema.js');

murray.loadModules();

// require('./routes');
// require('./sockets');

murray.loadAPI();
murray.loadViews();

// murray.createPackage();

app.listen(process.env.PORT || 3000);


