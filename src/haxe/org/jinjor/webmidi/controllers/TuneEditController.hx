package org.jinjor.webmidi.controllers;

import org.jinjor.webmidi.Tune;
import org.jinjor.webmidi.Sequencer;
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
  
}