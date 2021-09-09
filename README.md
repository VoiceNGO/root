# Seams

Fast in-browser content-aware image resizing that works by pre-calculating all
  of the image seams.

Renderer is 2kb gzipped.  Renderer+Generator is 4kb gzipped.

## Installation

To use the generator in node you need to have cairo installed (this is a
  dependency of [node-canvas](https://github.com/Automattic/node-canvas)).  You
  can install cairo in OSX by using homebrew:

```sh
brew install cairo
```

After cairo is installed (or if you only need the browser version), simply run

```sh
npm install seams
```

### Node Versions

[Canvas](https://github.com/Automattic/node-canvas) currently only builds on
  node 0.10.x and iojs <= 2.5.0 (numbers may not be exact).  I'm running iojs
  2.4.0 and it works fine.

See [Canvas#580](https://github.com/Automattic/node-canvas/pull/580) and
  [Canvas#604](https://github.com/Automattic/node-canvas/pull/604) for updates. 

## Usage

### Generator

The generator reads in an image and generates seam data.  It works in either
  node or a browser environment, though it is _highly_ recommended that you not
  use it on a live site.  If you must, please turn the accuracy waaaayyy down
  via the `.setSpacing()` and `.setMerging()` methods.  And remember your
  audience -- this runs far faster on a shiny new MacBook Pro than an older
  iPhone or Android device.

```js
var SeamGenerator = require('seams').generator;

var myImage = SeamGenerator(pathToImg);
myImage.encode().then(function(encodedString) {
  // save encodedString
});
```

##### Command Line

```sh
node seams/encoder.js > img.seam
```

#### Generator Methods

##### constructor

```js
/**
 * Creates a seam generator
 *
 * @param  {String} imgSrc path to image
 * @constructor
 */
```

##### getSeamData

```js
/**
 * Gets raw seam data.  Use this to pass on directly to a renderer bypassing the
 * encode/decode steps.
 *
 * @return {Promise}
 * @return {Object}  return[0]
 * @return {Array}   return[0].seams
 * @return {Number}  return[0].step
 * @return {Boolean} return[0].vertical
 */
```

##### setCompression

```js
/**
 * Improves seam compression by disabling "straight" sections of a seam, meaning
 *   that a seam _must_ move diagonally at every pixel.  This generally doesn't
 *   create a noticible visual difference.  Makes seams 40% smaller.
 *
 * @param {Bool} [enabled=true] Enables compression
 * @chainable
 */
```

##### setSpacing

```js
/**
 * Skips every Nth pixel allowing for significantly smaller, but less accurate
 *   seams.  Makes seams N^2 time smaller (e.g. a value of 2 results in seams
*    that are 1/4th the size)
 *
 * @param {Number} [level=1] Skip every Nth pixel, must be in the range of 1..15
 * @chainable
 */
```

##### setDirection

```js
/**
 * Sets the direction of the seams to generate.  Default is 'vertical'
 *
 * @param {String} [dir='vertical'] 'vertical' or 'horizontal'
 * @chainable
 */
```

##### setMaxSeams

```js
/**
 * Sets a limit on the maximum number of seams to create
 *
 * @param {Number} [limit=0] Maximum number of seams
 * @chainable
 */
```

##### setPercentage

```js
/**
 * Generate this % of seams, default = 100.  e.g with a value of `50`, a
 *   1024x768 image could be scaled down to 512px wide.
 *
 * @param {[type]} [percent=100] [description]
 */
```

##### encode

```js
/**
 * Returns the encoded seams
 *
 * @return {Promise}
 * @return {String} return[0]
 */
```

### Renderer

The renderer takes an image and one or two (horizontal and/or vertical) sets of
  seam data.  It will internally resize the image with all available seam data.
  If/when it runs out of seam data to use it will start resizing the image via
  traditional scaling.

## How it works

This is an implementation of the
  [seam carving](https://en.wikipedia.org/wiki/Seam_carving) algorithm.  The
  only real difference is that instead of calculating seams on the fly we
  pre-calculate them and provide this data to the browser in a compressed
  format.

I tried several methods of calculating them on the fly with moderately
  successful results, but "great" results require them to be cached.  The brief
  explanation is that for every seam removed we need to re-generate part of the
  image heat map and energy maps.  This is a fairly expensive operation and my
  first attempt at optimizing it took about 50ms/seam on a 500x500px image on a
  modern MacBook Pro.  I would need to get this down to ~1ms to make resizing
  without jitters possible (much faster if I wanted this to work with larger
  images) and I didn't think this possible.

FWIW my most successful attempt was accomplished by ignoring everything above
  and basically guessing where the lowest energy seams were based on the net
  energy of an entire row/column.  This worked fairly well until an important
  element ran up against the edge of the image at which point it would start to
  get cut up when the running seam was unable to go around it.


## To Do (help!)

- Add ability to mask images
- Add facial detection via [faced](https://www.npmjs.com/package/faced) or
  similar
- Try other heat map algorithms (visual saliency in particular)
- Read some more tech papers about a few potential optimizations to the seam
  carving algorithm
- Try more methods around on-the-fly seam generation.  I _might_ be able to get
  something reasonably fast by selectively skipping parts of the heat & energy
  recalculations.  If I could get full image vertical seam generation for a
  1024x768 image below 1 second I'd be happy :)
