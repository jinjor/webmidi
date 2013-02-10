package org.jinjor.util;

import js.Lib;
using Lambda;

class Util{
  public static function or<A>(a : A, b : A) : A {
    return if(a != null) a else b;
  }
}