package org.jinjor.webmidi.controllers;

import org.jinjor.webmidi.Tune;
import org.jinjor.webmidi.Sequencer;
import org.jinjor.webmidi.views.TuneEditView;
import haxe.Timer;

import js.Lib;
using Lambda;
using org.jinjor.util.Util;

interface TuneEditController {

}

class AngularTuneEditController implements TuneEditController{
  
  private var scope : Dynamic;
  public function new(scope){
    this.scope = scope;
  }
  
  public function play(view : TuneEditView) : Void {
    var sequencer : Sequencer = scope.sequencer;
    sequencer.play(false);
    renderTracks(scope.sequencer, view);
  }
  
  public function rec(view : TuneEditView) : Void {
    var sequencer : Sequencer = scope.sequencer;
    sequencer.rec();
    renderTracks(scope.sequencer, view);
  }
  
  private function renderTracks(sequencer : Sequencer, view : TuneEditView){
    var r : Dynamic = {};
    var that = this;
    r.render = function(){
      view.renderLocation();
      if(switch(sequencer.playStatus){
        case Stop(location) : false;
        case Playing(playState) : true;
        case Recording(recState) : true;
      }){
        Timer.delay(r.render, 50);
      }else{
        Lib.eval("that.scope.$apply()");
        view.refresh();
        view.renderAll();
      }
    };
    r.render();
  }
  
}