var extend   = require('deep-extend');
var defaults = {
    // can be set via function params
    params       : ''
  , description  : ''
  , handler      : undefined
  , defaultValue : undefined

  // must be set via options object
  , hidden       : false
  , group        : undefined
  , setsGroup    : false
  , shortName    : undefined
  , longName     : undefined
  , required     : undefined
  , boolean      : undefined
};

function Option(config) {
  Object.defineProperty(this, 'config', {value: extend({}, defaults, config)});

  this.parseParams(this.config.params);
}

extend(Option.prototype, {
  is: function(param) {
    return (this.shortName === param) || (this.longName === param);
  }

  , parseParams: function(params) {
    //             (          -key           )(          --key           )(     <      )(      [      )
    var paramRx = /(?=(?:.*(?:^|[^-])-(\w+))?)(?=(?:.*(?:^|[^-])--(\w+))?)(?=(?:.*(<))?)(?=(?:.*(\[))?)/;
    var matches = paramRx.exec(params);

    this.shortName = this.config.shortName || matches[1];
    this.longName  = this.config.longName  || matches[2];
    this.boolean   = (this.config.boolean != null) ?
      this.config.boolean
      : !(matches[3] || matches[4]);
    this.required  = (this.config.required != null) ? this.config.required : !!matches[3];
  }

  , applyHandler: function(value) {
    var handler = this.handler;
    var result;

    if (typeof handler === 'function') {
      result = handler(value);

    // if regex, validate or set to default
    } else if ((typeof handler === 'object') && handler.test) {
      result = handler.test(value) ? value : undefined;
    }

    return (result != null) ? result : this.defaultValue;
  }
});

module.exports.option = function(/* [options], params, description, handler, defaultValue */) {
  var args = [].slice.call(arguments);

  // consume the first argument if it's a config object
  var config = (typeof args[0] === 'object')
    ? extend({}, args.shift())
    : {};

  config = extend({
      params       : args.shift()
    , description  : args.shift()
    , handler      : args.shift()
    , defaultValue : args.shift()
  }, config || {});

  var newOpt = new Option(config);

  if (!this.__options) {
    Object.defineProperty(this, '__options', {value: []});
  }

  ['shortName', 'longName'].forEach(function(name) {
    if (this.getOptionByName(name)) {
      throw new Error('The option ' + name + ' cannot be redefined');
    }
  }, this);

  this.__options.push(newOpt);

  return this;
};

module.exports.getOptionByName = function(name) {
  return this.__options.filter(function(opt) {
    return opt.is(name);
  }).shift();
};
