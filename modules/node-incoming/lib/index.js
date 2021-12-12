// Configure require.paths to load local copies of owned modules instead of npm installed versions
process.env.NODE_MODULES && require('app-module-path').addPath(process.env.NODE_MODULES);

var path    = require('path');
var modules = require('require-all')(path.join(__dirname, 'lib', 'prototypes'));

function Incoming() {
  this.__initHandlers.forEach(function(handler) {
    handler.call(this);
  }, this);
}
Incoming.prototype.__initHandlers = [];

Object.keys(modules).forEach(function(key) {
  var module = modules[key];

  Object.keys(module).forEach(function(proto) {
    if ('init' === proto) {
      Incoming.prototype.__initHandlers.push(module.init);
    } else if (/^__/.test(proto)) {
      Object.defineProperty(Incoming.prototype, proto, {
        value : module[proto]
      });
    } else {
      Incoming.prototype[proto] = module[proto];
    }
  });
});

module.exports = Incoming;
