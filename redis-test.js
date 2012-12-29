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

redis.set('hoge', 'FUGA', function(e){
  e && console.log(e);
});
redis.get('hoge', function(e, data){
  if(e){
    console.log(e);
  }else{
    console.log(data);
  }
});