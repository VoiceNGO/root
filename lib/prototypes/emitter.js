var EventEmitter = require('event-chains');

/**
 * @event call
 * calls the app with sanitized parameters
 * @param {Object} config object
 */
/**
 * @event exit
 * called before the app exits
 */

module.exports.__getEmitter = function() {
  if (!this.__emitter) {
    Object.defineProperty(this, '__emitter', {
      value : new EventEmitter()
    });
  }

  return this.__emitter;
};

'addListener on once removeListener removeAllListeners setMaxListeners listeners emit'.split(' ').forEach(
  function(method) {
    module.exports[method] = function() {
      var emitter = this.__getEmitter();
      emitter[method].apply(emitter, arguments);
    };
  }
);
