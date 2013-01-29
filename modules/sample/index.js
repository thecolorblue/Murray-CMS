var OAuth = require('oauth').OAuth;
var qs = require('querystring');
var twitterClient = require('twitter-js')('', '');

var url = "https://api.twitter.com/1.1/statuses/update.json";

var oa = new OAuth("https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"",  // app.env.twitter.appToken
	"", // app.env.twitter.appSecret
	"1.0",
	app.env.domain + "/twitter/oauth", // app.env.twitter.auth
	"HMAC-SHA1");

module.exports = {
	post : function(accessToken, accessSecret, content, res) {

		oa.post( url,
			accessToken, accessSecret, content,
			function(err, data) {
				if(err) console.log('twitter post error:',err);
				res.json(data);
				console.log('tumblr response:',data);
		});
		
	},
	login : function(req, res) {

		oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if(error) {
				console.log('error');
				console.log(error);
			}
			else {
				// store the tokens in the session
				req.session.oa = oa;
				req.session.oauth_token = oauth_token;
				req.session.oauth_token_secret = oauth_token_secret;

				// redirect the user to authorize the token
				res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token="+oauth_token);
			}
		});

	},
	oauth : function(req, res) {

		oa.getOAuthAccessToken(
			req.session.oauth_token,
			req.session.oauth_token_secret,
			req.param('oauth_verifier'),
			function(error, oauth_access_token, oauth_access_token_secret, results2) {

				if(error) {
					console.log('error');
					console.log(error);
				}
				else {
					// everything is good, your user has logged in
				}
		});
	}
};
