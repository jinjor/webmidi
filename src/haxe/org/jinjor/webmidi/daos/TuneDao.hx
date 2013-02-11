package org.jinjor.webmidi.daos;

import org.jinjor.webmidi.Tune;
import js.Lib;
import haxe.Json;
using Lambda;
using org.jinjor.util.Util;

interface TuneDao{
  function save(tune : Tune, address : String, _callback : Dynamic -> Void) : Void;
  function get(address : String, _callback : Dynamic -> Array<Dynamic> -> Void) : Void;
}

class AngularTuneDao implements TuneDao {
  
  private var http : Dynamic;
  public function new(http){
    this.http = http;
  }
  
  public function save(tune : Tune, address : String, _callback : Dynamic -> Void){
    http({method: 'POST', url: '/saveContents', data: {
      address: address,
      contents: Json.stringify(tune.tracks)
    }}).success(function() {
      _callback(null);
    }).error(function(e) {
      _callback(e);
    });
  }
  
  public function get(address : String, _callback) {
    http({method: 'GET', url: '/contents/' + address}).success(function(tracks) {
      _callback(null, tracks);
    }).error(function(e) {
      _callback(e, null);
    });
  }
  
}