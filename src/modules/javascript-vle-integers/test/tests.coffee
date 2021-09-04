assert = require 'assert'
chai   = require 'chai'
encode = require '../encode'
decode = require '../decode'
expect = chai.expect

chai.should()

describe 'Encoding & Decoding', =>
  it 'should return the same results for decode(encode) for a wide variety of numbers', =>
    numbers = [-1e9, -1e5, -1e2, 0, 42, 1e3, 1e6, 1e9]
    numbers.forEach (num) =>
      decode(encode(num)).should.equal(num)

  it 'should throw on out-of-range numbers', =>
    expect(encode.bind(null, 1e10)).to.throw('vle-integers can not currently encode a number larger than 2^31 - 1')

describe 'Offset Data', =>
  it 'should decode numbers at a specified offset', =>
    decoded = decode('foobar' + encode(42), 6)
    decoded.should.have.property('number', 42)
    decoded.should.have.property('offset', 7)
