q = require('./signature').install('q');



var fact = q(
  function() { return 1 }.q(0),
  function(n) { return fact(n - 1) * n }
);

console.log( fact('d') );


