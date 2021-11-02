var priv    = require('../private');
var deepSet = require('utils-deep-set');
var deepGet = require('utils-deep-get');
var DEFAULT = 'default';

function wrapText(width, text) {
  var out = [];
  while (text.length > width) {
    var pos = text.substr(0, width).lastIndexOf(' ');
    if (pos < 0) { pos = width; }

    out.push(text.substr(0, pos));
    text = text.substr(pos + 1).trimLeft();
  }
  if (text.length) {
    out.push(text);
  }

  return out;
}

function pad(str, width) {
  return str + (new Array(width - str.length + 1)).join(' ');
}

function createTable(widths, rows) {
  return rows.map(function(row, rowNum) {
    var lines = row.map(function(text, colIndex) {
      return wrapText(widths[colIndex], text);
    });
    var maxLines = Math.max.apply(Math, lines.map(function(line) { return line.length; }));

    return Array.apply(Array, new Array(maxLines)).map(function(val, lineNum) {
      return lines.map(function(line, colNum) {
        return pad(line[lineNum] || '', widths[colNum]);
      }).join('');
    }).join('\n');
  }).join('\n');
}

module.exports = {
/**
 * @private
 */
  __setHelpKey : function(keyPath, value) {
    if (!this.__helpKeys) {
      priv(this, '__helpKeys', {});
    }

    var existingVal = deepGet(this.__helpKeys, keyPath);
    deepSet(this.__helpKeys, keyPath, existingVal ? [].concat(existingVal, value) : [value], {create: true});
  }

  /**
   * @private
   */
  , __getHelpKey : function(keyPath) {
    return deepGet(this.__helpKeys, keyPath);
  }

  /**
   * @private
   */
  , __generateHelpText : function(scope) {
    return '\n' + ( ''
      + (this.__getHelpDescriptionText(scope) || '') + '\n\n'
      + (this.__getHelpExampleText(scope)     || '') + '\n\n'
      + (this.__getHelpOptionsText(scope)     || '') + '\n\n'
    ).replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * @private
   */
  , __getHelpDescriptionText : function(scope) {
    return (this.__getHelpKey('text.' + scope) || []).join('\n');
  }

  /**
   * @private
   */
  , __getHelpExampleText : function(scope) {
    var examples = this.__getHelpKey('example.' + scope);

    return examples ? 'Usage:\n  ' + examples.join('\n  ') + '\n\n' : '';
  }

  /**
   * @private
   */
  , __getHelpOptionsText : function(scope) {
    var columns   = process.stdout.columns;
    var DEF_GROUP = '   ';
    var outText   = '';

    if (!this.__options.length) { return ''; }

    this.__options.forEach(function(opt, ix) {
      Object.defineProperty(opt, '__index', {value: ix, writeable: true});
    });

    var opts = this.__options.sort(function(a, b) {
      var groupA = a.config.group || DEF_GROUP;
      var groupB = b.config.group || DEF_GROUP;

      return (groupA < groupB) ? -1 : (groupB < groupA) ? 1 : a.__index - b.__index;
    });

    var options;
    var lastGroup = '';
    var colWidths;

    function appendOptionsToOutText() {
      var groupName = '\n\n' + ((lastGroup || '') + ' Options:').trim();
      groupName = groupName.substr(0, 1).toUpperCase() + groupName.substr(1);

      outText += groupName + '\n' + createTable([colWidths[0], columns - colWidths[0]], options);
    }

    opts.forEach(function(option) {
      if (option.config.group !== lastGroup) {
        if (options) { appendOptionsToOutText(); }

        options   = [];
        colWidths = [0];
        lastGroup = option.config.group;
      }
      var params = option.config.params;
      var text   = option.config.description;

      colWidths[0] = Math.max(colWidths[0], params.length + 4);
      options.push(['  ' + params, text]);
    });

    appendOptionsToOutText();

    return outText;
  }

  /**
   * @private
   */
  , __getHelpRestText : function(scope) {
    return this.__getHelpKey('rest');
  }

  /**
   * Enables the `-h` and `--help` flags.  Optionally adds help text to the top of the help output.
   *
   * @param  {String} [scope]       Help scope (e.g. --help someOpt)
   * @param  {String} [description] Help text
   * @chainable
   */
  , addHelp : function(scope, description) {
    if (!description) {
      description = scope;
      scope       = DEFAULT;
    }

    if (description) {
      this.__setHelpKey('text.' + scope, description);
    }

    if (!this.getOptionByName('h')) {
      this
        .option({hidden: true}, '-h, --help', 'Displays help')
        .on('call', function(args) {
          if (args.h) {
            this.emit('response', this.__generateHelpText(scope));
            this.stop();
          }
        }, this);
      }

      return this;
  }

  /**
   * Sets the name of the rest params (e.g. "my-command -opt [files]")
   *
   * @param  {String} name The name to display
   * @chainable
   */
  , rest : function(name) {
    this.__setHelpKey('rest', name);

    return this;
  }

  /**
   * Sets example text
   *
   * @param  {String} [scope]       Help scope (e.g. --help someOpt)
   * @param  {String} [description] Example text
   * @chainable
   */
  , example : function(scope, exampleText) {
    if (!exampleText) {
      exampleText = scope;
      scope       = DEFAULT;
    }
    this.__setHelpKey('example.' + scope, exampleText);

    return this;
  }
};
