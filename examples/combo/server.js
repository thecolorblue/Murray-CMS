
// if you want different settings for different environments
// not required
// app.configure('production', require('./production.settings.js'));
app.configure('development', require('./development.settings.js'));

var murray = require('./app.js');

murray.loadModules();

murray.loadAPI();
murray.loadViews();

murray.initInterfaces();

app.listen(process.env.PORT || 3000);


