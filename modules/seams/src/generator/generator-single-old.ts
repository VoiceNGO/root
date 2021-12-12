/* eslint complexity: "off", max-statements: "off", no-param-reassign: "Off", no-multi-assign: "off", no-magic-numbers: "off", voice/curly-except-return: "off", class-methods-use-this: "off", max-params: "off", no-negated-condition: "off", prefer-destructuring: "off", max-nested-callbacks: "off", no-unused-expressions: "off", no-bitwise: "off" */
import type { seam, pxMap, seamsDefinition } from '../seam.d';
import { encode as intEncode } from 'vle-integers';
import matrices from './matrices';

// /**
//  * converts a stepped "sparse" arrays into a dense one, e.g.:
//  *   [1, 3, 5, 3] -> [1, 2, 3, 4, 5, 4, 3]
//  */
// function toDenseArray(sparseArray: number[], stepSize: number) {
//   return sparseArray
//     .map((val, ix) =>
//       Array.from({ length: ix < sparseArray.length - 1 ? stepSize : 1 }).map(
//         // @ts-expect-error -- TS doesn't understand array lengths very well
//         (a, aIx) => val + (val < sparseArray[ix + 1] ? 1 : -1) * aIx
//       )
//     )
//     .flat();
// }

// function toDenseSeamArray(seams: seam[], stepSize: number): seam[] {
//   // eslint-disable-next-line @typescript-eslint/no-shadow -- false positive from imported type
//   return seams.map((seam) => toDenseArray(seam, stepSize));
// }

function sumAdjoiningVals(
  ary: number[],
  aryIndex: number,
  count: number,
  direction: number,
  aryLength: number
) {
  let ttl = 0;

  for (let i = aryIndex + direction; i >= 0 && i < aryLength; i += direction) {
    if (ary[i]) {
      ttl += ary[i]!;
      count--;

      if (!count) {
        return ttl;
      }
    }
  }

  return ttl;
}

/*
function adjoiningValues(ary, aryLen, x) {
  let center = x;
  let left = x - 1;
  let right = x + 1;

  while (left >= 0 && !ary[left]) {
    left--;
  }
  while (right < aryLen && !ary[right]) {
    right++;
  }

  // center "steals" closest value
  if (!ary[center]) {
    // right is closer, or left doesn't exist
    if (left < 0 || left - center - center - right < 0) {
      center = right++;
      while (right < aryLen && !ary[right]) {
        right++;
      }
    } else {
      center = left--;
      while (left >= 0 && !ary[left]) {
        left--;
      }
    }
  }

  return [ary[left] || 0, ary[center], ary[right] || 0];
}
*/

function rightIsCloser(left: number, center: number, right: number): boolean {
  return left - center - center - right < 0;
}

