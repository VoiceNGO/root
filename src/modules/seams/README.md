# Seame

Fast in-browser content-aware image resizing that works by pre-calculating all of the necessary resizing data.

Renderer is 2kb gzipped.

Renderer + Generator is 4kb gzipped, but the Generator is not suitable for most websites other than as a demo.

Seam files take up an extra 30-60kb, depending on settings, for a 500x500px image. For a 1000x1000px image that's 120-240kb.

### Node Version

The minimum version of Node.js required to generate seams is **6.0.0**.

## Installation

To use the generator you need to have cairo installed (this is a
dependency of [node-canvas](https://github.com/Automattic/node-canvas)).

| OS      | Command                                                                                                  |
| :------ | :------------------------------------------------------------------------------------------------------- |
| OS X    | Using [Homebrew](https://brew.sh/):<br />install pkg-config cairo pango libpng jpeg giflib librsvg       |
| Ubuntu  | `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` |
| Fedora  | `sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel`                      |
| Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`                              |
| OpenBSD | `doas pkg_add cairo pango png jpeg giflib`                                                               |
| Windows | See node-canvas' [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows)            |
| Others  | See node-canvas' [wiki](https://github.com/Automattic/node-canvas/wiki)                                  |

After cairo is installed, install both canvas and this package via npm:

```sh
npm install canvas seams
```

If you only need the renderer for some reason (e.g. you are building seams in another service), then you do not need cairo or canvas and can just install seams via npm

#### Face detection (not yet implemented)

If you want to use face detection you must also install:

```sh
npm install @tensorflow/tfjs-node @vladmandic/face-api
```

## Usage

Seams is seperated into two pieces. The generator and renderer. The generator pre-computes all of the seams in a given image and returns a compressed format representing those seams. The renderer then uses that data to shrink the given image in real time

### Generator

The generator reads in an image and generates seam data. It works in either node or a browser environment, though it is _highly_ recommended that you not use it on a live site. If you must, please turn the accuracy waaaayyy down via the `spacing` and `merging` options as those will also speed up seam generation. And remember your audience -- this runs far faster on a shiny new MacBook Pro than an older iPhone or Android device.

#### CLI

Generate seams from a shell. Writes to stdout if no destination folder is given.

```sh
npm run-script seam-generator <glob of image path(s)> [destination folder=same as source]
npm run-script seam-generator <image path> >> image-name.seam
```

examples:

```sh
npm run-script seam-generator ./images/**/*.jpg ./images/seams
npm run-script seam-generator ./images/cat.jpg >> ./images/cat.seam
```

#### API

Generate seams in JS:

```ts
import { Generator as SeamGenerator } from 'seams';

const myImage = SeamGenerator(pathToImg, { options });
myImage.encode().then(function (encodedString) {
  // save encodedString or pass it to a renderer
});
```

#### Options

Options to be passed to either the cli via `--option` or JS class instance via `{options}`. The default options create a balance of good looking seams and reasonably small seam files.

<!-- prettier-ignore -->
| option         | <value=default>       | description |
|:-------------- |:--------------------- |:----------- |
| forceDiagonals | <bool=true>           | Improves seam compression by disabling "straight" sections of a seam, meaning that a seam *must* move diagonally at every pixel. This usually does not create any noticable visual differences. Makes seams 40% smaller.
| stepSize       | <number=2>            | Seams skip by N pixels allowing for significantly smaller, but less accurate seams. Makes seams N<sup>2</sup> times smaller (e.g. a value of 2 results in seams that are 1/4th the size).  2 is usually not very noticeable, values of 4+ start to cause a noticeable number of artifacts.
| mergeSize      | <number=1>            | Remove N neighboring pixels from each seam instead of 1.  Creates seam files that are 1/Nth the size, but far less accurate<br /><br />This can negatively affect quality significantly more than the effect of `spacing`
| direction      | <string=vertical>     | `vertical` \| `horizontal` \| `both`. Sets the direction of the seams to generate.  `vertical` means that the width of the image can be resized using seams and the height will be resized by normal scaling.  This is usually the desired mode
| maxSeams       | <number=-1>           | Sets a limit on the maximum number of seams to create
| percentage     | <number=0.5>          | Generate this % of seams. e.g with a value of `0.5`, a 1024x768 image could be scaled down to 512px using seam reduction.  Scaling down much below 50% of the original size usually starts to create ugly artifacts
| maskImage      | <string=image source> | not yet implemented<br /><br />A grayscale mask image where lighter areas will be preserved as long as possible
| faceDetection  | <bool=false>          | not yet implemented<br /><br />Automatically creates an image mask by detecting faces in the image.  If `maskImage` is passed this option is ignored

### Renderer

The renderer accepts an image (or a canvas) and a seams string, then creates a canvas element that is your actual image. Append this to your document, and resize it as you please.

```ts
import { Renderer as SeamRenderer } from 'seams';

const mySeam = new SeamRenderer('/images/cat.jpg', seamsString, { options });

document.body.appendChild(mySeam.getRenderingNode());
mySeam.setWidth(500);

// add resize events, drag handles, etc
```

#### Renderer Options

set via `{ option: value }` in either the constructor or via `mySeam.setOptions({ option: value })`

<!-- prettier-ignore -->
| option             | args         | description |
|:------------------ |:------------ |:----------- |
| seamPriority       | <number=1>   | Image resizing is done via a mix of seam carving and simply letting the browser re-size the image normally.  By default the algorithm will use all available seams first before letting the browser resize do anything.  This option allows you to change that behavior.  For example setting `seamPriority = 0.5` will use seam carving for 50% of removed pixels and browser scaling for the other 50%.  A value of `0.8` will use seam carving for 80% of the pixels.
| visibleSeams       | <bool=false> | Toggles visible seams.  Not available in minified build.
| visibilityHeatMaps | <bool=false> | Showing heat maps instead of actual image data.  Not available in minified build.
| autoResize         | <bool=false> | Resize the image whenever the window is resized to fit the *width* of the parent container.  If you need to resize based on events other than `window.onresize` you will need to use the `setWidth`, etc methods below

#### Renderer methods

| option              | args             | description                                                                                                                                            |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| getRenderingNode    |                  | Returns the rendering node. 99.4% of the time (caniuse stats, Sept 2021) this is a Canvas. On very old browsers it just returns an image as a fallback |
| setWidthAndHeight   | <number, number> | Resizes the image canvas to a given width and height. Internally re-scales using seam algorithm and/or traditional scaling. Ingores image ratio.       |
| setWidth            | \<number\>       | Resize the image by setting its width. Height is automatically calculated based on the image ratio                                                     |
| setHeight           | \<number\>       | Resize the image by setting its height. Width is automatically calculated based on the image ratio                                                     |
| setOptions          | {options}        | Sets options. Existing options not passed are preserved                                                                                                |
| removeResizeHandler |                  | Removes the window onresize event listener                                                                                                             |

### React Renderer

See https://github.com/VoiceNGO/seams-react

### Web Component Renderer

See https://github.com/VoiceNGO/seams-web-component

## Motivation

I wanted in-browser seam carving! I found a few other JS seam carving implementations but they all calculate seams on the fly which is simply too slow (you can't wait 5 seconds for an image to resize...). This is usable in a production site.

## How it works

This is an implementation of the [seam carving](https://en.wikipedia.org/wiki/Seam_carving) algorithm. The only real difference is that instead of calculating seams on the fly we pre-calculate them and provide this data to the browser in a compressed format.

I tried several methods of calculating seams on the fly with moderately successful results, but "great" performance require them to be cached. The brief explanation is that for every seam removed we need to re-generate part of the image heat map and energy maps. This is a fairly expensive operation and my first attempt at optimizing it took about 50ms/seam on a 500x500px image on a modern MacBook Pro. I would need to get this down to ~1ms to make resizing without jitters possible (much faster if I wanted this to work with larger images) and I didn't think this possible, at least not in JS.

FWIW my most successful attempt was accomplished by ignoring everything above and basically guessing where the lowest energy seams were based on the net energy of an entire row/column. This worked fairly well until an important element ran up against the edge of the image at which point it would start to get cut up when the running seam was unable to go around it.

## To Do

- Add support for horizontal seams
- Add ability to mask images
- Add facial detection
- Try other heat map algorithms (visual saliency in particular)
- Read some more tech papers about a few potential optimizations to the seam carving algorithm
- Try more methods around on-the-fly seam generation. I _might_ be able to get something reasonably fast by selectively skipping parts of the heat & energy recalculations. If I could get full image vertical seam generation for a 1024x768 image below 1 second on a modern machine I'd be happy!
