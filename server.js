var express = require('express');
app = express();


// if you want different settings for different environments
// not required
app.configure('production', require('./production.settings.js'));
app.configure('development', require('./development.settings.js'));

require('./app');
require('./schema.js');
require('./routes');

app.listen(process.env.PORT || 3000);


