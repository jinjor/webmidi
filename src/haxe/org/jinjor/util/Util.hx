package org.jinjor.util;

import js.Lib;
using Lambda;

class Util{
  public static function or(a, b) : Dynamic{
    return if(a != null) a else b;
  }
}