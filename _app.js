var midi     = require('midi')
    ,http    = require('http')
    ,fs      = require('fs')
    ,sys     = require('sys')
    ,path    = require('path')
    ,io	     = require('socket.io')
    ,express = require('express');

//---------
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});
app.get('/', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  var rs = fs.createReadStream('index.html');
  sys.pump(rs, res);
});

//---------
//var input = new midi.input();
//console.log(input.getPortCount());
//console.log(input.getPortName(0));
//input.openPort(0);

var server = http.createServer(app);
io.listen(server).sockets.on('connection', function (socket) {
  console.log('connected!');
  
  // Set up a new input.
  
  /*
  input.on('message', function(deltaTime, message) {
    socket.emit('midi', {
      deltaTime: deltaTime,
      message: message
    });
  });
  */

  socket.on('disconnect', function() {
    console.log('disconnected!');
  });
});

server.listen(3000, function(){
  console.log("Express server listening on port " + 3000);
});