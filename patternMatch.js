var wildcard = "fskdlfjsldjfskldjfksjfskdjfsdmm,nmncxvjfsdfjsidjklfjdlskfjieruiorwej";

var byWildcard = function(pt) {
  if (pt === wildcard) return function() { return true }
}

var litConRE = /^\[(.+)\]$/
var byConstructor = function(pt) {
  var con;
  if (typeof pt == 'string' && litConRE.test(pt)) {
    con = eval( pt.match(litConRE)[1] );  
  } 
  else if ( 
     pt === Array 
  || pt === Object 
  || pt === Number 
  || pt === String 
  || pt === Boolean
  || pt === RegExp
  || pt === Date
  || pt === Function ) con = pt
  else return;
  return function(e) { return e.constructor === con; }
};

var byFunction = function(pt) {
  if ('function' == typeof pt) return pt;
};

var byRegExp = function(pt) {
  if (pt.constructor === RegExp) return function(e) { 
    return 'string' == typeof e && pt.test(e)
  }
};

var byValue = function(pt) {
  return function(e) { return pt === e }
};

var getScalarMatcher = function(pt) {
  return byWildcard(pt)
      || byConstructor(pt)
      || byFunction(pt)
      || byRegExp(pt)
      || byValue(pt)
};

var getArrayMatcher = function(pt) {
  if (! Array.isArray(pt)) return;
  var pl = pt.length
    , pm = new Array(pl);
  for (var i = 0; i < pl; ++i) 
    pm[i] = getPatternMatcher(pt[i]);
  return function() {
    var args = [].slice.apply(arguments)
      , alen = args.length;
    if (alen != pl) return;    
    for (var i = 0; i < alen; ++i) 
      if (! pm[i](args[i])) return;
    return true;
  }
};

var getObjectMatcher = function(pt) {
  if (Object !== pt.constructor) return;
};

var getPatternMatcher = function(pt) {
  return getArrayMatcher(pt)
      || getObjectMatcher(pt)
      || getScalarMatcher(pt);
};

exports.wildcard = wildcard;
exports.getPM = getPatternMatcher;
