module.exports.version = function(v) {
  Object.defineProperty(this, '__version', {
      value     : v
    , writeable : true
  });

  var self = this;

  this
    .option({hidden: true}, '-v, --version', 'Displayings version info')
    .on('call', function(args) {
      if (args.v) {
        this.stop();
        self.emit('response', self.__version);
      }
    });

  return this;
};
