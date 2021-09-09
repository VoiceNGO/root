#!/usr/bin/env node
'use strict';

'production' !== process.env.NODE_ENV && require('babel/register')({
  sourceMap: 'inline',
  retainLines: true,
  stage: 0
});

module.exports = {
  generator: require('./generator'),
  renderer: require('./renderer')
};