package org.jinjor.webmidi;
import js.Lib;

class RecState{
  public var keyCount : Int;
  public var noteOns : Array<Dynamic>;
  public var running : Bool;
  public var startTime : Int;
  
  public function new() {
    this.keyCount = 0;
    this.noteOns = [];
    this.running = false;
    this.startTime = Math.floor(Date.now().getTime());
  }
  public function onNoteFinished(startTime, endTime, velocity, time){
  }
  public function onElse(time, m0, m1, m2){
  }
  public function send(m0, m1, m2){
    var time = this.getLocation();
    if(m0 >> 4 == 9){
      this.noteOns[m1] = [time, m2];
      this.keyCount++;
    }else if(m0 >> 4 == 8){
      var startTime_velocity = this.noteOns[m1];
      if(startTime_velocity != null){
        this.onNoteFinished(m1, startTime_velocity[1], startTime_velocity[0], time);
      }
      this.noteOns[m1] = false;
      this.keyCount--;
    }else{
      this.onElse(time, m0, m1, m2);
    }
  }
  public function reset(){
    this.keyCount = 0;
    this.noteOns = [];
  }
  public function keyIsPressed() : Bool {
    return this.keyCount > 0;
  }
  public function getLocation() : Int {
    return Math.floor(Date.now().getTime()) - this.startTime;
  }
}

class Track {
  
  private static var trackId = 0;
  private static function createTrackId(){
    return ++trackId;
  }
  public var id : Int;
  public var name : String;
  public var synth : Dynamic;
  public var channel : Dynamic;
  public var program : Dynamic;
  public var selected : Bool;
  public var messages : Array<Array<Int>>;

  public function new(arg){
    trace(arg);
    this.id = createTrackId();
    this.name = arg.name;
    this.synth = arg.synth;
    this.channel = if(arg.channel != null) arg.channel else 1;
    this.program = if(arg.program != null) this.synth.programs[arg.program.number] else this.synth.programs[1];
    this.selected = true;
    this.messages = if(arg.messages != null) arg.messages else [[Math.floor(1000*60*10/(1000*60/480*120)), 0x80, 62, 0]];
    this.programChange(this.program.number);
  }

  public function recNote(note : Int, velocity : Int, startTime : Int, endTime : Int){
    this.messages.push([startTime, 0x90, note, velocity]);
    this.messages.push([endTime, 0x80, note, 0]);
  }
  public function recElse(time : Int, m0 : Int, m1 : Int, m2 : Int){
    this.messages.push([time, m0, m1, m2]);
  }
  public function noteOn(note : Int, velo : Int) {
    this.putMidi(0x90, note, velo);
  }
  public function noteOff(note) {
    this.putMidi(0x80, note, 0);
  }
  public function programChange(number : Int) {
    this.putMidi(0xc0, if(number != null) number else this.program.number, 0);
  }
  public function allSoundOff() {
    this.synth.allSoundOff();
  }
  public function putMidi(m0 : Int, m1 : Int, m2 : Int){
    this.synth.sendMidiMessage(m0 + this.channel - 1, m1, m2);//キーボードからはchannel1で来る前提
  }
  public function deleteAll(){
    this.messages = [[Math.floor(1000*60*10/(1000*60/480*120)), 0x80, 62, 0]];
  }
  public function onChangeSynth(){
    this.program = this.synth.programs[1];
  }
  
}