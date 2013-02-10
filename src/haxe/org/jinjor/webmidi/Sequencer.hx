package org.jinjor.webmidi;

import org.jinjor.webmidi.Tune;
import haxe.Timer;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

class Sequencer{
  public var location : Int;
  public var tune : Tune;
  public var playing : String;
  public var recState : RecState;
  
  public function new(tune){
    this.location = 0;
    this.tune = tune;
    this.playing = null;
    this.recState = null;
  }
  
  public function send(t, m0, m1, m2){
    this.recState.send(m0, m1, m2);
    this.tune.getSelectedTracks().foreach(function(track){
      track.putMidi(m0, m1, m2);
      return true;
    });
  }
  public function rec(rerender){
    this.play(rerender, 'recoding');
  }
  public function stopPlaying(){
    this.tune.tracks.foreach(function(track){
      track.allSoundOff();
      return true;
    });
  }
  public function play(rerender, optMode : String){
    if(this.tune.tracks.length <= 0){
      return;
    }
    var that = this;
    this.recState = new RecState();
    if(optMode == 'recoding'){
      this.recState.onNoteFinished = function(note, velocity, startTime, endTime){
        that.tune.getSelectedTracks().foreach(function(track){
          track.recNote(note, velocity, that.tune.msToTick(startTime), that.tune.msToTick(endTime));
          return true;
        });
      };
      this.recState.onElse = function(time, m0, m1, m2){
        that.tune.getSelectedTracks().foreach(function(track){
          track.recElse(that.tune.msToTick(time),m0, m1, m2);
          return true;
        });
      };
    }
    var messageTrackPairs : Array<Array<Dynamic>> = this.tune.tracks.fold(function(track : Track, memo : Array<Array<Dynamic>>){
      var pairs = track.messages.map(function(mes){ return [mes, track]; }).array();
      return memo.concat(pairs);
    }, []);
    
    this.playing = optMode.or('playing');
    messageTrackPairs.sort(function(a, b){
      return a[0][0] - b[0][0];
    });
    //trace(messageTrackPairs);
    that.tune.tracks.foreach(function(track){
      track.programChange(null);//synthロード後にダメ押し
      return true;
    });
    var index = 0;
    var current : Array<Dynamic> = null;
    var currentTrack : Track = null;
    var currentMessage : Array<Int> = null;
    var that = this;
    var r : Dynamic = {};
    r.tick = function(){
      var location = that.recState.getLocation();
      current = if(index < messageTrackPairs.length) messageTrackPairs[index] else null;
      currentTrack = current[1];
      currentMessage = current[0];
      if(that.playing == null){
        that.stopPlaying();//念のため
      }else if(current == null){
        that.stop();
      }else if(that.tune.tickToMs(currentMessage[0]) < location){
        currentTrack.putMidi(currentMessage[1], currentMessage[2], currentMessage[3]);
        index++;
        r.tick();
      }else{
        Timer.delay(r.tick, 1);
      }
    };
    r.render = function(){
      if(that.playing != null){
        var s = Date.now().getTime();
        rerender();
        Timer.delay(r.render, 30);
      }
    };
    r.tick();
    r.render();
  }

  public function stop(){
    trace("stop");
    //$scope.recState = null;
    this.location = 0;
    this.playing = null;
    this.stopPlaying();
  }
}
