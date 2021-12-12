function isValidOpt(names, rest) {
  return function(opt, index) {
    if (typeof opt === 'undefined') {
      throw new Error('Unknown option: ' + names[index]);
    }
  };
}

module.exports.processArgs = function() {
  process.nextTick(function() {
    var numNodeArgs = (module && (module.id === 'repl')) ? 1 : 2;
    var argv        = process.argv.slice(numNodeArgs);
    var config      = {_: []};
    var argRx       = /^-(-)?(\w+)(?:=(.*))?$/;

    function argIsValue(index) {
      if (index >= argv.length) { return false; }
      return !argRx.test(argv[index]);
    }

    function createReturnValue(opt, val) {
      var value = (config[ opt.shortName || opt.longName ] || []);
      value.push(opt.boolean ? true : val);
      value = value.length === 1 ? value[0] : value;

      if (opt.shortName) { config[opt.shortName] = value; }
      if (opt.longName)  { config[opt.longName]  = value; }
    }

    for (var i = 0, l = argv.length; i < l; i++) {
      var parsedArg = argRx.exec(argv[i]);

      if (parsedArg) {
        var long  = parsedArg[1];
        var name  = parsedArg[2];
        var value = parsedArg[3];

      } else {
        config._.push(argv[i]);
        continue;
      }

      // split -xyz into x, y, z
      var names    = (long ? [name] : name.split(''));
      var options  = names.map(this.getOptionByName.bind(this));

      // Bail if any of the options are invalid
      if (options.some(function(val, ix) {
        if (!val) {
          this.emit('error', 'Bad option: ' + names[ix]);
          return true;
        }
      })) {
        return;
      }

      var hasValue = value || argIsValue(i + 1);
      var reqValue = options.some(function(opt) {
        return opt.boolean ? false : (opt.required && hasValue) || hasValue;
      });

      var val;
      if (reqValue) {
        // consume the next argument if a value wasn't provided as `--param=foo`
        val = value || argv[ ++i ];
      }

      // validate that all options are expected
      options.forEach(isValidOpt(names));

      // throw errors on options that mis-match whether nor not a value was provided
      if (options.some(function(opt) {
        if (opt.boolean && reqValue) {
          this.emit('error', 'option ' + name + ' can\'t accept a value');
          this.emit('Please report this error as it should never occur');

        }else if (!opt.boolean && !reqValue) {
          this.emit('error', 'option ' + name + ' requires a value');
        }
      }, this)) {
        return;
      }

      // add value(s) to option output
      options.forEach(function(opt) {
        createReturnValue(opt, val);
      });
    }

    this.emit('app-call', config);
  }.bind(this));

  return this;
};
