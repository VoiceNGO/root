/* eslint complexity: "off", max-statements: "off", no-param-reassign: "Off", no-multi-assign: "off", no-magic-numbers: "off", voice/curly-except-return: "off", class-methods-use-this: "off", max-params: "off", no-negated-condition: "off", prefer-destructuring: "off", max-nested-callbacks: "off", no-unused-expressions: "off", no-bitwise: "off" */

/**
 * Algorithm:
 * - If horizontal, rotate the image data 90º ccw
 * - Calculate the energy at each pixel and store it in an Energy Map
 * - Calculate the lowest summed energy from the top of the map to the given pixel, store it in a Cumulative Energy Map
 *     https://projecteuler.net/problem=18 describes this problem and gives a visual (though they use a triangle)
 * - Find the pixel in the bottom row with the lowest cumulative energy
 * - Walk up from there through the lowest cumulative energy pixels to find the seam with lowest energy
 * - Store this seam, and remove it from the energy map
 * - Recompute both energy maps as needed
 *   - Start from the top and create a sliding window of pixels affected by the last seam
 *   - Re-calc pixels in that window and expand as needed on each row
 * - Repeat for N seams
 */

import pick from '../utils/pick';
import {
  tDirectionalSeams,
  tPixelPriorityMap2D,
  tPixelPriorityMaps,
  tSeamDirection,
  tSeams,
  VERTICAL,
} from '../utils/seam-definition';
import EnergyMap from './energy-map';
import seamEncoder from './seam-encoder';

export type generatorOptions = {
  forceDiagonals?: boolean;
  stepSize?: number;
  mergeSize?: number;
  direction?: tSeamDirection;
  maxSeams?: number;
  percentage?: number;
};

export default class Generator {
  forceDiagonals = true;
  stepSize = 2;
  mergeSize = 1;
  direction: tSeamDirection = VERTICAL;
  maxSeams = Infinity;
  percentage = 0.5;
  imageData: Uint8ClampedArray;
  imageWidth: number;
  imageHeight: number;
  energyMap: EnergyMap;

  constructor(imageData: ImageData, options: generatorOptions = {}) {
    this.#setOptions(options);

    this.energyMap = new EnergyMap(imageData, options);
    this.imageData = imageData.data;
    this.imageWidth = imageData.width;
    this.imageHeight = imageData.height;

    this.#generateSeams();
  }

  #setOptions(options: generatorOptions): void {
    const { stepSize, mergeSize, maxSeams } = options;

    if (stepSize && (stepSize < 1 || stepSize > 15)) {
      throw new Error('stepSize must be in the range of 1..15');
    }

    if (mergeSize && (mergeSize < 1 || mergeSize > 4)) {
      throw new Error('mergeSize must be in the range of 1..4');
    }

    if (maxSeams && maxSeams === -1) {
      options.maxSeams = Infinity;
    }

    Object.assign(this, options);
  }

  getPixelPrirityMap(): tPixelPriorityMap2D {
    const seams = this.#generateSeams();
    const { imageWidth, imageHeight } = this;
    const pxPriorityMap: tPixelPriorityMap2D = Array.from({
      length: imageHeight,
    }).map(() => new Uint16Array(imageWidth));

    for (
      let seamIndex = 0, numSeams = seams.length;
      seamIndex < numSeams;
      seamIndex++
    ) {
      const seam = seams[seamIndex];

      for (let y = 0, lY = seam.length; y < lY; y++) {
        pxPriorityMap[y][seam[y]] = seamIndex;
      }
    }

    return pxPriorityMap;
  }

  getEncodedSeamData(): string {
    const seams = this.#generateSeams();

    const encoderConfig = {
      isVertical: this.direction === VERTICAL,
      seams,
      ...pick(
        this,
        'stepSize',
        'mergeSize',
        'forceDiagonals',
        'imageWidth',
        'imageHeight'
      ),
    };

    return seamEncoder(encoderConfig);
  }

  #generateSeams(): tSeams {
    const numSeams = Math.ceil(
      Math.min(this.seamLimit, (this.width / this.stepSize) * this.percentSeams)
    );
    const seams = new Array(numSeams);

    for (let i = 0; i < numSeams; i++) {
      const seam = this.#createSeam();
      seams[i] = seam;
      this.#removeSeamFromEnergy(seam);
    }

    return seams;
  }
}

const foo = Object.values({ x: 42, y: 55 }).reduce<boolean>(
  (prev, curr) => !!prev || !!curr,
  false
);
