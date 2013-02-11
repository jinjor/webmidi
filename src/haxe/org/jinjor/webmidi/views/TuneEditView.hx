package org.jinjor.webmidi.views;

import org.jinjor.webmidi.Tune;
import org.jinjor.webmidi.Sequencer;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

interface TuneEditView{
  function rerenderTracks(sequencer : Sequencer) : Void;
}
class HtmlTuneEditView implements TuneEditView {
  
  private var rerenders : Array<Dynamic>;
  
  public function new(document, tune){
    this.rerenders = tune.tracks.map(function(track : Track){
      var frame = document.getElementById('pianoroll_summary.' + track.id);
      var canvas1 = document.getElementById('' + track.id + ".1");
      var canvas2 = document.getElementById('' + track.id + ".2");
      var ctx1 = canvas1.getContext('2d');
      var ctx2 = canvas2.getContext('2d');
      
      ctx1.fillStyle = "#4444ff";
      ctx1.beginPath();
      ctx2.fillStyle = "#7777ff";
      ctx2.beginPath();
      
      return function(recState : RecState, pxPerMs){
        if(recState != null){
          ctx2.clearRect(0,0, canvas2.width, canvas2.height);
          ctx2.fillRect(recState.getLocation() * pxPerMs, 0, 1, 127);
        }else{
          ctx2.clearRect(0,0, canvas2.width, canvas2.height);
          ctx1.clearRect(0,0, canvas1.width, canvas1.height);
          track.messages.foreach(function(message){
            var x1 = tune.tickToMs(message[0]) * pxPerMs;
            var y1 = (127 - message[2]);
            ctx1.fillRect(x1, y1, 2, 2);
            return true;
          });
        }
      };
    });
  }
  public function rerenderTracks(sequencer : Sequencer){
    var pxPerMs = sequencer.tune.getPxPerMs();
    rerenders.foreach(function(rerender){
      rerender(sequencer.recState, pxPerMs);
      return true;
    });
  }
  
}