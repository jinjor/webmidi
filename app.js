var http    = require('http')
    ,fs      = require('fs')
    ,sys     = require('sys')
    ,path    = require('path')
    ,io	     = require('socket.io')
    ,express = require('express')
    ,conf    = require('./conf.js')
    ,secret  = require('./secret.js');

var debugMode = process.env.APP_MODE === 'debug';
var host = debugMode ? 'localhost' : conf.host;
console.log('host: ' + host);

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
    secret.twitter.consumerKey, // consumer key
    secret.twitter.consumerSecret, // consumer secret
    '1.0',
    'http://' + host + ':' + (debugMode ? conf.port : 80) + '/signin/twitter', // callback URL
    'HMAC-SHA1'
);


var dbType = 'mongo';
var DbManager = (dbType == 'mongo') ? function(){
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;
  if(debugMode){
    //local
    mongoose.connect('mongodb://localhost/web-midi');
  }else if(process.env.MONGOHQ_URL){
    //heroku
    mongoose.connect(process.env.MONGOHQ_URL);
  }else{
    //nodejitsu
    mongoose.connect(secret.mongo.uri);
  }
  
  mongoose.model('tunes', new Schema({
      address: { type: String, index: {unique: true, dropDups: true} },
      tracks: String
  }));
  
  var Tune = mongoose.model('tunes');
  this.tuneDao = {
    loadTune: function(address, callback){
      Tune.findOne({address: address}, function(e, tune){
        if(e){
          callback(e);
        }else{
          callback(e, tune ? tune.tracks : null);
        }
      });
    },
    saveTune: function(address, contents, callback){
      Tune.findOne({address: address}, function(e, tune){
        if(e){
          console.log(e);
          throw e;
        }
        if(!tune){
          tune = new Tune();
        }
        tune.address = address;
        tune.tracks = contents;
        tune.save(callback);
      });
    }
  }
} : function(){
  var redis = (function(){
    if (process.env.REDISTOGO_URL) {
      var rtg   = require("url").parse(process.env.REDISTOGO_URL);
      var redis = require("redis").createClient(rtg.port, rtg.hostname);
      redis.auth(rtg.auth.split(":")[1]); 
      return redis;
    } else {
      return require("redis").createClient();
    }
  })();
  this.tuneDao = {
    loadTune: function(address, callback){
      redis.get(address, callback);
    },
    saveTune: function(address, contents, callback){
      redis.set(address, contents, callback);
    }
  }
};
var dbManager = new DbManager();
var tuneDao = dbManager.tuneDao;

app.get(/\/tunes\/.+/, function(req, res){
  console.log('user:' + req.session.user);
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
            res.redirect('/tunes/hoge');//TODO
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

app.post('/saveContents', function(req, res){
  var user = req.session.user;
  if(!user){
    res.send('', 400);
  }else{
    var address = req.body.address;
    var contents = req.body.contents;
    tuneDao.saveTune(address, contents, function(e){
      e && console.log(e);
      res.send(contents);
    });
  }
});
app.get('/contents/:address', function(req, res){
  var address = req.params.address;
  tuneDao.loadTune(address, function(e, contents){
    if(e){
      console.log(e);
      res.send(e, 500);
    }else{
      console.log(contents);
      res.send(contents);
    }
  });
});


var server = http.createServer(app);
server.listen(conf.port, function(){
  console.log("Express server listening on port " + conf.port);
});