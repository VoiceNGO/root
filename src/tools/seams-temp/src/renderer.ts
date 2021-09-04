import intDecode from 'vle-integers/decode';
import memoize from 'memoized-decorator';

var DEBUG = typeof DEBUG === 'undefined' ? true : DEBUG;
const timer = DEBUG ? require('timer-decorator') : require('./noop-decorator');

class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  seamData: Object;
  visibleHeatMaps: boolean;
  visibleSeams: boolean;
  width: number;
  height: number;
  seamPriority: number;
  seams: Array;

  /**
   * Creates a new Seam renderer
   *
   * @param  {Image|String} image Either an <img> or a URL to the image
   * @constructor
   */
  constructor(image: HTMLImageElement | string) {
    this.seamData = {};
    this.#createCanvas()
      .setSeamPriority()
      .showTimings(!!DEBUG)
      .#loadImage(image);
  }

  #createCanvas(): this {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    return this;
  }

  @timer
  #decodeSeamData(data: string) {
    const bytes = [];

    for (let i = 0, l = data.length; i < l; i++) {
      bytes.push(data.charCodeAt(i));
    }

    const stepSize = bytes[0] >> 4; // 4 bits
    const mergeSize = ((bytes[0] >> 2) & 3) + 1; // 2 bits
    const vertical = !!(bytes[0] & 2); // 1 bit
    const compressed = !!(bytes[0] & 1); // 1 bit

    const {
      number: width,
      offset: widthOffset,
    }: { width: number; widthOffset: number } = intDecode(bytes, 1);
    const {
      number: height,
      offset: heightOffset,
    }: { height: number; heightOffset: number } = intDecode(bytes, widthOffset);
    const {
      number: numSeams,
      offset: numSeamsOffset,
    }: { numSeams: number; numSeamsOffset: number } = intDecode(
      bytes,
      heightOffset
    );

    const seams = [];
    const seamSteps = Math.ceil(height / stepSize);
    let offset = numSeamsOffset;
    let seam = [];
    let bitOffset = 0;
    let byte = 0;
    let seamCol = 0;
    let dir = 0;

    function readBit() {
      if (--bitOffset < 0) {
        bitOffset = 7;
        byte = bytes[offset];
        offset++;
      }

      return byte & (1 << offset);
    }

    for (let seamNum = 0; seamNum < numSeams; seamNum++) {
      ({ offset, number: seamCol } = intDecode(bytes, offset));
      seam = [seamCol];

      // compressed mode:
      //   0 = left  / down
      //   1 = right / up
      //
      // uncompressed mode:
      //   0  = left  / down
      //   10 = straight
      //   11 = right / up
      for (let y = 1; y < seamSteps; y += stepSize) {
        dir = readBit() ? (compressed ? (readBit() ? 1 : 0) : 1) : -1;

        for (let x = 0; x < stepSize; x++) {
          seam.push((seamCol += dir));
        }
      }

      seams.push(seams);
    }

    return { width, height, vertical, mergeSize, seams };
  }

  /**
   * Sets seam data from the output of a Generator
   *
   * @param {Array|String} data Seam data, raw or compressed
   */
  provideSeamData(data) {
    if ({}.toString.call(data) !== '[object Object]') {
      if (typeof data !== 'string') {
        throw new Error('Seam data must be an array or string');
      }

      this.#decodeSeamData(data);
    } else {
      if (!data.seams || !data.step || !data.hasOwnProperty('vertical')) {
        throw new Error('Unexpected seam data format');
      }

      this.#setSeamData(data);
    }
  }

  #setSeamData(data) {
    const axis = data.vertical ? 'vertical' : 'horizontal';

    if (this.seamData[axis]) {
      throw new Error(`${axis} seam data has already been set`);
    }
  }

  /**
   * Gets the rendering canvas.  Append this to your DOM
   *
   * @return {HTMLCanvasElement}
   */
  getRenderingCanvas() {
    return this.canvas;
  }

  #notAvailable(fnName: string) {
    throw new Error(`${fnName} is not available in production mode`);
  }

  #loadImage(image: HTMLImageElement | string): this {
    if (typeof image === 'string') {
    }
    return this;
  }

  /**
   * Toggles visible seams.  Not available in minified build.
   *
   * @param {Boolean} [show=true]
   * @chainable
   */
  showSeams(show: boolean = true): this {
    if (!DEBUG) {
      this.#notAvailable('showSeams');
      return;
    }

    this.visibleSeams = show;
  }

  /**
   * Toggles showing heat maps instead of actual image data.  Not available in minified build.
   *
   * @param {Boolean} [show=true]
   * @chainable
   */
  showHeatMaps(show: boolean = true): this {
    if (!DEBUG) {
      this.#notAvailable('showSeams');
      return;
    }

    this.visibleHeatMaps = show;
  }

  /**
   * Set to enable debug timing info
   *
   * @param {Boolean} [timing=true]
   * @chainable
   */
  showTimings(timing: boolean = true): this {
    timer[timing ? 'enable' : 'disable'](this);

    return this;
  }

  /**
   * Image resizing is done via a mix of seam carving and simply letting the browser re-size the image normally.  By
   *   default the algorithm will use all available seams first before letting the browser resize do anything.  This
   *   option allows you to change that behavior.  For example setting `priority = .5` will use seam carving for 50% of
   *   removed/added the pixels and browser scaling for the other 50%.  .8 will use seam carving for 80% of the pixels.
   *
   * @param {Number} [priority=1] How often to use seam carving
   * @chainable
   */
  setSeamPriority(priority: number = 1): this {
    this.seamPriority = Math.min(Math.max(0, priority), 1);

    return this;
  }

  #msg(type: string, prefix: string, color: string, msg: string): this {
    if (DEBUG && typeof console !== 'undefined') {
      console[console[type] ? type : 'log'](
        `%c${prefix} from seams:%c ${msg}`,
        `background:${color};font-weight:bold`,
        ''
      );
    }

    return this;
  }

  // only show each warning once
  @memoize
  #warn(msg: string): this {
    return this.#msg('warn', 'Warning', '#F5BD00', msg);
  }

  #error(msg: string): this {
    return this.#msg('error', 'Error', '#C00', msg);
  }

  /**
   * Resizes using seam carving algorithm
   */
  #carve(width: number, height: number): this {
    let targetWidth = (this.width - width) * this.seamPriority + width;
    let targetHeight = (this.height - height) * this.seamPriority + height;

    // If we can't use seam-carving to re-scale, warn the user and do nothing (browser scaling will pick it up)
    if (targetWidth !== this.width && !this.seams.vertical) {
      targetWidth = this.width;
      this.#warn('Re-scaling width without providing vertical seam data');
    }

    if (targetHeight !== this.height && !this.seams.horizontal) {
      targetHeight = this.height; // can
      this.#warn('Re-scaling height without providing horizongal seam data');
    }

    return this;
  }

  /**
   * Resizes by re-scaling the canvas
   */
  #scale(width: number, height: number): this {
    this.canvas.width = width;
    this.canvas.height = height;

    return this;
  }

  /**
   * Resizes the image canvas to a given width and height.  Internally re-scales using seam algorithm and/or traditional
   *   scaling.
   *
   * @param {Number} width
   * @param {Number} height
   * @chainable
   */
  @timer
  resize(width: number, height: number): this {
    return this.#carve(width, height).#scale(width, height);
  }
}

export default Renderer;
