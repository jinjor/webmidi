package org.jinjor.webmidi;

import org.jinjor.webmidi.Tune;
import org.jinjor.synth.SynthDef;
import haxe.Timer;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

class Sequencer{
  
  public var location : Int;
  public var tune : Tune;
  public var playStatus : PlayStatus;
  private var getSynth : SynthDef -> Dynamic;
  
  public function new(tune : Tune, getSynth : SynthDef -> Dynamic){
    this.location = 0;
    this.tune = tune;
    this.playStatus = PlayStatus.Stop(0);
    this.getSynth = getSynth;
  }
  private function getLocation(){
    return switch(this.playStatus){
      case Stop(location) : location;
      case Playing(playState) : playState.getLocation();
      case Recording(recState) : recState.getLocation();
    };
  }
  public function isPlaying(){
    return switch(this.playStatus){
      case Stop(location) : false;
      case Playing(playState) : true;
      case Recording(recState) : true;
    };
  }
  
  public function send(t, m0, m1, m2){
    switch(playStatus) {
      case Stop(location):{};
      case Playing(playState):{};
      case Recording(recState): {recState.send(m0, m1, m2);};
    }
    this.tune.getSelectedTracks().foreach(function(track){
      sendMidiMessage(track, m0, m1, m2);//キーボードからはchannel1で来る前提
      return true;
    });
  }
  public function rec(rerender : Void -> Void, onStop : Void -> Void){
    this.play(rerender, onStop, true);
  }
  public function stopPlaying(){
    this.playStatus = PlayStatus.Stop(getLocation());
    this.tune.tracks.foreach(function(track){
      this.getSynth(track.synthDef).allSoundOff();
      return true;
    });
  }
  private function sendMidiMessage(track, m0, m1, m2){
    this.getSynth(track.synthDef).sendMidiMessage(m0 + track.channel - 1, m1, m2);
  }
  public function programChange(track : Track){
    this.sendMidiMessage(track, 0xc0, track.program.number, 0);
  }
  public function play(rerender : Void -> Void, onStop : Void -> Void, record : Bool){
    if(this.tune.tracks.length <= 0){
      return;
    }
    var that = this;
    if(record){
      this.playStatus = PlayStatus.Recording(new RecState(function(note, velocity, startTime, endTime){
        that.tune.getSelectedTracks().foreach(function(track){
          track.recNote(note, velocity, that.tune.msToTick(startTime), that.tune.msToTick(endTime));
          return true;
        });
      },function(time, m0, m1, m2){
        that.tune.getSelectedTracks().foreach(function(track){
          track.recElse(that.tune.msToTick(time),m0, m1, m2);
          return true;
        });
      }));
    }else{
      this.playStatus = PlayStatus.Playing(new PlayState());
    }
    
    var messageTrackPairs : Array<Array<Dynamic>> = this.tune.tracks.fold(function(track : Track, memo : Array<Array<Dynamic>>){
      var pairs = track.messages.map(function(mes){ return [mes, track]; }).array();
      return memo.concat(pairs);
    }, []);

    messageTrackPairs.sort(function(a, b){
      return a[0][0] - b[0][0];
    });
    //trace(messageTrackPairs);
    that.tune.tracks.foreach(function(track){
      programChange(track);//synthロード後にダメ押し
      return true;
    });
    var index = 0;
    var current : Array<Dynamic> = null;
    var currentTrack : Track = null;
    var currentMessage : Array<Int> = null;
    var that = this;
    var r : Dynamic = {};
    r.tick = function(){
      var location = getLocation();
      current = if(index < messageTrackPairs.length) messageTrackPairs[index] else null;
      
      if(current == null){
        that.stopPlaying();
        return;
      }
      currentTrack = current[1];
      currentMessage = current[0];
      if(switch(that.playStatus){
        case Stop(location) : true;
        case Playing(playState) : false;
        case Recording(recState) : false;
      }){
        that.stopPlaying();
      }else if(current == null){
        that.stopPlaying();
      }else if(that.tune.tickToMs(currentMessage[0]) < location){
        
        sendMidiMessage(currentTrack, currentMessage[1], currentMessage[2], currentMessage[3]);
        index++;
        r.tick();
      }else{
        Timer.delay(r.tick, 1);
      }
    };
    r.render = function(){
      rerender();
      if(switch(that.playStatus){
        case Stop(location) : false;
        case Playing(playState) : true;
        case Recording(recState) : true;
      }){
        Timer.delay(r.render, 50);
      }
    };
    r.tick();
    r.render();
  }
  public function gainPxPerMs(amount){
    this.tune.gainPxPerMs(amount);
  }
}
