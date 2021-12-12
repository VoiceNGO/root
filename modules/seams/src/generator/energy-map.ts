/* eslint class-methods-use-this: "off", no-magic-numbers: "off", no-multi-assign: "off", max-statements: "off", complexity: "off" */
import { tEnergyMap2D } from '../utils/seam-definition';
import { generatorOptions } from './generator-single';
import {
  gradientMagnitudeX,
  gradientMagnitudeY,
  multiplyAndSum3x3Matricies,
} from './matrices';

export default class EnergyMap {
  summedPixelRGBAValues: Uint8ClampedArray;
  pixelData: Uint8ClampedArray;
  energyMap: tEnergyMap2D;
  cumulativeEnergyMap: tEnergyMap2D;
  width: number;
  height: number;
  options: generatorOptions;

  constructor(imageData: ImageData, options: generatorOptions) {
    this.options = options;
    this.pixelData = imageData.data;
    this.width = imageData.width;
    this.height = imageData.height;

    this.summedPixelRGBAValues = this.#sumPixelRGBAValues();
    this.energyMap = this.#generateEnergyMap();
    this.cumulativeEnergyMap = this.#generatecumulativeEnergyMap();
  }

  // TODO: this could be optimized by scanning the entire table at once instead of calculating energy per pixel
  #generateEnergyMap(): tEnergyMap2D {
    const { width, height } = this;
    const energyMap: tEnergyMap2D = new Array(height);

    for (let y = 0; y < height; y++) {
      energyMap[y] = new Uint16Array(width);

      for (let x = 0; x < width; x++) {
        energyMap[y][x] = this.#energyAtPixel(x, y, height, width);
      }
    }

    return energyMap;
  }

  // TODO: why am I averaging both the horizontal and vertical seam energies in this method?  Compare results to the carved direction only
  #energyAtPixel(
    x: number,
    y: number,
    numRows: number,
    numCols: number
  ): number {
    const { summedPixelRGBAValues } = this;
    const hasUp = y ? 1 : 0;
    const hasDown = y < numRows - 1 ? 1 : 0;
    const hasLeft = x ? 1 : 0;
    const hasRight = x < numCols - 1 ? 1 : 0;

    // 3x3 matrix of pixel energy centered around the current pixel
    const energies = [
      hasUp && hasLeft && summedPixelRGBAValues[(y - 1) * numCols + x - 1],
      hasUp && summedPixelRGBAValues[(y - 1) * numCols + x],
      hasUp && hasRight && summedPixelRGBAValues[(y - 1) * numCols + x + 1],
      hasLeft && summedPixelRGBAValues[y * numCols + x - 1],
      0,
      hasRight && summedPixelRGBAValues[y * numCols + x + 1],
      hasDown && hasLeft && summedPixelRGBAValues[(y + 1) * numCols + x - 1],
      hasDown && summedPixelRGBAValues[(y + 1) * numCols + x],
      hasDown && hasRight && summedPixelRGBAValues[(y + 1) * numCols + x + 1],
    ];

    const xSum = multiplyAndSum3x3Matricies(energies, gradientMagnitudeX);
    const ySum = multiplyAndSum3x3Matricies(energies, gradientMagnitudeY);

    // don't allow zero values because we take some shortcuts and assume that falsey values are undefined
    return Math.sqrt(xSum * xSum + ySum * ySum) || 1e-10;
  }

  #sumPixelRGBAValues(): Uint8ClampedArray {
    const { pixelData, width, height } = this;
    const totalPixels = width * height;
    const summedPixels = new Uint8ClampedArray(totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      summedPixels[i] =
        pixelData[i] + pixelData[i + 1] + pixelData[i + 2] + pixelData[i + 3];
    }

    return summedPixels;
  }

  #generatecumulativeEnergyMap(): tEnergyMap2D {
    const energy = this.energyMap;
    const cumulativeEnergyMap: tEnergyMap2D = (this.cumulativeEnergyMap = [
      this.energyMap[0].slice(),
    ]);
    const { width, height } = this;
    const { forceDiagonals } = this.options;

    for (let y = 1; y < height; y++) {
      const row = new Uint16Array(width);

      for (let x = 0; x < width; x++) {
        const prevRow = cumulativeEnergyMap[y - 1];

        // evals to Math.min(row[x-1], row[x], row[x+1]), but benchmarked 20% faster in chrome & 5x in Safari
        let min =
          prevRow[
            x +
              (x ? (prevRow[x - 1] < (prevRow[x + 1] || Infinity) ? -1 : 1) : 1)
          ];

        if (!forceDiagonals && prevRow[x] < min) {
          min = prevRow[x];
        }

        row[x] = energy[y][x] + min;
      }

      cumulativeEnergyMap[y] = row;
    }

    return cumulativeEnergyMap;
  }

  /**
   * Computes the collected energy at a given pixel, taking into account that relevant pixels might be NaN
   */
  #computeCumulativeEnergyAtPixel(x: number, y: number): number {
    // if the pixel was removed from the energy map, ignore it
    if (!this.energyMap[y][x]) {
      return NaN;
    }

    if (!y) {
      return this.energyMap[y][x];
    }

    const energyRow = this.energyMap[y]!;
    const cols = this.width;
    let center = x;
    let left = x;
    let right = x;

    if (!energyRow[center]) {
      if (energyRow[center - 1]) {
        center--;
        left--;
      } else {
        center++;
        left++; // TODO: should this be right++?
      }
    }

    const leftVal = sumAdjoiningVals(energyRow, left, 1, -1, cols);
    const rightVal = sumAdjoiningVals(energyRow, right, 1, +1, cols);

    return (
      this.energyMap[y][x] +
      Math.min(
        leftVal || Infinity,
        energyRow[center] || Infinity,
        rightVal || Infinity
      )
    );
  }

  /**
   * Recalculates both the energy map and collected energy at a given pixel
   */
  recalcMapAt(x: number, y: number): boolean {
    const energyAtPixel = this.#computeEnergyAtPixel(x, y);
    this.energyMap[y][x] = energyAtPixel;

    let collectedAtPixel = this.#computeCumulativeEnergyAtPixel(y, x);

    // true if data at pixel changed
    return (
      energyAtPixel === this.energyMap[y][x] &&
      collectedAtPixel === this.cumulativeEnergyMap[y][x]
    );
  }

  /**
   * Computes the energy at a given pixel, taking into account that the neighboring pixels might be NaN
   */
  #computeEnergyAtPixel(x: number, y: number): number {
    return this.#gradientMagnitude(x, y);
  }
}
