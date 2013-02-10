package org.jinjor.synth;

class SynthDef{
  public var name : String;
  public var url : String;
  public var author : String;
  public var programs : Dynamic;
  
  public function new(name, url, author, programs) {
    this.name = name;
    this.url = url;
    this.author = author;
    this.programs = programs;
  }
  private static var GMPlayer = new SynthDef('GMPlayer', 'http://www.g200kg.com/en/docs/gmplayer/','g200kg', {
    "1":{number:1, description:''},
    "2":{number:2, description:''},
    "3":{number:3, description:''},
    "4":{number:4, description:''},
    "5":{number:5, description:''},
    "6":{number:6, description:''},
    "7":{number:7, description:''},
    "8":{number:8, description:''},
    "9":{number:9, description:''},
    "10":{number:10, description:''}
  });
  
  private static var WebBeeper = new SynthDef('WebBeeper', 'http://www.g200kg.com/en/docs/webbeeper/','g200kg',{
    "1":{number:1, description:''},
    "2":{number:2, description:''},
    "3":{number:3, description:''},
    "4":{number:4, description:''},
    "5":{number:5, description:''},
    "6":{number:6, description:''},
    "7":{number:7, description:''},
    "8":{number:8, description:''},
    "9":{number:9, description:''},
    "10":{number:10, description:''}
  });
  public static var synthDefs = [GMPlayer, WebBeeper];
}
