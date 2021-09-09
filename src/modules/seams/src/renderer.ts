/* eslint no-console: "off", max-statements: "off", class-methods-use-this: "off", no-bitwise: "off", no-magic-numbers: "off", no-implicit-coercion: "off", lines-between-class-members: "off", max-params: "off", no-duplicate-imports: "off" */
import { read } from 'fs';
import getImageData from './get-image-data';

const defaultOptions = {
  seamPriority: 1,
  visibleSeams: false,
  visibleHeatMaps: false,
  autoResize: false,
  autoResizeDimension: 'width' as 'width' | 'height' | 'both',
};

export type rendererOptions = typeof defaultOptions;

type seam = number[];

type seamsDefinition = {
  width: number;
  height: number;
  isVertical: boolean;
  mergeSize: number;
  seams: seam[];
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const typedArraysAvailable = typeof Uint8ClampedArray === 'function';

class Renderer {
  #canvas!: HTMLCanvasElement;
  #ctx!: CanvasRenderingContext2D;
  #displayedWarnings: Set<string> = new Set();
  #height!: number;
  #horizontalSeamMap!: Int16Array;
  #imageData!: ImageData;
  #imageNode!: HTMLImageElement;
  #imagePromise!: Promise<ImageData>;
  #numHorizontalSeams!: number;
  #numVerticalSeams!: number;
  #options: rendererOptions = defaultOptions;
  #resizeHandler?: () => void;
  #seamData: { horizontal?: seamsDefinition; vertical?: seamsDefinition } = {};
  #verticalSeamMap!: Int16Array;
  #width!: number;

  /**
   * Creates a new Seam renderer
   *
   * @param  {Image|String} image Either an <img> or a URL to the image
   * @constructor
   */
  constructor(
    imgSrc: string,
    seamData: string | seamsDefinition,
    options: Partial<rendererOptions>
  ) {
    // very old browsers just fallback to using an image
    if (typedArraysAvailable) {
      this.setOptions(options);
      this.#createCanvas();
      this.#loadImage(imgSrc);
      this.#importSeamData(seamData);
    } else {
      this.#imageNode = new Image();
      this.#imageNode.src = imgSrc;
    }
  }

  setOptions(options: Partial<rendererOptions>): void {
    this.#options = { ...this.#options, ...options };

    if (options.autoResize && !this.#resizeHandler) {
      this.#bindResizeHandler();
    }
  }

  #createCanvas(): void {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d')!; // FFS TS, `2d` is *always* supported
  }

  #decodeSeamData(data: string): void {
    const bytes = data.split('').map((char) => char.charCodeAt(0));

    const stepSize = bytes[0] >> 4; // 4 bits
    const mergeSize = ((bytes[0] >> 2) & 3) + 1; // 2 bits
    const isVertical = !!(bytes[0] & 2); // 1 bit
    const compressed = !!(bytes[0] & 1); // 1 bit

    let decodeOffset = 1;
    let byte = 0;
    let bitOffset = 0;

    function read2ByteNumber() {
      const byte1 = bytes[decodeOffset++];
      const byte2 = bytes[decodeOffset++];

      return (byte1 << 8) + byte2;
    }

    function readBit() {
      if (--bitOffset < 0) {
        bitOffset = 7;
        byte = bytes[decodeOffset];
        decodeOffset++;
      }

      return byte & (1 << decodeOffset);
    }

    const width = read2ByteNumber();
    const height = read2ByteNumber();
    const numSeams = read2ByteNumber();

    const seams: seam[] = [];
    const numSeamSteps = Math.ceil((isVertical ? height : width) / stepSize);

    // using x, y, and col here for my own sanity, but the seams are actually non-directional except for the `isVertical` flag
    for (let seamNum = 0; seamNum < numSeams; seamNum++) {
      let seamCol = read2ByteNumber();
      const seam: seam = [seamCol];

      // compressed mode:
      //   0 = left  / down
      //   1 = right / up
      //
      // uncompressed mode:
      //   0  = left  / down
      //   10 = straight
      //   11 = right / up
      for (let y = 1; y < numSeamSteps; y += stepSize) {
        const dir = readBit() ? (compressed ? 1 : readBit() ? 1 : 0) : -1;

        for (let x = 0; x < stepSize; x++) {
          seam.push((seamCol += dir));
        }
      }

      seams.push(seam);
    }

    if (isVertical) {
      this.#generateVerticalSeamsMap(seams, width, height, mergeSize);
    } else {
      this.#generateHorizontalSeamsMap(seams, width, height, mergeSize);
    }
  }

  #generateVerticalSeamsMap(
    seams: seam[],
    width: number,
    height: number,
    mergeSize: number
  ): void {
    const totalPixels = width * height;
    const seamMap = new Int16Array(totalPixels);
    seamMap.fill(0xffff);

    seams.forEach((seam, priority) => {
      for (let y = 0; y < height; y++) {
        seam.forEach((x) => {
          for (let i = 0; i < mergeSize; i++) {
            seamMap[y * width + x + i] = priority;
          }
        });
      }
    });

    this.#verticalSeamMap = seamMap;
    this.#numVerticalSeams = seams.length;
  }

  #generateHorizontalSeamsMap(
    seams: seam[],
    width: number,
    height: number,
    mergeSize: number
  ): void {
    const totalPixels = width * height;
    const seamMap = new Int16Array(totalPixels);
    seamMap.fill(0xffff);

    seams.forEach((seam, priority) => {
      for (let x = 0; x < width; x++) {
        seam.forEach((y) => {
          for (let i = 0; i < mergeSize; i++) {
            seamMap[y * width + x + i] = priority + 1;
          }
        });
      }
    });

    this.#horizontalSeamMap = seamMap;
    this.#numHorizontalSeams = seams.length;
  }

  #validateSeamDataFormat(
    seamData: seamsDefinition | string
  ): seamData is seamsDefinition {
    return (
      {}.toString.call(seamData) === '[object Object]' &&
      {}.hasOwnProperty.call(seamData, 'seams') &&
      {}.hasOwnProperty.call(seamData, 'width') &&
      {}.hasOwnProperty.call(seamData, 'height') &&
      {}.hasOwnProperty.call(seamData, 'vertical') &&
      {}.hasOwnProperty.call(seamData, 'stepSize')
    );
  }

  #importSeamData(seamData: string | seamsDefinition): void {
    const isSeamDataObject = this.#validateSeamDataFormat(seamData);
    const isSeamString = typeof seamData === 'string';

    if (isSeamDataObject) {
      this.#setSeamData(seamData);
    } else if (isSeamString) {
      this.#decodeSeamData(seamData);
    } else {
      throw new Error('Unexpected seam data format');
    }
  }

  #setSeamData(seamData: seamsDefinition): void {
    const axis = seamData.isVertical ? 'vertical' : 'horizontal';

    this.#seamData[axis] = seamData;
  }

  /**
   * Gets the rendering node.  Append this to your DOM
   */
  getRenderingNode(): HTMLElement {
    if (typedArraysAvailable) {
      return this.#canvas;
    } else {
      return this.#imageNode;
    }
  }

  #loadImage(imgSrc: string): void {
    this.#imagePromise = getImageData(imgSrc);
    this.#imagePromise.then((imageData) => {
      this.#imageData = imageData;
    });
  }

  #msg(
    type: keyof typeof console,
    prefix: string,
    color: string,
    msg: string
  ): this {
    // @ts-expect-error -- TS is being annoying
    console[console[type] ? type : 'log'](
      `%c${prefix} from seams:%c ${msg}`,
      `background:${color};font-weight:bold`,
      ''
    );

    return this;
  }

  #warn(msg: string): void {
    if (this.#displayedWarnings.has(msg)) return;

    this.#displayedWarnings.add(msg);
    this.#msg('warn', 'Warning', '#F5BD00', msg);
  }

  #carve(width: number, height: number): this {
    this.#imagePromise.then(() => {
      const { seamPriority } = this.#options;
      const { width: sourceWidth, height: sourceHeight } = this.#imageData;
      const seamData = this.#seamData;

      let targetCarvingWidth = width + (sourceWidth - width) * seamPriority;
      let targetCarvingHeight = height + (sourceHeight - height) * seamPriority;
      const { vertical: verticalSeamData, horizontal: horizontalSeamData } =
        seamData;
      const numRemovedVerticalSeams = sourceWidth - targetCarvingWidth;
      const numRemovedHorizontalSeams = sourceHeight - targetCarvingHeight;

      if (width > sourceWidth) {
        targetCarvingWidth = sourceWidth;
        this.#warn('Scaling to > 100% width is not currently supported');
      }

      if (height > sourceHeight) {
        targetCarvingHeight = sourceHeight;
        this.#warn('Scaling to > 100% height is not currently supported');
      }

      if (!verticalSeamData && targetCarvingWidth !== sourceWidth) {
        targetCarvingWidth = sourceWidth;
        this.#warn(
          'Attempting to re-scale width without providing vertical seam data'
        );
      }

      if (!horizontalSeamData && targetCarvingHeight !== sourceHeight) {
        targetCarvingHeight = sourceHeight;
        this.#warn(
          'Attempting to re-scale height without providing horizontal seam data'
        );
      }

      if (numRemovedVerticalSeams > this.#numVerticalSeams) {
        targetCarvingWidth = sourceWidth - this.#numVerticalSeams;
      }

      if (numRemovedHorizontalSeams > this.#numHorizontalSeams) {
        targetCarvingHeight = sourceHeight - this.#numHorizontalSeams;
      }

      const carvedImageData = this.#carveImageData(
        targetCarvingWidth,
        targetCarvingHeight,
        numRemovedVerticalSeams,
        numRemovedHorizontalSeams
      );

      this.#ctx.putImageData(
        new ImageData(carvedImageData, targetCarvingWidth, targetCarvingHeight),
        0,
        0
      );

      return this;
    });

    return this;
  }

  #carveImageData(
    targetWidth: number,
    targetHeight: number,
    numRemoveVerticalSeams: number,
    numRemoveHorizontalSeams: number
  ): Uint8ClampedArray {
    // eslint-disable-next-line -- false positive
    const imageData = this.#imageData.data;
    const verticalSeamMap = this.#verticalSeamMap;
    const horizontalSeamMap = this.#horizontalSeamMap;

    const numPixels = targetWidth * targetHeight;
    const carvedImageData = new Uint8ClampedArray(numPixels * 4);
    let outIndex = 0;

    for (let i = 0; i < numPixels; i++) {
      if (
        (!verticalSeamMap || verticalSeamMap[i] >= numRemoveVerticalSeams) &&
        (!horizontalSeamMap || horizontalSeamMap[i] >= numRemoveHorizontalSeams)
      ) {
        const i4 = i * 4;

        carvedImageData[outIndex] = imageData[i4];
        carvedImageData[outIndex + 1] = imageData[i4 + 1];
        carvedImageData[outIndex + 2] = imageData[i4 + 2];
        carvedImageData[outIndex + 3] = imageData[i4 + 3];
        outIndex += 4;
      }
    }

    // shut up TS, we're doing the typechecks via a single const
    return carvedImageData as Uint8ClampedArray;
  }

  /**
   * Resizes by re-scaling the canvas
   */
  #scale(width: number, height: number): this {
    this.#canvas.width = width;
    this.#canvas.height = height;

    return this;
  }

  setWidthAndHeight(width: number, height: number): void {
    if (!typedArraysAvailable) return;

    this.#carve(width, height).#scale(width, height);
  }

  setWidth(width: number): void {
    const newHeight = (width / this.#width) * this.#height;
    this.setWidthAndHeight(width, newHeight);
  }

  setHeight(height: number): void {
    const newWidth = (height / this.#height) * this.#width;
    this.setWidthAndHeight(newWidth, height);
  }

  #bindResizeHandler(): void {
    this.#resizeHandler = () => this.#onResize();
    window.addEventListener('resize', this.#resizeHandler);
  }

  removeResizeListener(): void {
    if (this.#resizeHandler) {
      window.removeEventListener('resize', this.#resizeHandler);
      // @ts-expect-error -- no idea why TS is whining here, ts playground doesn't whine
      this.#resizeHandler = undefined;
    }
  }

  async #onResize(): Promise<void> {
    this.#scale(0, 0);
    await wait(1);

    const {
      #autoResizeDimension: autoResizeDimension,
      #canvas: { offsetParent },
    } = this;

    if (!offsetParent) return;

    const { clientWidth, clientHeight } = offsetParent;

    switch (autoResizeDimension) {
      case 'width':
        this.setWidth(clientWidth);
        break;

      case 'height':
        this.setHeight(clientHeight);
        break;

      case 'both':
        this.setWidthAndHeight(clientWidth, clientHeight);
        break;
    }
  }
}

export default Renderer;
