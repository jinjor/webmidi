var fs = require('fs')
, path = require('path')
, async = require('async')
, dir = '.';

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(dir, function(err, results) {
  if (err) throw err;
  async.map(results, function(item, callback) {
    if(item.indexOf('/node_modules/') < 0 &&
       item.indexOf('/data/') < 0 &&
       item.indexOf('webmidi.js') < 0 &&
       item.indexOf('.git/') < 0
    ){
      fs.readFile(item, 'utf8', function(err, data) {
        if(err) throw err;
        //console.log(path.basename(filename) + ':' + data.split('\n').length);
        var count = data.split('\n').length;
        callback(null, [item, count]);
      });
    }else{
      callback();
    }
  },
  function(err, results) {
    var total = 0;
    var fileCount = 0;
    for(var index in results){
      var file_count = results[index];
      if(file_count){
        var file = file_count[0];
        var count = file_count[1];
        console.log(("      " + count).slice(-6) + " " + file);
        total += count;
        fileCount++;
      }
    }
    console.log("fileCount: " + fileCount);
    console.log("total: " + total);
  });
});