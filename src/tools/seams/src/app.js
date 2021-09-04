#!/usr/bin/env node

// register babel
'production' !== process.env.NODE_ENV &&
  !global._babelPolyfill &&
  require('babel/register')({
    sourceMap: 'inline',
    retainLines: true,
    stage: 0,
  });

module.exports = require('./cli');
