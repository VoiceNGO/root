function decode(bytes, offset) {
  var isString  = typeof bytes === 'string';
  var number    = 0;
  var byte      = bytes[offset];
  var firstByte = true;
  var offsetCtr = 0;
  var negative;
  var bits;
  var byteVal;
  var contFlag;

  while (byte) {
    if (isString) {
      byte = byte.charCodeAt(0);
    }

    contFlag = byte & 128;

    // if first byte
    if (firstByte) {
      negative = byte & 64;
      bits     = 6;

    } else {
      bits = 7;
    }

    byteVal = byte & ((1 << (bits)) - 1);

    if (contFlag) {
      byte = bytes[offset + offsetCtr + 1];

    } else {
      byte = null;
    }

    number   += byteVal << (offsetCtr ? 6 + 7 * (offsetCtr - 1) : 0);
    firstByte = false;
    offsetCtr++;
  }

  return {
      number : negative ? -number : number
    , offset : offset + offsetCtr
  };
};

/**
 * Decodes a VLE integer at a specific offset in a string or buffer
 *
 * If `offset` is not passed, returns the decoded number.  If offset is passed, returns
 *   `{number: decodedNumber, offset: newOffset}`
 *
 * @param  {String|ByteBuffer} bytes    raw data
 * @param  {Number}            [offset] Offset to start reading bytes at
 * @return {Number|Object} return Parsed Number
 * @return {Number} return.number Parsed number
 * @return {Number} return.offset New offset
 */
module.exports = function(bytes, offset) {
  var decoded = decode(bytes, offset || 0);

  return (offset == null) ? decoded.number : decoded;
};
