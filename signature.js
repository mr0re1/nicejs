var PM = require('./patternMatch');

var always = function(what) { 
  return function() { return what }
};

var argumentsLengthChecker = function(l) {
  return function() { return l == arguments.length }
};

var fun_wrap = function(f, a) {
  var wf = function() {
    if (wf.arg_match.apply(this, arguments))
      return wf.source_function.apply(this, arguments);
    else throw Error("Argumetns not matched");
  }
  wf.source_function = f;
  wf.arg_match = a;
  return wf;
}

Function.prototype.snt = function() {
  if ('function' != typeof this) 
    throw "Function.prototype.signature must be called for function";
  return fun_wrap(this, PM.getPM( [].slice.apply(arguments))); 
};

/* Polymorph
 * @return Function
 */
var p = function() {
  var flist = [].slice.apply(arguments)
    , flen = flist.length;
  
  for (var i = 0; i < flen; ++i) {
    var f = flist[i];
    if ('function' != typeof f) throw "Not are function";
    if (!f.arg_match) 
      flist[i] = fun_wrap(f, argumentsLengthChecker(f.length))
    
  }
  
  return function() {
    for(var i = 0; i < flen; ++i) {
      if ( ! flist[i].arg_match ) return flist[i].apply(this, arguments);
      if ( flist[i].arg_match.apply(this, arguments) )
        return flist[i].source_function.apply(this, arguments)
    }
    throw Error("Arguments not matced");
  };
};

exports.install = function(name) {
  Function.prototype[name] = Function.prototype.snt;
  p.wildcard = PM.wildcard;
  return p;
}

