package org.jinjor.util;

import js.Lib;
using Lambda;

class Util{
  public static function or<A>(a : A, b : A) : A {
    return if(a != null) a else b;
  }
  public static function mapO<A, B>( it : Iterable<A>, f : A -> B ) : List<B> {
    return if(it != null) it.map(f) else null;
  }
  public static function arrayO<A>( it : Iterable<A> ) : Array<A> {
    return if(it != null) it.array() else null;
  }
}