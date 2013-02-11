package org.jinjor.webmidi.views;

import org.jinjor.webmidi.Tune;
import org.jinjor.webmidi.Sequencer;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

interface TuneEditView{
  var renderAll : Void -> Void;
  var renderLocation : Void -> Void;
}
class HtmlTuneEditView implements TuneEditView {
  
  public var renderAll : Void -> Void;
  public var renderLocation : Void -> Void;
  
  public function new(document, sequencer){
    var tune = sequencer.tune;
    var rerenders : Array<Array<Void -> Void>> = tune.tracks.map(function(track : Track){
      var frame = document.getElementById('pianoroll_summary.' + track.id);
      var canvas1 = document.getElementById('' + track.id + ".1");
      var canvas2 = document.getElementById('' + track.id + ".2");
      var ctx1 = canvas1.getContext('2d');
      var ctx2 = canvas2.getContext('2d');
      
      ctx1.fillStyle = "#4444ff";
      ctx1.beginPath();
      ctx2.fillStyle = "#7777ff";
      ctx2.beginPath();
      
      var renderAll = function(){
        var pxPerMs = sequencer.tune.getPxPerMs();
        ctx2.clearRect(0,0, canvas2.width, canvas2.height);
        ctx1.clearRect(0,0, canvas1.width, canvas1.height);
        track.messages.foreach(function(message){
          var x1 = tune.tickToMs(message[0]) * pxPerMs;
          var y1 = (127 - message[2]);
          ctx1.fillRect(x1, y1, 2, 2);
          return true;
        });
      };
      var renderLocation = function(){
        var pxPerMs = sequencer.tune.getPxPerMs();
        ctx2.clearRect(0,0, canvas2.width, canvas2.height);
        ctx2.fillRect(sequencer.getLocation() * pxPerMs, 0, 1, 127);
      };
      return [renderAll, renderLocation];
    });
    this.renderAll = function(){
      rerenders.foreach(function(rerender){
        rerender[0]();
        return true;
      });
    };
    this.renderLocation = function(){
      rerenders.foreach(function(rerender){
        rerender[1]();
        return true;
      });
    };
  }
  
}