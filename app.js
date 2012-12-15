var http    = require('http')
    ,fs      = require('fs')
    ,sys     = require('sys')
    ,path    = require('path')
    ,io	     = require('socket.io')
    ,express = require('express')
    ,conf    = require('./conf.js').conf;

var app = express();
app.configure(function(){
  app.set('port', conf.port);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

var oauth = new (require('oauth').OAuth)(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    conf.twitter.consumerKey, // consumer key
    conf.twitter.consumerSecret, // consumer secret
    '1.0',
    'http://' + conf.host + ':' + conf.port + '/signin/twitter', // callback URL
    'HMAC-SHA1'
);

app.get('/', function(req, res){
  console.log(req.session.user);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var rs = fs.createReadStream('index.html');
  sys.pump(rs, res);
});
app.get('/session', function(req, res){
  res.send(req.session.user);
});

app.get('/signin/twitter', function(req, res) {
    var oauth_token    = req.query.oauth_token;
    var oauth_verifier = req.query.oauth_verifier;
    
    if (oauth_token && oauth_verifier && req.session.oauth) {
      oauth.getOAuthAccessToken(
        oauth_token, null, oauth_verifier,
        function(error, oauth_access_token, oauth_access_token_secret, results) {
          if (error) {
            res.send(error, 500);
          } else {
            req.session.user = results.screen_name;
            res.redirect('/');
          }
        }
      );
    } else {
      oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        if (error) {
          res.send(error, 500);
        } else {
          req.session.oauth = {
            oauth_token: oauth_token,
            oauth_token_secret: oauth_token_secret,
            request_token_results: results
          };
          res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + oauth_token);
        }
      });
    }
});
app.get('/signout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

var server = http.createServer(app);
server.listen(conf.port, function(){
  console.log("Express server listening on port " + conf.port);
});