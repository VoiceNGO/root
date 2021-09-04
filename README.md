# JavaScript Variable Length Encoded Integers

Dynamically encodes a number into N bytes:

0->63 -- 1 bytes  
->8,191 -- 2 bytes  
->1,048,575 -- 3 bytes  
->2^27-1 -- 4 bytes  
->2^31-1 -- 5 bytes

_Important:_ `2^31 - 1` is currently the largest number this library can encode.
  This is not a hard limitation, it's just that it requires a bit more logic
  after that point and I don't currently need numbers that large myself so I
  didn't write it.  If you need this open a bug report (or better yet a pull
  request)!

I could make an unsigned version, but I don't need it myself -- open an issue if
  you need this.

## Usage

```js
var encode  = require('vle-integers').encode;
var decode  = require('vle-integers').decode;

var encode  = encode(123);
var decoded = decode(123);
```

## Decode Method

The decode method will only decode a specific number, meaning that if you
  attempt to decode something like:

```js
var decoded = encode('123') + 'asdf'; // yields 123
```

It will work correctly.  It will also properly decode Buffers.  There is an
  optional `offset` that you can use to tell it where to start decodeing from:

```js
var encoded = 'asdf' + encode(123);
var decoded = decode(encoded, 4); // yields {number: 123, offset:6}
```

## Encode Method

Encoding always returns a string.  If you want a Buffer, create one by passing
  the result to a Buffer and being sure to set the encoding as `ascii`:

```js
var encode  = require('vle-integers').encode;
var encoded = encode(123);

var buf = new Buffer(encoded, 'ascii');

// or

buf.write(encoded, 0, 'ascii');
```

There is also an optional `encode.array` method that returns an array of numbers
  representing the ascii value of each byte.
