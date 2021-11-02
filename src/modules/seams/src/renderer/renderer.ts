/* eslint no-console: "off", max-statements: "off", class-methods-use-this: "off", no-bitwise: "off", no-magic-numbers: "off", no-implicit-coercion: "off", lines-between-class-members: "off", max-params: "off", no-duplicate-imports: "off" */
import getImageData from '../utils/get-image-data';
import {
  HORIZONTAL,
  tPixelPriorityMaps,
  VERTICAL,
} from '../utils/seam-definition';
import decodeSeams from './seam-decoder';

const defaultOptions = {
  seamPriority: 1,
  visibleSeams: false,
  visibleHeatMaps: false,
  autoResize: false,
  autoResizeDimension: 'width' as 'width' | 'height' | 'both',
};

export type rendererOptions = typeof defaultOptions;

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
  #verticalSeamMap!: Int16Array;
  #width!: number;
  #pxPriorityMaps!: tPixelPriorityMaps;

  /**
   * Creates a new Seam renderer
   *
   * @param  {Image|String} image Either an <img> or a URL to the image
   * @constructor
   */
  constructor(
    imgSrc: string,
    seamData: string | tPixelPriorityMaps,
    options: Partial<rendererOptions>
  ) {
    // very old browsers just fallback to using an image
    if (!typedArraysAvailable) {
      this.#imageNode = new Image();
      this.#imageNode.src = imgSrc;

      return;
    }

    this.#loadImage(imgSrc);
    this.setOptions(options);
    this.#createCanvas();
    this.#importSeamData(seamData);
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

  #validateSeamDataFormat(
    seamData: tPixelPriorityMaps | string
  ): seamData is tPixelPriorityMaps {
    return (
      ({}.toString.call(seamData) === '[object Object]' &&
        {}.hasOwnProperty.call(seamData, VERTICAL)) ||
      {}.hasOwnProperty.call(seamData, HORIZONTAL)
    );
  }

  #importSeamData(seamData: string | tPixelPriorityMaps): void {
    const isSeamDataObject = this.#validateSeamDataFormat(seamData);
    const isSeamString = typeof seamData === 'string';

    if (isSeamDataObject) {
      this.#pxPriorityMaps = seamData;
    } else if (isSeamString) {
      this.#pxPriorityMaps = decodeSeams(seamData);
    } else {
      throw new Error('Unexpected seam data format');
    }
  }

  getRenderingNode(): HTMLElement {
    if (typedArraysAvailable) {
      return this.#canvas;
    }

    return this.#imageNode;
  }

  #loadImage(imgSrc: string): void {
    this.#imagePromise = getImageData(imgSrc);
    this.#imagePromise.then((imageData) => {
      this.#imageData = imageData;
    });
  }

  #warn(msg: string): void {
    if (this.#displayedWarnings.has(msg)) return;
    this.#displayedWarnings.add(msg);

    const logFn = console?.warn || console?.log;
    if (!logFn) return;

    logFn(
      `%cWarning from seams:%c ${msg}`,
      `background:#F5BD00;font-weight:bold`,
      ''
    );
  }

  #carve(width: number, height: number): void {
    this.#imagePromise.then(() => {
      const { seamPriority } = this.#options;
      const { width: sourceWidth, height: sourceHeight } = this.#imageData;

      let targetCarvingWidth = width + (sourceWidth - width) * seamPriority;
      let targetCarvingHeight = height + (sourceHeight - height) * seamPriority;
      const {
        vertical: verticalPriorityMap,
        horizontal: horizontalPriorityMap,
      } = this.#pxPriorityMaps;
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

      if (!verticalPriorityMap && targetCarvingWidth !== sourceWidth) {
        targetCarvingWidth = sourceWidth;
        this.#warn(
          'Attempting to re-scale width without providing vertical seam data'
        );
      }

      if (!horizontalPriorityMap && targetCarvingHeight !== sourceHeight) {
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
    });
  }

  #carveImageData(
    targetWidth: number,
    targetHeight: number,
    numRemoveVerticalSeams: number,
    numRemoveHorizontalSeams: number
  ): Uint8ClampedArray {
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

  #scaleCanvas(width: number, height: number): this {
    this.#canvas.width = width;
    this.#canvas.height = height;

    return this;
  }

  setWidthAndHeight(width: number, height: number): void {
    if (!typedArraysAvailable) return;

    this.#carve(width, height);
    this.#scaleCanvas(width, height);
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
    this.#scaleCanvas(0, 0);
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