function recomputeEnergyAtPixel(
  x: number,
  y: number,
  energyMap: number[][],
  pxData: number[][],
  rows: number,
  cols: number
) {
  const up = y;
  const down = y < rows - 1;
  let left;
  let right;
  let center;
  let row;
  let tmp;

  let xSum = 0;
  let ySum = 0;

  if (up) {
    left = x - 1;
    right = x + 1;
    center = x;
    row = pxData[y - 1]!;

    while (!row[left] && left-- > 0);
    while (!row[right] && right++ < cols);

    if (!row[center]) {
      if (!row[left] || rightIsCloser(left, center, right)) {
        center = right;
        while (!row[right] && right++ < cols);
      } else {
        center = left;
        while (!row[left] && left-- > 0);
      }
    }

    if (row[left]) {
      xSum += tmp = -1 * pxEnergy(pxData, cols, left, y - 1);
      ySum += tmp;
    }

    ySum += -2 * pxEnergy(pxData, cols, center, y - 1);

    if (row[right]) {
      xSum += tmp = pxEnergy(pxData, cols, right, y - 1);
      ySum += -1 * tmp;
    }
  }

  // center row
  left = x - 1;
  right = x + 1;
  row = pxData[y];

  while (!row[left] && left-- > 0);
  while (!row[right] && right++ < cols);

  if (row[left]) {
    xSum += -2 * pxEnergy(pxData, cols, left, y);
  }

  if (row[right]) {
    xSum += 2 * pxEnergy(pxData, cols, right, y);
  }

  if (down) {
    left = x - 1;
    right = x + 1;
    center = x;
    row = pxData[y + 1];

    while (!row[left] && left-- > 0);
    while (!row[right] && right++ < cols);

    if (!row[center]) {
      if (!row[left] || rightIsCloser(left, center, right)) {
        center = right;
        while (!row[right] && right++ < cols);
      } else {
        center = left;
        while (!row[left] && left-- > 0);
      }
    }

    if (row[left]) {
      xSum += -1 * (tmp = pxEnergy(pxData, cols, left, y - 1));
      ySum += tmp;
    }

    ySum += +2 * pxEnergy(pxData, cols, center, y - 1);

    if (row[right]) {
      xSum += tmp = pxEnergy(pxData, cols, right, y - 1);
      ySum += tmp;
    }
  }

  // don't allow zero values because we take some shortcuts and assume that falsey values are undefined
  const energy = Math.sqrt(xSum * xSum + ySum * ySum) || 1e-10;
  if (energyMap[y][x] !== energy) {
    energyMap[y][x] = energy;
    return true;
  }

  return false;
}

function recomputeCollectedAtPixel(x, y) {
  return false;
}

// const HIGH_ENERGY = 1E10;
// const LOW_ENERGY  = -1E10;

export type generatorOptions = {
  forceDiagonals?: boolean;
  stepSize?: number;
  mergeSize?: number;
  direction?: 'vertical' | 'horizontal';
  maxSeams?: number;
  percentage?: number;
};

class Generator {
  forceDiagonals = true;
  stepSize = 2;
  mergeSize = 1;
  direction: 'vertical' | 'horizontal' = 'vertical';
  maxSeams = Infinity;
  percentage = 0.5;
  image!: ImageData;
  imageData: Uint8ClampedArray;
  imagePromise: Promise<void>;

  data!: number[];
  energyMap!: number[][];
  height!: number;
  width!: number;

  constructor(imgPromise: Promise<ImageData>, options: generatorOptions = {}) {
    this.#setOptions(options);

    this.imagePromise = imgPromise.then((img) => {
      this.image = img;
      this.imageData = img.data;
    });
  }

  /**
   * Rotates the image by 90 degrees for when we want to compute horizontal seams.  This simplifies all of the
   *   algorithms because we're now only working with seemingly horizontal seams :)
   */
  // async #setRotation(): Promise<void> {
  //   await this.imagePromise;

  //   if (this.direction === 'vertical') {
  //     this.width = this.image.width;
  //     this.height = this.image.height;
  //   } else {
  //     this.height = this.image.width;
  //     this.width = this.image.height;
  //   }
  // }

