/**
 * Sanitizes all of the incoming options and, if they pass all necessary filters, emits a `call` event.
 * @param  {Object} config Config object to call the app with
 * @fires call
 */
module.exports.call = function(config) {
  this.emit('call', config);
};

module.exports.init = function() {
  this.on('app-call', this.call.bind(this));
};
