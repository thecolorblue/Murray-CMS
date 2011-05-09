var connect = require('connect');
var Cookies = require('cookies');
var server = connect.createServer(
  connect.cookieParser()
  , function(req,res,next){
    var cookies = new Cookies(req,res);
    cookies.set('signed','bar');
   res.setHeader('Set-Cookie','Yes=Something else');
   res.end(JSON.stringify(req.cookies)); // {"signed":"bar","yes":"Something else"}
  }
)
server.listen(3000);