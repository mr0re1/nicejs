/* Wrap function, 
 * 
 *@param Function ef Error function 
 *
 */
var carefree = function(ef, that) {
  var cfF = this;
  if (! ef) ef = console.error
  return function() {
    var args = Array.prototype.slice.apply(arguments);
    if (args[0]) ef(args[0])
    else cfF.apply(that || this, args.slice(1))
  }
}

module.exports = function(alias) {
  if (! alias) alias = 'carefree';
  Function.prototype[alias] = carefree;
}
