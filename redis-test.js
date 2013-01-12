var redis = (function(){
  var rtg   = require("url").parse(process.env.NODE_APP_DB_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]); 
  return redis;
})();

redis.set('hoga', 'MOGO', function(e){
  e && console.log(e);
  
  redis.get('hoga', function(e, data){
    if(e){
      console.log(e);
    }else{
      console.log(data);
    }
  });
});
