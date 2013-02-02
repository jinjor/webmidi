(function(ns){
  
  var SynthDef = function(name, url, author, programs){
    this.name = name;
    this.url = url;
    this.author = author;
    this.programs = programs;
  };
  var GMPlayer = new SynthDef('GMPlayer', 'http://www.g200kg.com/en/docs/gmplayer/','g200kg', {
    1:{number:1, description:''},
    2:{number:2, description:''},
    3:{number:3, description:''},
    4:{number:4, description:''},
    5:{number:5, description:''},
    6:{number:6, description:''},
    7:{number:7, description:''},
    8:{number:8, description:''},
    9:{number:9, description:''},
    10:{number:10, description:''},
    11:{number:11, description:''},
    12:{number:12, description:''},
    13:{number:13, description:''},
    14:{number:14, description:''},
    15:{number:15, description:''},
    16:{number:16, description:''},
    17:{number:17, description:''},
    18:{number:18, description:''},
    19:{number:19, description:''},
    20:{number:20, description:''},
    21:{number:21, description:''},
    22:{number:22, description:''},
    23:{number:23, description:''},
    24:{number:24, description:''},
    25:{number:25, description:''},
    26:{number:26, description:''},
    27:{number:27, description:''},
    28:{number:28, description:''},
    29:{number:29, description:''},
    30:{number:30, description:''},
    31:{number:31, description:''},
    32:{number:32, description:''},
    33:{number:33, description:''},
    34:{number:34, description:''},
    35:{number:35, description:''},
    36:{number:36, description:''},
    37:{number:37, description:''},
    38:{number:38, description:''},
    39:{number:39, description:''},
    40:{number:40, description:''},
    41:{number:41, description:''},
    42:{number:42, description:''},
    43:{number:43, description:''},
    44:{number:44, description:''},
    45:{number:45, description:''},
    46:{number:46, description:''}
  });
  var WebBeeper = new SynthDef('WebBeeper', 'http://www.g200kg.com/en/docs/webbeeper/','g200kg', {
    1:{number:1, description:''},
    2:{number:2, description:''},
    3:{number:3, description:''},
    4:{number:4, description:''},
    5:{number:5, description:''},
    6:{number:6, description:''},
    7:{number:7, description:''},
    8:{number:8, description:''},
    9:{number:9, description:''},
    10:{number:10, description:''},
    11:{number:11, description:''},
    12:{number:12, description:''},
    13:{number:13, description:''},
    14:{number:14, description:''},
    15:{number:15, description:''},
    16:{number:16, description:''},
    17:{number:17, description:''},
    18:{number:18, description:''},
    19:{number:19, description:''},
    20:{number:20, description:''},
    21:{number:21, description:''},
    22:{number:22, description:''},
    23:{number:23, description:''},
    24:{number:24, description:''},
    25:{number:25, description:''},
    26:{number:26, description:''},
    27:{number:27, description:''},
    28:{number:28, description:''},
    29:{number:29, description:''},
    30:{number:30, description:''},
    31:{number:31, description:''},
    32:{number:32, description:''},
    33:{number:33, description:''},
    34:{number:34, description:''},
    35:{number:35, description:''},
    36:{number:36, description:''},
    37:{number:37, description:''},
    38:{number:38, description:''},
    39:{number:39, description:''},
    40:{number:40, description:''},
    41:{number:41, description:''},
    42:{number:42, description:''},
    43:{number:43, description:''},
    44:{number:44, description:''},
    45:{number:45, description:''},
    46:{number:46, description:''}
  });
  var synthDefs = [GMPlayer, WebBeeper];
  
  if(!ns.org){org = {};}
  if(!org.jinjor){org.jinjor = {};}
  if(!org.jinjor.synth){org.jinjor.synth = {};}
  org.jinjor.synth.synthDefs = synthDefs;
  
})(this);

