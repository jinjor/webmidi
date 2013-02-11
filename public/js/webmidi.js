var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var haxe = haxe || {}
haxe.Json = $hxClasses["haxe.Json"] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				this.pos--;
				if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
				var v = this.reg_float.matched(0);
				this.pos += v.length;
				var f = Std.parseFloat(v);
				var i = f | 0;
				return i == f?i:f;
			default:
				this.invalidChar();
			}
		}
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
			} else if(c == Hash) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k = $it0.next();
					o[k] = v1.get(k);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var e = $e[2];
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var org = org || {}
if(!org.jinjor) org.jinjor = {}
if(!org.jinjor.smf) org.jinjor.smf = {}
org.jinjor.smf.SmfData = $hxClasses["org.jinjor.smf.SmfData"] = function(data) {
	var buf = eval("new Uint8Array(data)");
	var p = 0;
	if(!(buf[p++] == 77 && buf[p++] == 84 && buf[p++] == 104 && buf[p++] == 100)) throw "MIDIファイルではありません";
	p += 4;
	this.format = buf[p++] * 256 + buf[p++];
	var trackCount = buf[p++] * 256 + buf[p++];
	this.timeMode = buf[p++] * 256 + buf[p++];
	var tracks = [];
	var _g = 0;
	while(_g < trackCount) {
		var i = _g++;
		var chunkType = [buf[p++],buf[p++],buf[p++],buf[p++]];
		if(!(chunkType[0] == 77 && chunkType[1] == 84 && chunkType[2] == 114 && chunkType[3] == 107)) throw "チャンク名が不正です";
		haxe.Log.trace("Track start!",{ fileName : "Smf.hx", lineNumber : 49, className : "org.jinjor.smf.SmfData", methodName : "new"});
		var dataLength = buf[p++] * 256 * 256 * 256 + buf[p++] * 256 * 256 + buf[p++] * 256 + buf[p++];
		var end = p + dataLength;
		var events = [];
		var event = [];
		var prevEventFirst = null;
		while(p < end) {
			var delta_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
			var delta = delta_incr[0];
			p += delta_incr[1];
			var eventFirst = buf[p++];
			var event1 = [delta,eventFirst];
			if(eventFirst == 255) {
				event1.push(buf[p++]);
				var metaLength_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
				var metaLength = metaLength_incr[0];
				p += metaLength_incr[1];
				var _g1 = 0;
				while(_g1 < metaLength) {
					var k = _g1++;
					event1.push(buf[p++]);
				}
			} else if(eventFirst == 247) {
				var sysxLength_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
				var sysxLength = sysxLength_incr[0];
				p += sysxLength_incr[1];
				var _g1 = 0;
				while(_g1 < sysxLength) {
					var k = _g1++;
					event1.push(buf[p++]);
				}
			} else if(eventFirst == 240) while(true) {
				var e = buf[p++];
				if(e == 247) break; else event1.push(e);
			} else if(eventFirst < 240) {
				var firstData = null;
				if(eventFirst < 128) {
					firstData = event1.pop();
					if(prevEventFirst != null && (prevEventFirst < 128 || 240 <= prevEventFirst)) throw "予期しないランニングステータス: " + prevEventFirst;
					eventFirst = prevEventFirst;
					event1.push(eventFirst);
				} else firstData = buf[p++];
				if(eventFirst >= 192) event1.push(firstData); else {
					event1.push(firstData);
					event1.push(buf[p++]);
				}
			}
			events.push(event1);
			prevEventFirst = eventFirst;
		}
		tracks.push(events);
	}
	this.tracks = tracks;
	haxe.Log.trace(tracks,{ fileName : "Smf.hx", lineNumber : 113, className : "org.jinjor.smf.SmfData", methodName : "new"});
};
org.jinjor.smf.SmfData.__name__ = ["org","jinjor","smf","SmfData"];
org.jinjor.smf.SmfData.getVariableLength = function(buf,p) {
	var length = 0;
	var k = 1;
	while(k <= 4) {
		var d = buf[p++];
		length = length * 128 + d % 128;
		if(d <= 127) break; else if(k == 4) throw "4バイトを超えました";
		k++;
	}
	return [length,k];
}
org.jinjor.smf.SmfData.prototype = {
	tracks: null
	,timeMode: null
	,trackCount: null
	,format: null
	,__class__: org.jinjor.smf.SmfData
}
org.jinjor.smf.SmfFile = $hxClasses["org.jinjor.smf.SmfFile"] = function(file,reader,onReady) {
	this.name = file.name;
	this.type = file.type;
	this.size = file.size;
	var that = this;
	reader.onload = function(event) {
		var data = event.target.result;
		that.smfData = new org.jinjor.smf.SmfData(data);
		onReady();
	};
	reader.readAsArrayBuffer(file);
};
org.jinjor.smf.SmfFile.__name__ = ["org","jinjor","smf","SmfFile"];
org.jinjor.smf.SmfFile.prototype = {
	smfData: null
	,size: null
	,type: null
	,name: null
	,__class__: org.jinjor.smf.SmfFile
}
if(!org.jinjor.synth) org.jinjor.synth = {}
org.jinjor.synth.ProgramDef = $hxClasses["org.jinjor.synth.ProgramDef"] = function(number,description) {
	this.number = number;
	this.description = description;
};
org.jinjor.synth.ProgramDef.__name__ = ["org","jinjor","synth","ProgramDef"];
org.jinjor.synth.ProgramDef.prototype = {
	description: null
	,number: null
	,__class__: org.jinjor.synth.ProgramDef
}
org.jinjor.synth.SynthDef = $hxClasses["org.jinjor.synth.SynthDef"] = function(name,url,author,programs) {
	this.name = name;
	this.url = url;
	this.author = author;
	this.programs = programs;
};
org.jinjor.synth.SynthDef.__name__ = ["org","jinjor","synth","SynthDef"];
org.jinjor.synth.SynthDef.prototype = {
	programs: null
	,author: null
	,url: null
	,name: null
	,__class__: org.jinjor.synth.SynthDef
}
if(!org.jinjor.util) org.jinjor.util = {}
org.jinjor.util.Util = $hxClasses["org.jinjor.util.Util"] = function() { }
org.jinjor.util.Util.__name__ = ["org","jinjor","util","Util"];
org.jinjor.util.Util.or = function(a,b) {
	return a != null?a:b;
}
if(!org.jinjor.webmidi) org.jinjor.webmidi = {}
org.jinjor.webmidi.All = $hxClasses["org.jinjor.webmidi.All"] = function() { }
org.jinjor.webmidi.All.__name__ = ["org","jinjor","webmidi","All"];
org.jinjor.webmidi.All.main = function() {
}
org.jinjor.webmidi.Sequencer = $hxClasses["org.jinjor.webmidi.Sequencer"] = function(tune,getSynth) {
	this.location = 0;
	this.tune = tune;
	this.playStatus = org.jinjor.webmidi.PlayStatus.Stop(0);
	this.getSynth = getSynth;
};
org.jinjor.webmidi.Sequencer.__name__ = ["org","jinjor","webmidi","Sequencer"];
org.jinjor.webmidi.Sequencer.prototype = {
	gainPxPerMs: function(amount) {
		this.tune.gainPxPerMs(amount);
	}
	,play: function(rerender,onStop,record) {
		var _g = this;
		if(this.tune.tracks.length <= 0) return;
		var that = this;
		if(record) this.playStatus = org.jinjor.webmidi.PlayStatus.Recording(new org.jinjor.webmidi.RecState(function(note,velocity,startTime,endTime) {
			Lambda.foreach(that.tune.getSelectedTracks(),function(track) {
				track.recNote(note,velocity,that.tune.msToTick(startTime),that.tune.msToTick(endTime));
				return true;
			});
		},function(time,m0,m1,m2) {
			Lambda.foreach(that.tune.getSelectedTracks(),function(track) {
				track.recElse(that.tune.msToTick(time),m0,m1,m2);
				return true;
			});
		})); else this.playStatus = org.jinjor.webmidi.PlayStatus.Playing(new org.jinjor.webmidi.PlayState());
		var messageTrackPairs = Lambda.fold(this.tune.tracks,function(track,memo) {
			var pairs = Lambda.array(Lambda.map(track.messages,function(mes) {
				return [mes,track];
			}));
			return memo.concat(pairs);
		},[]);
		messageTrackPairs.sort(function(a,b) {
			return a[0][0] - b[0][0];
		});
		Lambda.foreach(that.tune.tracks,function(track) {
			_g.programChange(track);
			return true;
		});
		var index = 0;
		var current = null;
		var currentTrack = null;
		var currentMessage = null;
		var that1 = this;
		var r = { };
		r.tick = function() {
			var location = _g.getLocation();
			current = index < messageTrackPairs.length?messageTrackPairs[index]:null;
			if(current == null) {
				that1.stopPlaying();
				return;
			}
			currentTrack = current[1];
			currentMessage = current[0];
			if((function($this) {
				var $r;
				var $e = (that1.playStatus);
				switch( $e[1] ) {
				case 0:
					var location1 = $e[2];
					$r = true;
					break;
				case 1:
					var playState = $e[2];
					$r = false;
					break;
				case 2:
					var recState = $e[2];
					$r = false;
					break;
				}
				return $r;
			}(this))) that1.stopPlaying(); else if(current == null) that1.stopPlaying(); else if(that1.tune.tickToMs(currentMessage[0]) < location) {
				_g.sendMidiMessage(currentTrack,currentMessage[1],currentMessage[2],currentMessage[3]);
				index++;
				r.tick();
			} else haxe.Timer.delay(r.tick,1);
		};
		r.render = function() {
			rerender();
			if((function($this) {
				var $r;
				var $e = (that1.playStatus);
				switch( $e[1] ) {
				case 0:
					var location = $e[2];
					$r = false;
					break;
				case 1:
					var playState = $e[2];
					$r = true;
					break;
				case 2:
					var recState = $e[2];
					$r = true;
					break;
				}
				return $r;
			}(this))) haxe.Timer.delay(r.render,50);
		};
		r.tick();
		r.render();
	}
	,programChange: function(track) {
		this.sendMidiMessage(track,192,track.program.number,0);
	}
	,sendMidiMessage: function(track,m0,m1,m2) {
		this.getSynth(track.synthDef).sendMidiMessage(m0 + track.channel - 1,m1,m2);
	}
	,stopPlaying: function() {
		var _g = this;
		this.playStatus = org.jinjor.webmidi.PlayStatus.Stop(this.getLocation());
		Lambda.foreach(this.tune.tracks,function(track) {
			_g.getSynth(track.synthDef).allSoundOff();
			return true;
		});
	}
	,rec: function(rerender,onStop) {
		this.play(rerender,onStop,true);
	}
	,send: function(t,m0,m1,m2) {
		var _g = this;
		var $e = (this.playStatus);
		switch( $e[1] ) {
		case 0:
			var location = $e[2];
			break;
		case 1:
			var playState = $e[2];
			break;
		case 2:
			var recState = $e[2];
			recState.send(m0,m1,m2);
			break;
		}
		Lambda.foreach(this.tune.getSelectedTracks(),function(track) {
			_g.sendMidiMessage(track,m0,m1,m2);
			return true;
		});
	}
	,isPlaying: function() {
		return (function($this) {
			var $r;
			var $e = ($this.playStatus);
			switch( $e[1] ) {
			case 0:
				var location = $e[2];
				$r = false;
				break;
			case 1:
				var playState = $e[2];
				$r = true;
				break;
			case 2:
				var recState = $e[2];
				$r = true;
				break;
			}
			return $r;
		}(this));
	}
	,getLocation: function() {
		return (function($this) {
			var $r;
			var $e = ($this.playStatus);
			switch( $e[1] ) {
			case 0:
				var location = $e[2];
				$r = location;
				break;
			case 1:
				var playState = $e[2];
				$r = playState.getLocation();
				break;
			case 2:
				var recState = $e[2];
				$r = recState.getLocation();
				break;
			}
			return $r;
		}(this));
	}
	,getSynth: null
	,playStatus: null
	,tune: null
	,location: null
	,__class__: org.jinjor.webmidi.Sequencer
}
org.jinjor.webmidi.PlayStatus = $hxClasses["org.jinjor.webmidi.PlayStatus"] = { __ename__ : ["org","jinjor","webmidi","PlayStatus"], __constructs__ : ["Stop","Playing","Recording"] }
org.jinjor.webmidi.PlayStatus.Stop = function(location) { var $x = ["Stop",0,location]; $x.__enum__ = org.jinjor.webmidi.PlayStatus; $x.toString = $estr; return $x; }
org.jinjor.webmidi.PlayStatus.Playing = function(playState) { var $x = ["Playing",1,playState]; $x.__enum__ = org.jinjor.webmidi.PlayStatus; $x.toString = $estr; return $x; }
org.jinjor.webmidi.PlayStatus.Recording = function(recState) { var $x = ["Recording",2,recState]; $x.__enum__ = org.jinjor.webmidi.PlayStatus; $x.toString = $estr; return $x; }
org.jinjor.webmidi.PlayState = $hxClasses["org.jinjor.webmidi.PlayState"] = function() {
	this.startTime = Math.floor(new Date().getTime());
};
org.jinjor.webmidi.PlayState.__name__ = ["org","jinjor","webmidi","PlayState"];
org.jinjor.webmidi.PlayState.prototype = {
	getLocation: function() {
		return Math.floor(new Date().getTime()) - this.startTime;
	}
	,startTime: null
	,__class__: org.jinjor.webmidi.PlayState
}
org.jinjor.webmidi.RecState = $hxClasses["org.jinjor.webmidi.RecState"] = function(onNoteFinished,onElse) {
	org.jinjor.webmidi.PlayState.call(this);
	this.keyCount = 0;
	this.noteOns = [];
	this.onNoteFinished = onNoteFinished;
	this.onElse = onElse;
};
org.jinjor.webmidi.RecState.__name__ = ["org","jinjor","webmidi","RecState"];
org.jinjor.webmidi.RecState.__super__ = org.jinjor.webmidi.PlayState;
org.jinjor.webmidi.RecState.prototype = $extend(org.jinjor.webmidi.PlayState.prototype,{
	keyIsPressed: function() {
		return this.keyCount > 0;
	}
	,reset: function() {
		this.keyCount = 0;
		this.noteOns = [];
	}
	,send: function(m0,m1,m2) {
		var time = this.getLocation();
		if(m0 >> 4 == 9) {
			this.noteOns[m1] = [time,m2];
			this.keyCount++;
		} else if(m0 >> 4 == 8) {
			var startTime_velocity = this.noteOns[m1];
			if(startTime_velocity != null) this.onNoteFinished(m1,startTime_velocity[1],startTime_velocity[0],time);
			this.noteOns[m1] = false;
			this.keyCount--;
		} else this.onElse(time,m0,m1,m2);
	}
	,onElse: null
	,onNoteFinished: null
	,noteOns: null
	,keyCount: null
	,__class__: org.jinjor.webmidi.RecState
});
org.jinjor.webmidi.Track = $hxClasses["org.jinjor.webmidi.Track"] = function(name,synthDef,channel,program,messages) {
	this.id = org.jinjor.webmidi.Track.createTrackId();
	this.name = name;
	this.synthDef = synthDef;
	this.channel = org.jinjor.util.Util.or(channel,1);
	this.program = org.jinjor.util.Util.or(program,synthDef.programs[0]);
	this.selected = true;
	this.messages = org.jinjor.util.Util.or(messages,[[Math.floor(40.),128,62,0]]);
};
org.jinjor.webmidi.Track.__name__ = ["org","jinjor","webmidi","Track"];
org.jinjor.webmidi.Track.createTrackId = function() {
	return ++org.jinjor.webmidi.Track.trackId;
}
org.jinjor.webmidi.Track.prototype = {
	deleteAll: function() {
		this.messages = [[Math.floor(40.),128,62,0]];
	}
	,recElse: function(time,m0,m1,m2) {
		this.messages.push([time,m0,m1,m2]);
	}
	,recNote: function(note,velocity,startTime,endTime) {
		this.messages.push([startTime,144,note,velocity]);
		this.messages.push([endTime,128,note,0]);
	}
	,messages: null
	,selected: null
	,program: null
	,channel: null
	,synthDef: null
	,name: null
	,id: null
	,__class__: org.jinjor.webmidi.Track
}
org.jinjor.webmidi.Tune = $hxClasses["org.jinjor.webmidi.Tune"] = function() {
	this.format = 1;
	this.timeMode = 480;
	this.tracks = [];
	this.selectedTrackId = -1;
	this.pxPerMsMode = 0;
};
org.jinjor.webmidi.Tune.__name__ = ["org","jinjor","webmidi","Tune"];
org.jinjor.webmidi.Tune.prototype = {
	getTimePerTick: function() {
		var tempo = 120;
		return 60000 / (this.timeMode * tempo);
	}
	,msToTick: function(ms) {
		return Math.floor(ms / this.getTimePerTick());
	}
	,tickToMs: function(tick) {
		return Math.floor(this.getTimePerTick() * tick);
	}
	,trackIsSelected: function(track) {
		return track.id == this.selectedTrackId;
	}
	,getSelectedTracks: function() {
		var that = this;
		return Lambda.array(Lambda.filter(this.tracks,function(track) {
			return that.trackIsSelected(track);
		}));
	}
	,replaceTracksByLoadedTracks: function(tracks,synths) {
		var that = this;
		this.tracks = tracks != null?Lambda.array(Lambda.map(tracks,function(_track) {
			return new org.jinjor.webmidi.Track(_track.name,_track.synthDef,_track.channel,_track.program,_track.messages);
		})):[];
	}
	,addTrack: function(synthDef,channel) {
		var track = new org.jinjor.webmidi.Track("_",synthDef,channel,null,null);
		this.tracks.push(track);
	}
	,gainPxPerMs: function(amount) {
		var pxPerMsMode = this.pxPerMsMode + amount;
		this.pxPerMsMode = pxPerMsMode < 0?0:pxPerMsMode >= org.jinjor.webmidi.Tune.pxPerMsModes.length?org.jinjor.webmidi.Tune.pxPerMsModes.length - 1:pxPerMsMode;
	}
	,hasMinPxPerMs: function() {
		return this.pxPerMsMode <= 0;
	}
	,hasMaxPxPerMs: function() {
		return this.pxPerMsMode >= org.jinjor.webmidi.Tune.pxPerMsModes.length - 1;
	}
	,getPxPerMs: function() {
		return org.jinjor.webmidi.Tune.pxPerMsModes[this.pxPerMsMode];
	}
	,refresh: function(smfData,synthDef) {
		if(smfData.format != 1) throw "まだ1しか受け付けません";
		if(smfData.timeMode > 32768) throw "まだMSB=0しか受け付けません";
		this.format = smfData.format;
		this.timeMode = smfData.timeMode;
		haxe.Log.trace("timeMode=" + this.timeMode,{ fileName : "Tune.hx", lineNumber : 126, className : "org.jinjor.webmidi.Tune", methodName : "refresh"});
		var that = this;
		this.tracks = smfData.tracks.map(function(events) {
			var deltaSum = 0;
			var messages = events.map(function(e) {
				deltaSum += e[0];
				return [deltaSum,e[1],e[2],e[3]];
			});
			return new org.jinjor.webmidi.Track("_",synthDef,1,null,messages);
		});
	}
	,pxPerMsMode: null
	,selectedTrackId: null
	,tracks: null
	,timeMode: null
	,format: null
	,__class__: org.jinjor.webmidi.Tune
}
if(!org.jinjor.webmidi.controllers) org.jinjor.webmidi.controllers = {}
org.jinjor.webmidi.controllers.TuneEditController = $hxClasses["org.jinjor.webmidi.controllers.TuneEditController"] = function() { }
org.jinjor.webmidi.controllers.TuneEditController.__name__ = ["org","jinjor","webmidi","controllers","TuneEditController"];
org.jinjor.webmidi.controllers.AngularTuneEditController = $hxClasses["org.jinjor.webmidi.controllers.AngularTuneEditController"] = function(scope) {
	this.scope = scope;
};
org.jinjor.webmidi.controllers.AngularTuneEditController.__name__ = ["org","jinjor","webmidi","controllers","AngularTuneEditController"];
org.jinjor.webmidi.controllers.AngularTuneEditController.__interfaces__ = [org.jinjor.webmidi.controllers.TuneEditController];
org.jinjor.webmidi.controllers.AngularTuneEditController.prototype = {
	scope: null
	,__class__: org.jinjor.webmidi.controllers.AngularTuneEditController
}
if(!org.jinjor.webmidi.daos) org.jinjor.webmidi.daos = {}
org.jinjor.webmidi.daos.TuneDao = $hxClasses["org.jinjor.webmidi.daos.TuneDao"] = function() { }
org.jinjor.webmidi.daos.TuneDao.__name__ = ["org","jinjor","webmidi","daos","TuneDao"];
org.jinjor.webmidi.daos.TuneDao.prototype = {
	get: null
	,save: null
	,__class__: org.jinjor.webmidi.daos.TuneDao
}
org.jinjor.webmidi.daos.AngularTuneDao = $hxClasses["org.jinjor.webmidi.daos.AngularTuneDao"] = function(http) {
	this.http = http;
};
org.jinjor.webmidi.daos.AngularTuneDao.__name__ = ["org","jinjor","webmidi","daos","AngularTuneDao"];
org.jinjor.webmidi.daos.AngularTuneDao.__interfaces__ = [org.jinjor.webmidi.daos.TuneDao];
org.jinjor.webmidi.daos.AngularTuneDao.prototype = {
	get: function(address,_callback) {
		this.http({ method : "GET", url : "/contents/" + address}).success(function(tracks) {
			_callback(null,tracks);
		}).error(function(e) {
			_callback(e,null);
		});
	}
	,save: function(tune,address,_callback) {
		haxe.Log.trace(tune.tracks,{ fileName : "TuneDao.hx", lineNumber : 22, className : "org.jinjor.webmidi.daos.AngularTuneDao", methodName : "save"});
		this.http({ method : "POST", url : "/saveContents", data : { address : address, contents : haxe.Json.stringify(tune.tracks)}}).success(function() {
			_callback(null);
		}).error(function(e) {
			_callback(e);
		});
	}
	,http: null
	,__class__: org.jinjor.webmidi.daos.AngularTuneDao
}
org.jinjor.webmidi.daos.UserDao = $hxClasses["org.jinjor.webmidi.daos.UserDao"] = function() { }
org.jinjor.webmidi.daos.UserDao.__name__ = ["org","jinjor","webmidi","daos","UserDao"];
org.jinjor.webmidi.daos.UserDao.prototype = {
	get: null
	,__class__: org.jinjor.webmidi.daos.UserDao
}
org.jinjor.webmidi.daos.AngularUserDao = $hxClasses["org.jinjor.webmidi.daos.AngularUserDao"] = function(http) {
	this.http = http;
};
org.jinjor.webmidi.daos.AngularUserDao.__name__ = ["org","jinjor","webmidi","daos","AngularUserDao"];
org.jinjor.webmidi.daos.AngularUserDao.__interfaces__ = [org.jinjor.webmidi.daos.UserDao];
org.jinjor.webmidi.daos.AngularUserDao.prototype = {
	get: function(_callback) {
		this.http({ method : "GET", url : "/session"}).success(function(user) {
			_callback(null,user);
		});
	}
	,http: null
	,__class__: org.jinjor.webmidi.daos.AngularUserDao
}
if(!org.jinjor.webmidi.views) org.jinjor.webmidi.views = {}
org.jinjor.webmidi.views.TuneEditView = $hxClasses["org.jinjor.webmidi.views.TuneEditView"] = function() { }
org.jinjor.webmidi.views.TuneEditView.__name__ = ["org","jinjor","webmidi","views","TuneEditView"];
org.jinjor.webmidi.views.TuneEditView.prototype = {
	renderLocation: null
	,renderAll: null
	,__class__: org.jinjor.webmidi.views.TuneEditView
}
org.jinjor.webmidi.views.HtmlTuneEditView = $hxClasses["org.jinjor.webmidi.views.HtmlTuneEditView"] = function(document,sequencer) {
	var tune = sequencer.tune;
	var rerenders = tune.tracks.map(function(track) {
		var frame = document.getElementById("pianoroll_summary." + track.id);
		var canvas1 = document.getElementById("" + track.id + ".1");
		var canvas2 = document.getElementById("" + track.id + ".2");
		var ctx1 = canvas1.getContext("2d");
		var ctx2 = canvas2.getContext("2d");
		ctx1.fillStyle = "#4444ff";
		ctx1.beginPath();
		ctx2.fillStyle = "#7777ff";
		ctx2.beginPath();
		var renderAll = function() {
			var pxPerMs = sequencer.tune.getPxPerMs();
			ctx2.clearRect(0,0,canvas2.width,canvas2.height);
			ctx1.clearRect(0,0,canvas1.width,canvas1.height);
			Lambda.foreach(track.messages,function(message) {
				var x1 = tune.tickToMs(message[0]) * pxPerMs;
				var y1 = 127 - message[2];
				ctx1.fillRect(x1,y1,2,2);
				return true;
			});
		};
		var renderLocation = function() {
			var pxPerMs = sequencer.tune.getPxPerMs();
			ctx2.clearRect(0,0,canvas2.width,canvas2.height);
			ctx2.fillRect(sequencer.getLocation() * pxPerMs,0,1,127);
		};
		return [renderAll,renderLocation];
	});
	this.renderAll = function() {
		Lambda.foreach(rerenders,function(rerender) {
			rerender[0]();
			return true;
		});
	};
	this.renderLocation = function() {
		Lambda.foreach(rerenders,function(rerender) {
			rerender[1]();
			return true;
		});
	};
};
org.jinjor.webmidi.views.HtmlTuneEditView.__name__ = ["org","jinjor","webmidi","views","HtmlTuneEditView"];
org.jinjor.webmidi.views.HtmlTuneEditView.__interfaces__ = [org.jinjor.webmidi.views.TuneEditView];
org.jinjor.webmidi.views.HtmlTuneEditView.prototype = {
	renderLocation: null
	,renderAll: null
	,__class__: org.jinjor.webmidi.views.HtmlTuneEditView
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof(JSON) != "undefined") haxe.Json = JSON;
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.Lib.onerror = null;
org.jinjor.synth.SynthDef.GMPlayer = new org.jinjor.synth.SynthDef("GMPlayer","http://www.g200kg.com/en/docs/gmplayer/","g200kg",[new org.jinjor.synth.ProgramDef(1,""),new org.jinjor.synth.ProgramDef(2,""),new org.jinjor.synth.ProgramDef(3,""),new org.jinjor.synth.ProgramDef(4,""),new org.jinjor.synth.ProgramDef(5,""),new org.jinjor.synth.ProgramDef(6,""),new org.jinjor.synth.ProgramDef(7,""),new org.jinjor.synth.ProgramDef(8,""),new org.jinjor.synth.ProgramDef(9,""),new org.jinjor.synth.ProgramDef(10,"")]);
org.jinjor.synth.SynthDef.WebBeeper = new org.jinjor.synth.SynthDef("WebBeeper","http://www.g200kg.com/en/docs/webbeeper/","g200kg",[new org.jinjor.synth.ProgramDef(1,""),new org.jinjor.synth.ProgramDef(2,""),new org.jinjor.synth.ProgramDef(3,""),new org.jinjor.synth.ProgramDef(4,""),new org.jinjor.synth.ProgramDef(5,""),new org.jinjor.synth.ProgramDef(6,""),new org.jinjor.synth.ProgramDef(7,""),new org.jinjor.synth.ProgramDef(8,""),new org.jinjor.synth.ProgramDef(9,""),new org.jinjor.synth.ProgramDef(10,"")]);
org.jinjor.synth.SynthDef.synthDefs = [org.jinjor.synth.SynthDef.GMPlayer,org.jinjor.synth.SynthDef.WebBeeper];
org.jinjor.webmidi.Track.trackId = 0;
org.jinjor.webmidi.Tune.pxPerMsModes = Lambda.array(Lambda.map([1,2,4,8,16,32],function(ratio) {
	return 1000 / 600000 * ratio;
}));
org.jinjor.webmidi.All.main();
