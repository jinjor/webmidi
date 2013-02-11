package org.jinjor.synth;

class ProgramDef{
  public var number : Int;
  public var description : String;
  public function new(number, description){
    this.number = number;
    this.description = description;
  }
}

class SynthDef{
  public var name : String;
  public var url : String;
  public var author : String;
  public var programs : Array<ProgramDef>;
  
  public function new(name, url, author, programs) {
    this.name = name;
    this.url = url;
    this.author = author;
    this.programs = programs;
  }
  
  private static var GMPlayer = new SynthDef('GMPlayer', 'http://www.g200kg.com/en/docs/gmplayer/','g200kg', [
    new ProgramDef(1,''),
    new ProgramDef(2,''),
    new ProgramDef(3,''),
    new ProgramDef(4,''),
    new ProgramDef(5,''),
    new ProgramDef(6,''),
    new ProgramDef(7,''),
    new ProgramDef(8,''),
    new ProgramDef(9,''),
    new ProgramDef(10,'')
  ]);
  
  private static var WebBeeper = new SynthDef('WebBeeper', 'http://www.g200kg.com/en/docs/webbeeper/','g200kg',[
    new ProgramDef(1,''),
    new ProgramDef(2,''),
    new ProgramDef(3,''),
    new ProgramDef(4,''),
    new ProgramDef(5,''),
    new ProgramDef(6,''),
    new ProgramDef(7,''),
    new ProgramDef(8,''),
    new ProgramDef(9,''),
    new ProgramDef(10,'')
  ]);
  
  public static var synthDefs = [GMPlayer, WebBeeper];
}
