var http    = require('http')
    ,fs      = require('fs')
    ,sys     = require('sys')
    ,path    = require('path')
    ,io	     = require('socket.io')
    ,express = require('express')
    ,log4js  = require('log4js');
    
/*
log4js.configure({
	appenders: [{
	"type": "dateFile",
	"filename": "log/access.log",
	"pattern": "-yyyy-MM-dd"
	}]
});
var logger = log4js.getLogger('dateFile');
*/

var debugMode = process.env.NODE_APP_MODE === 'debug';
console.log(process.env.HOST);
console.log(process.env.PORT);
var host = process.env.NODE_APP_HOST;
var port = process.env.PORT || process.env.NODE_APP_PORT;
console.log('host: ' + host);

var app = express();
app.configure(function(){
  app.set('port', port);
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
var _oauth = require('oauth');




var dbType = process.env.NODE_APP_DB_TYPE;
var DbManager = (dbType == 'mongo') ? function(){
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;
  mongoose.connect(process.env.NODE_APP_DB_URL);
  
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
    if (process.env.NODE_APP_DB_URL) {
      var rtg   = require("url").parse(process.env.NODE_APP_DB_URL);
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
app.get('/signin/twitter/:address', function(req, res) {
    var address = req.params.address;
    var oauth = new (_oauth.OAuth)(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.NODE_TWITTER_CONSUMER_KEY, // consumer key
      process.env.NODE_TWITTER_CONSUMER_KEY, // consumer secret
      '1.0',
      'http://' + host + ':' + process.env.NODE_TWITTER_CALLBACK_PORT + '/signin/twitter/' + address, // callback URL
      'HMAC-SHA1'
    );
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
            res.redirect('/tunes/' + address);
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
app.get('/signout/:address', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/tunes/' + req.params.address);
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
server.listen(port, function(){
  console.log("Express server listening on port " + port);
});

io.listen(server).sockets.on('connection', function (socket) {
  console.log('connected!');
  //console.log(socket);
  socket.on('y_g', function (data) {
    socket.emit('y_g', data);
    socket.broadcast.emit('y_g', data);
  });
});