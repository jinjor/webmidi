package org.jinjor.webmidi.daos;

import org.jinjor.webmidi.Tune;
import js.Lib;
using Lambda;
using org.jinjor.util.Util;

interface UserDao{
  function get(_callback : Dynamic -> String -> Void) : Void;
}

class AngularUserDao implements UserDao {
  
  private var http : Dynamic;
  public function new(http){
    this.http = http;
  }
  
  public function get(_callback) {
    http({method: 'GET', url: '/session'}).success(function(user) {
      _callback(null, user);
    });
  }
}