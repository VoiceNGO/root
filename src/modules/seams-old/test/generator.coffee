chai      = require 'chai'
Generator = require('../lib').generator

chai.should()

describe 'Encoding', =>
  it 'Should not throw errors (stupid test to help with debugging)', =>
    (new Generator('/Users/mark/src/modules/seams/test-files/1.jpg'))
      .encode()
