'use strict';

const fs = require('fs');
const path = require('path');

const Program = require('node-incoming');
const packageJSON = require('../package.json');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const resolvePath = require('path-resolve');
const Generator = require('./generator');

const app = new Program().version(packageJSON.version).addHelp('The seams CLI is only used to generate seam files.').addHelp('Please see the readme for more detailed explanations of options.').example('seamgen -c -s=2 -o=/path/to/out/directory /path/to/images/**/*.jpg').option('--compression, -c', 'Enables seam compression').option('--spacing, -c <Number>', 'Sets spacing level').option('--merging, -m <Number>', 'Sets merging level').option('--direction, -d <vertical|horizontal|both>', 'Sets seam direction').option('--max-seams, -x <Number>', 'Sets maximum # of seams (per direction)').option('--percentage, -p <0..100>', 'Sets % of seams to generate relative to the image ' + 'width/height').option('--out, -o <Path>', 'Folder to write seam files to.  Will write to the same ' + 'folder as the image if not set.').processArgs();

function flattenArray(ary, levels) {
  levels || (levels = 1);
  for (var i = 1; i <= levels; i++) {
    ary = [].concat.apply([], ary);
  }

  return ary;
}

app.on('call', function (args) {
  if (!args._.length) {
    throw new Error('Must provide file(s) to process');
  }

  var globs = args._.map(pattern => glob(pattern));

  Promise.all(globs).then(flattenArray).map(resolvePath).map(function (file) {
    console.log('Encoding ' + file);

    new Generator(file).setDirection(args.direction).setCompression(args.compression).setSpacing(args.spacing).setMerging(args.merging).setMaxSeams(args.maxSeams).setPercentage(args.perentage).encode().then(function (data) {
      console.log(`Encoded ${file}`);

      var parsed = path.parse(file);
      var filePath = path.join(args.o || parsed.dir, parsed.name + '.seam');

      fs.writeFile(filePath, data, function (err) {
        if (err) {
          throw err;
        } else {
          console.log.bind(console, `Wrote seam to file ${filePath}`);
        }
      });
    }).catch(function (err) {
      throw err;
    });
  });
});

process.on('unhandledRejection', p => console.error(p.stack));

module.exports = app;