  /**
   * Gets the cumulative (R+G+B) * A energy at a pixel normalized to 0..1
   */
  #getPixelSubEnergy(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 0;
    }

    const ix = (y * this.width + x) * 4;

    return (
      ((this.imageData[ix + 0] +
        this.imageData[ix + 1] +
        this.imageData[ix + 2]) *
        this.imageData[ix + 3]) /
      255 /
      255 /
      3
    );
  }

  /**
   * Computes the gradient magnitude energy at a given pixel
   *
   * Gx = [-1 0 +1]  Gy = [-1 -2 -1]
   *      [-2 0 +2]       [ 0  0  0]
   *      [-1 0 +1]       [+1 +2 +1]
   *
   * G = sqrt(Gx^2 + Gy^2)
   */
  #gradientMagnitude(x: number, y: number): number {
    const cols = this.width;
    const rows = this.height;
    const matrixX = matrices.gradientMagnitudeX;
    const matrixY = matrices.gradientMagnitudeY;
    let xSum = 0;
    let ySum = 0;

    for (let row = y ? -1 : 0, limit = y < rows ? 2 : 1; row < limit; row++) {
      let left = x - 1;
      let right = x + 1;
      let center = x;
      const mapRow = this.energyMap[y + row];

      if (mapRow) {
        // if the center pixel doesn't exist, make it "take" the left or right pixel
        if (!mapRow[center]) {
          if (mapRow[left]) {
            left--;
            center--;
          } else {
            right++;
            center++;
          }
        }

        while (left >= 0 && !mapRow[left]) {
          left--;
        }
        while (right <= cols && !mapRow[right]) {
          right++;
        }
      }

      let tmp = null;

      // TODO: matricies were converted to 1D array.  This is now broken
      xSum +=
        (!(tmp = matrixX[row + 1]![0])
          ? 0
          : tmp * this.#getPixelSubEnergy(left, y + row)) +
        (!(tmp = matrixX[row + 1]![1])
          ? 0
          : tmp * this.#getPixelSubEnergy(center, y + row)) +
        (!(tmp = matrixX[row + 1]![2])
          ? 0
          : tmp * this.#getPixelSubEnergy(right, y + row));

      ySum +=
        (!(tmp = matrixY[row + 1]![0])
          ? 0
          : tmp * this.#getPixelSubEnergy(left, y + row)) +
        (!(tmp = matrixY[row + 1]![1])
          ? 0
          : tmp * this.#getPixelSubEnergy(center, y + row)) +
        (!(tmp = matrixY[row + 1]![2])
          ? 0
          : tmp * this.#getPixelSubEnergy(right, y + row));
    }

    return Math.sqrt(xSum * xSum + ySum * ySum);
  }

  /**
   * Computes the cumulative energy at each pixel top-down
   */
  #computeLowestSeamEnergies() {
    const energy = this.energyMap;
    const collected = (this.collectedMap = [this.energyMap[0].slice()]);
    const cols = this.width;
    const rows = this.height;

    for (let y = 1; y < rows; y++) {
      const row = new Array(cols);

      for (let x = 0; x < cols; x++) {
        const prevRow = collected[y - 1];
        let min =
          prevRow[
            x +
              (x ? (prevRow[x - 1] < (prevRow[x + 1] || Infinity) ? -1 : 1) : 1)
          ];

        if (!this.forceDiagonals && prevRow[x] < min) {
          min = prevRow[x];
        }

        row[x] = energy[y][x] + min;
      }

      collected[y] = row;
    }

    return this;
  }

  /**
   * Removes a seam from the energy map and lowest computed energies by re-calculating only the pieces of the energy and
   *   seam maps that are directly affected by the seam.
   */
  #removeSeamFromEnergy(seam) {
    const mergeSize = this.mergeSize;
    const height = this.height;
    const width = this.width;
    const energyMap = this.energyMap;
    const collectedMap = this.collectedMap;
    let minCol = seam[0];
    let maxCol = minCol + mergeSize;

    // remove the seam from the maps
    // Must be done first so that pixels at y+1 are null when re-calculating row-by-row
    for (let y = 0; y < this.height; y++) {
      x = seam[y];

      for (let w = 0; w < mergeSize; w++) {
        energyMap[y][x + w] = null;
        collectedMap[y][x + w] = null;
      }
    }

    function recalcMaps(x, y, energyMap, collectedMap, pxData, rows, cols) {
      let energyChanged = recomputeEnergyAtPixel(
        x,
        y,
        energyMap,
        pxData,
        rows,
        cols
      );
      let collectedChanged = recomputeCollectedAtPixel(x, y);

      return energyChanged || collectedChanged;
    }

    // re-calculate the affected areas of the maps around the seam
    for (let y = 0; y < this.height; y++) {
      let seamL = seam[y];
      let seamR = Math.min(width - 1, seam[y] + mergeSize - 1);
      let lastRow = y === this.height - 1;

      minCol = Math.max(
        0,
        Math.min(
          minCol - 1,
          seamL - 1,
          lastRow ? Infinity : seam[y + 1] - mergeSize
        )
      );
      maxCol = Math.min(
        width,
        Math.max(maxCol + 1, seamR + 1, lastRow ? 0 : seam[y + 1] + mergeSize)
      );

      // for each value at the left or right edges that hasn't changed, narrow the range
      while (
        minCol < seamL &&
        !recalcMaps(
          minCol,
          y,
          energyMap,
          collectedMap,
          this.imageData,
          height,
          width
        )
      ) {
        minCol++;
      }
      while (
        maxCol > seamR &&
        !recalcMaps(
          maxCol,
          y,
          energyMap,
          collectedMap,
          this.imageData,
          height,
          width
        )
      ) {
        maxCol--;
      }

      // recalculate all values that must propogate to the next row
      for (let x = minCol + 1; x < maxCol; x++) {
        recalcMaps(
          x,
          y,
          energyMap,
          collectedMap,
          this.imageData,
          height,
          width
        );
      }
    }

    return this;
  }

  /**
   * Creates an individual seam from the active energy map
   */
  #createSeam(): number[] {
    // find lowest energy end-point
    const energyRows = this.collectedMap;
    const lastRow = energyRows[this.height - 1];
    const { stepSize, mergeSize, forceDiagonals, width } = this;
    let minEnergy = Infinity;
    let column = 0;

    // determine the column (group) with the lowest energy
    for (let i = 0, l = lastRow.length; i < l; i += mergeSize) {
      let energy = lastRow[i];
      for (let j = 1; j < mergeSize; j++) {
        energy += lastRow[i + j] || 0;
      }
      if (energy < minEnergy) {
        minEnergy = energy;
        column = i;
      }
    }

    // walk back up the column, creating the seam
    let seam = [column];
    for (let i = this.height - stepSize; i > -stepSize; i -= stepSize) {
      // account for the last step possibly going past the edge
      if (i < 0) {
        i = 0;
      }

      const energyRow = energyRows[i];
      let center = column;
      let left = column - 1;
      let right = column + 1;

      // if there is no data in the center row find the clowest row and call that the center, left taking precedence
      while (!energyRow[center]) {
        center = energyRow[left] ? left : right;
        left--;
        right++;
      }

      let nextSteps = [
        sumAdjoiningVals(energyRow, center, mergeSize, -1, width),
        forceDiagonals ? Infinity : 0,
        sumAdjoiningVals(energyRow, center, mergeSize, +1, width),
      ];

      for (let j = 0; j < mergeSize; j++) {
        // only calculate the straight values if not forceDiagonals
        forceDiagonals || (nextSteps[1] += energyRow[column + j]);
      }

      // compare left and right
      let dir =
        (nextSteps[0] || Infinity) < (nextSteps[2] || Infinity) ? -1 : 1;

      // if not using forceDiagonals, compare smaller of left/right to center
      if (!forceDiagonals) {
        dir =
          (nextSteps[1 + dir] || Infinity) < (nextSteps[1] || Infinity)
            ? dir
            : 0;
      }

      seam.push((column += dir * stepSize));
    }

    return seam.reverse();
  }

  /**
   * Generates seams for the given image.
   */
  async generateSeams(): Promise<void> {
    if (!this.imagePromise) {
      throw new Error('Must set an image before generating seams');
    }

    await this.imagePromise;

    this.energyMap = this.#generateEnergyMap();
    this.#computeLowestSeamEnergies();
    this.seams = this.#generateSeams();
  }

  #generateSeams(): seam[] {
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

  /**
   * Gets raw seam data.  Use this to pass on directly to a renderer bypassing the encode/decode steps.
   *
   * @param  {Boolean} allowSparse Set to allow the function to return stepped arrays
   * @return {Promise}
   * @return {Object}  return[0]
   * @return {Array}   return[0].seams
   * @return {Number}  return[0].step
   * @return {Boolean} return[0].vertical
   */
  getSeamData(allowSparse = false) {
    return this.generateSeams().then(() => {
      const seams =
        allowSparse || this.stepSize === 1
          ? this.seams
          : toDenseSeamArray(seams, this.stepSize);

      return {
        width: this.width,
        height: this.height,
        seams: seams,
        mergeSize: this.mergeSize,
        vertical: this.#isVertical(),
      };
    });
  }

  #setOptions(options: generatorOptions): void {
    this.#verifyOptions(options);
    Object.assign(this, options);
  }

  #verifyOptions(options: generatorOptions): void {
    const { stepSize, mergeSize, maxSeams } = options;

    this.#verifyStepSize(stepSize);
    this.#verifyMergeSize(mergeSize);
    this.#verifyMaxSeams(options, maxSeams);
  }

  #verifyStepSize(stepSize?: number): void {
    if (stepSize && (stepSize < 1 || stepSize > 15)) {
      throw new Error('stepSize must be in the range of 1..15');
    }
  }

  #verifyMergeSize(mergeSize?: number): void {
    if (mergeSize && (mergeSize < 1 || mergeSize > 4)) {
      throw new Error('mergeSize must be in the range of 1..4');
    }
  }

  #verifyMaxSeams(options: generatorOptions, maxSeams?: number): void {
    if (maxSeams && maxSeams === -1) {
      options.maxSeams = Infinity;
    }
  }

  #isVertical(): boolean {
    return this.direction === 'vertical';
  }

  async encode(): Promise<string> {
    const seamData = await this.getSeamData(true);

    return this.#encode(seamData);
  }

  #encode(seamData) {
    const bytes = [];
    const forceDiagonals = this.forceDiagonals;

    bytes.push(
      ...[].concat(
        (this.stepSize <<
          (4 + // <4 bits> step size
            ((this.mergeSize - 1) << 2) + // <2 bits> merge size
            (this.vertical ? 0 : 1))) <<
          (1 + // <1 bit>  vertical or horizontal
            (this.forceDiagonals ? 1 : 0)), // <1 bit>  forceDiagonals or not
        intEncode(this.width), // <varInt> width
        intEncode(this.height), // <varInt> height
        intEncode(this.numSeams) // <varInt> # of seams
      )
    );

    // converts all seams into a byte stream in the format:
    // [starting pixel number]
    // bits consiting of:
    //   forceDiagonals mode:
    //     0 = left  / down
    //     1 = right / up
    //   not forceDiagonals mode:
    //     0  = left  / down
    //     10 = straight
    //     11 = right / up
    seamData.seams.forEach(function (seam) {
      let bitNum = 7;
      let byte = 0;

      bytes.push.apply(bytes, intEncode(seam[0]));

      for (let i = 1, l = seam.length; i < l; i++) {
        const val = seam[i];
        const prev = seam[i - 1];

        if (forceDiagonals && val === prev) {
          throw new Error(
            'Error encoding seam -- unexpected straight seam detected'
          );
        }

        const bits =
          val < prev
            ? [0] // there are only 3 possible values, so we can always encode one with a single bit
            : val > prev
            ? forceDiagonals
              ? [1]
              : [1, 0]
            : forceDiagonals
            ? null
            : [1, 1];

        for (let j = 0; j < bits.length; j++) {
          bits[j] && (byte |= 1 << bitNum);

          if (bitNum) {
            bitNum--;
          } else {
            bytes.push(byte);
            bitNum = 7;
            byte = 0;
          }
        }
      }

      // push whatever is left over
      if (bitNum < 7) {
        bytes.push(byte);
      }
    });

    return bytes.map((b) => String.fromCharCode(b)).join('');
  }
}

export default Generator;
