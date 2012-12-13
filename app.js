var http    = require('http')
    ,fs      = require('fs')
    ,sys     = require('sys')
    ,path    = require('path')
    ,io	     = require('socket.io')
    ,express = require('express');

var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 8080);
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

var server = http.createServer(app);
server.listen(8080, function(){
  console.log("Express server listening on port " + 8080);
});

io.listen(server).sockets.on('connection', function (socket) {
  console.log('connected!');
  socket.on('midi', function(message) {
    socket.emit('midi', message);
    socket.broadcast.emit('midi', message);
  });
  socket.on('echo', function(message) {
    socket.emit('echo', message);
  });
  socket.on('disconnect', function() {
    console.log('disconnected!');
  });
});