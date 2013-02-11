package org.jinjor.webmidi;

import org.jinjor.synth.SynthDef;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

enum PlayStatus{
  Stop(location : Int);
  Playing(playState : PlayState);
  Recording(recState : RecState);
}
class PlayState{
  private var startTime : Int;
  public function new() {
    this.startTime = Math.floor(Date.now().getTime());
  }
  public function getLocation() : Int {
    return Math.floor(Date.now().getTime()) - this.startTime;
  }
}
  
class RecState extends PlayState{
  public var keyCount : Int;
  public var noteOns : Array<Dynamic>;
  private var onNoteFinished : Int -> Int -> Int -> Int -> Void;
  private var onElse : Int -> Int -> Int -> Int -> Void;
    
  public function new(onNoteFinished, onElse) {
    super();
    this.keyCount = 0;
    this.noteOns = [];
    
    this.onNoteFinished = onNoteFinished;
    this.onElse = onElse;
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
  private function reset(){
    this.keyCount = 0;
    this.noteOns = [];
  }
  public function keyIsPressed() : Bool {
    return this.keyCount > 0;
  }
}

class Track {
  
  private static var trackId = 0;
  private static function createTrackId(){
    return ++trackId;
  }
  public var id : Int;
  public var name : String;
  public var synthDef : SynthDef;
  public var channel : Int;
  public var program : ProgramDef;
  public var selected : Bool;
  public var messages : Array<Array<Int>>;

  public function new(name, synthDef, channel : Int, program : ProgramDef, messages : Array<Array<Int>>){
    this.id = createTrackId();
    this.name = name;
    this.synthDef = synthDef;
    this.channel = channel.or(1);
    this.program = program.or(synthDef.programs[0]);
    this.selected = true;
    this.messages = messages.or([[Math.floor(1000*60*10/(1000*60/480*120)), 0x80, 62, 0]]);
  }

  public function recNote(note : Int, velocity : Int, startTime : Int, endTime : Int){
    this.messages.push([startTime, 0x90, note, velocity]);
    this.messages.push([endTime, 0x80, note, 0]);
  }
  public function recElse(time : Int, m0 : Int, m1 : Int, m2 : Int){
    this.messages.push([time, m0, m1, m2]);
  }
  public function deleteAll(){
    this.messages = [[Math.floor(1000*60*10/(1000*60/480*120)), 0x80, 62, 0]];
  }
}

class Tune {//容量と互換性の都合でSMF形式に準拠する

  private static var pxPerMsModes : Array<Float> = [1,2,4,8,16,32].map(function(ratio){
    return 1000 / (10*60*1000) * ratio;
  }).array();
  public var format : Int;
  public var timeMode : Int;
  public var tracks : Array<Track>;
  public var selectedTrackId : Int;
  public var pxPerMsMode : Int;
  
  public function new(){
    this.format = 1;
    this.timeMode = 480;
    this.tracks = [];
    this.selectedTrackId = -1;
    this.pxPerMsMode = 0;//1倍
  }
  
  public function refresh(smfData, synthDef : SynthDef){
    if(smfData.format != 1){
      throw 'まだ1しか受け付けません';
    }
    if(smfData.timeMode > 128*256){
      throw 'まだMSB=0しか受け付けません';
    }
    this.format = smfData.format;
    this.timeMode = smfData.timeMode;
    trace("timeMode=" + this.timeMode);
    var that = this;
    this.tracks = smfData.tracks.map(function(events){
      var deltaSum = 0;
      var messages = events.map(function(e){
        deltaSum += e[0];
        return [deltaSum, e[1], e[2], e[3]];
      });
      return new Track('_', synthDef, 1, null, messages);
    });
  }
  public function getPxPerMs(){
    return pxPerMsModes[this.pxPerMsMode];
  }
  public function hasMaxPxPerMs() : Bool {
    return this.pxPerMsMode >= pxPerMsModes.length-1;
  }
  public function hasMinPxPerMs() : Bool {
    return this.pxPerMsMode <= 0;
  }
  public function gainPxPerMs(amount){
    var pxPerMsMode = this.pxPerMsMode + amount;
    this.pxPerMsMode = (pxPerMsMode < 0) ? 0 : ((pxPerMsMode >= pxPerMsModes.length) ? pxPerMsModes.length-1 : pxPerMsMode);
  }
  public function addTrack(synthDef : SynthDef, channel){
    var track = new Track('_', synthDef, channel, null, null);
    this.tracks.push(track);//とりあえず1trackに
  }
  public function replaceTracksByLoadedTracks(tracks : Array<Track>, synths){
    var that = this;
    this.tracks = if(tracks != null) tracks.map(function(_track){
      return new Track(
        _track.name,
        _track.synthDef,
        _track.channel,
        _track.program,
        _track.messages);
    }).array() else [];
  }
  public function getSelectedTracks() : Array<Track> {
    var that = this;
    return this.tracks.filter(function(track){
      return that.trackIsSelected(track);
    }).array();
  }
  public function trackIsSelected(track) : Bool{
    return track.id == this.selectedTrackId;
  }
  public function tickToMs(tick) : Int {
    return Math.floor(this.getTimePerTick() * tick);
  }
  public function msToTick(ms) : Int {
    return Math.floor(ms / this.getTimePerTick());
  }
  public function getTimePerTick() : Float {
    var tempo = 120;//TODO
    return 1000*60/(this.timeMode * tempo);
  }
  
}