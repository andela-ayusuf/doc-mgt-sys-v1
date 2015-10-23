var repl = require('repl');
var dmsCtrl = require('./documentManager');

var rep = repl.start({
  prompt: 'DMS Interface > '
});

console.log('Welcome to the DMS.\n');
console.log('This interface enables you to do the following \n');
console.log(dmsCtrl);
console.log('\n');
console.log('To use any of the functions, Enter: dmsCtrl. <function name> ');

rep.context.dmsCtrl = dmsCtrl;