// @flow

import { array as intEncode } from 'vle-integers/encode';
import matrices from './matrices';
import timer from 'timer-decorator';

/**
 * converts a stepped "sparse" array into a dense one, e.g.:
 *   [1, 3, 5, 3] -> [1, 2, 3, 4, 5, 4, 3]
 */
function toDenseArray(seams: Array<number>, stepSize: number): Array<number> {
  return seams.map(seam =>
    [].concat.apply(
      [],
      seam.map((val, ix, ary) =>
        Array.apply(0, Array(ix < ary.length - 1 ? stepSize : 1)).map(
          (a, aIx) => val + (val < ary[ix + 1] ? 1 : -1) * aIx,
        ),
      ),
    ),
  );
}

function sumAdjoiningVals(ary, aryIndex, count, direction, aryLength) {
  let ttl = 0;

  for (let i = aryIndex + direction; i >= 0 && i < aryLength; i += direction) {
    if (ary[i]) {
      ttl += ary[i];
      count--;

      if (!count) {
        return ttl;
      }
    }
  }

  return ttl;
}

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

function rightIsCloser(left, center, right) {
  return left - center - center - right < 0;
}

function pxEnergy(pxData, cols, x, y) {
  const ix = (y * cols + x) * 4;
  return (pxData[ix] + pxData[ix + 1] + pxData[ix + 2]) * pxData[ix + 3];
}

function recomputeEnergyAtPixel(x, y, energyMap, pxData, rows, cols) {
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
    row = pxData[y - 1];

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

class Generator {
  /**
   * Creates a seam generator
   *
   * @param  {String} imgSrc path to image
   * @constructor
   */
  constructor(imgPromise) {
    this.imgPromise = imgPromise.then(img => {
      this.image = img;
      this.data = img.data;
    });

    // set defaults
    this.setCompression(false)
      .setSpacing()
      .setMerging()
      .setDirection()
      .setPercentage();
  }

  /**
   * Rotates the image by 90 degrees for when we want to compute horizontal seams.  This simplifies all of the
   *   algorithms because we're now only working with seemingly horizontal seams :)
   *
   * @private
   * @chainable
   */
  setRotation() {
    return this.imgPromise.then(
      function() {
        if (this.direction === 'vertical') {
          this.width = this.image.width;
          this.height = this.image.height;
        } else {
          this.height = this.image.width;
          this.width = this.image.height;
        }
      }.bind(this),
    );
  }

  /**
   * @private
   */
  @timer
  generateEnergyMap() {
    // woo-hoo, nothing to do!
    if (!this.dirty) {
      return Promise.resolve();
    }

    const cols = this.width;
    const rows = this.height;
    const pxData = this.data;
    const energyMap = (this.energyMap = new Array(rows));

    function energyAtPixel(x, y, pxData, rows, cols) {
      const up = y;
      const down = y < rows - 1;
      const left = x;
      const right = x < cols - 1;
      let tmp;

      let xSum = 0;
      let ySum = 0;

      left &&
        ((xSum += -2 * pxEnergy(pxData, cols, x - 1, y)),
        up && ((xSum += tmp = -1 * pxEnergy(pxData, cols, x - 1, y - 1)), (ySum += tmp)),
        down && ((xSum += -1 * (tmp = pxEnergy(pxData, cols, x - 1, y + 1))), (ySum += tmp)));

      right &&
        ((xSum += 2 * pxEnergy(pxData, cols, x + 1, y)),
        up && ((xSum += tmp = pxEnergy(pxData, cols, x + 1, y - 1)), (ySum += -1 * tmp)),
        down && ((xSum += tmp = pxEnergy(pxData, cols, x + 1, y + 1)), (ySum += tmp)));

      up && (ySum += -2 * pxEnergy(pxData, cols, x, y - 1));
      down && (ySum += +2 * pxEnergy(pxData, cols, x, y + 1));

      // don't allow zero values because we take some shortcuts and assume that falsey values are undefined
      return Math.sqrt(xSum * xSum + ySum * ySum) || 1e-10;
    }

    return this.imgPromise.then(function() {
      for (let y = 0; y < rows; y++) {
        energyMap[y] = new Array(cols);

        for (let x = 0; x < cols; x++) {
          energyMap[y][x] = energyAtPixel(x, y, pxData, rows, cols);
        }
      }
    });
  }

  /**
   * Computes the energy at a given pixel, taking into account that the neighboring pixels might be NaN
   *
   * @private
   */
  // computeEnergyAtPixel(x, y) {
  //   return this.gradientMagnitude(x, y);
  // }

  /**
   * Gets the cumulative (R+G+B) * A energy at a pixel normalized to 0..1
   *
   * @private
   */
  getPixelSubEnergy(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 0;
    }

    const ix = (y * this.width + x) * 4;

    return (this.data[ix + 0] + this.data[ix + 1] + this.data[ix + 2]) * this.data[ix + 3] / 255 / 255 / 3;
  }

  /**
   * Computes the gradient magnitude energy at a given pixel
   *
   * Gx = [-1 0 +1]  Gy = [-1 -2 -1]
   *      [-2 0 +2]       [ 0  0  0]
   *      [-1 0 +1]       [+1 +2 +1]
   *
   * G = sqrt(Gx^2 + Gy^2)
   *
   * @private
   */
  gradientMagnitude(x, y) {
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
      let mapRow = this.energyMap[y + row];

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

      xSum +=
        (!(tmp = matrixX[row + 1][0]) ? 0 : tmp * this.getPixelSubEnergy(left, y + row)) +
        (!(tmp = matrixX[row + 1][1]) ? 0 : tmp * this.getPixelSubEnergy(center, y + row)) +
        (!(tmp = matrixX[row + 1][2]) ? 0 : tmp * this.getPixelSubEnergy(right, y + row));

      ySum +=
        (!(tmp = matrixY[row + 1][0]) ? 0 : tmp * this.getPixelSubEnergy(left, y + row)) +
        (!(tmp = matrixY[row + 1][1]) ? 0 : tmp * this.getPixelSubEnergy(center, y + row)) +
        (!(tmp = matrixY[row + 1][2]) ? 0 : tmp * this.getPixelSubEnergy(right, y + row));
    }

    return Math.sqrt(xSum * xSum + ySum * ySum);
  }

  /**
   * Computes the collected energy at a given pixel, taking into account that relevant pixels might be NaN
   *
   * @private
   */
  computeCollectedEnergyAtPixel(x, y) {
    // if the pixel was removed from the energy map, ignore it
    if (!this.energyMap[y][x]) {
      return NaN;
    }

    if (!y) {
      return this.energyMap[y][x];
    }

    const energyRow = this.energyMap[y];
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
        left++;
      }
    }

    let leftVal = sumAdjoiningVals(energyRow, left, 1, -1, cols);
    let rightVal = sumAdjoiningVals(energyRow, right, 1, +1, cols);

    return this.energyMap[y][x] + Math.min(leftVal || Infinity, energyRow[center] || Infinity, rightVal || Infinity);
  }

  /**
   * Computes the cumulative energy at each pixel top-down
   *
   * @private
   */
  @timer
  computeLowestSeamEnergies() {
    const energy = this.energyMap;
    const collected = (this.collectedMap = [this.energyMap[0].slice()]);
    const cols = this.width;
    const rows = this.height;

    for (let y = 1; y < rows; y++) {
      let row = new Array(cols);

      for (let x = 0; x < cols; x++) {
        let prevRow = collected[y - 1];
        let min = prevRow[x + (x ? (prevRow[x - 1] < (prevRow[x + 1] || Infinity) ? -1 : 1) : 1)];

        if (!this.compressed && prevRow[x] < min) {
          min = prevRow[x];
        }

        row[x] = energy[y][x] + min;
      }

      collected[y] = row;
    }

    return this;
  }

  /**
   * Recalculates both the energy map and collected energy at a given pixel
   *
   * @param  {Number} x x
   * @param  {Number} y y
   * @return {Boolean} true if data at pixel changed
   */
  recalcMapAt(x, y) {
    const energyAtPixel = this.computeEnergyAtPixel(x, y);
    this.energyMap[y][x] = energyAtPixel;

    let collectedAtPixel = this.computeCollectedEnergyAtPixel(y, x);

    return energyAtPixel === this.energyMap[y][x] && collectedAtPixel === this.collectedMap[y][x];
  }

  /**
   * Removes a seam from the energy map and lowest computed energies by re-calculating only the pieces of the energy and
   *   seam maps that are directly affected by the seam.
   *
   * @private
   * @chainable
   */
  // @timer
  removeSeamFromEnergy(seam) {
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
      let energyChanged = recomputeEnergyAtPixel(x, y, energyMap, pxData, rows, cols);
      let collectedChanged = recomputeCollectedAtPixel(x, y);

      return energyChanged || collectedChanged;
    }

    // re-calculate the affected areas of the maps around the seam
    for (let y = 0; y < this.height; y++) {
      let seamL = seam[y];
      let seamR = Math.min(width - 1, seam[y] + mergeSize - 1);
      let lastRow = y === this.height - 1;

      minCol = Math.max(0, Math.min(minCol - 1, seamL - 1, lastRow ? Infinity : seam[y + 1] - mergeSize));
      maxCol = Math.min(width, Math.max(maxCol + 1, seamR + 1, lastRow ? 0 : seam[y + 1] + mergeSize));

      // for each value at the left or right edges that hasn't changed, narrow the range
      try {
        while (minCol < seamL && !recalcMaps(minCol, y, energyMap, collectedMap, this.data, height, width)) {
          minCol++;
        }
        while (maxCol > seamR && !recalcMaps(maxCol, y, energyMap, collectedMap, this.data, height, width)) {
          maxCol--;
        }
      } catch (err) {
        throw err;
      }

      // recalculate all values that must propogate to the next row
      for (let x = minCol + 1; x < maxCol; x++) {
        recalcMaps(x, y, energyMap, collectedMap, this.data, height, width);
      }
    }

    return this;
  }

  /**
   * Creates an individual seam from the active energy map
   *
   * @private
   * @return {Array} seam
   */
  createSeam(debug) {
    // find lowest energy end-point
    const energyRows = this.collectedMap;
    const lastRow = energyRows[this.height - 1];
    const stepSize = this.stepSize;
    const mergeSize = this.mergeSize;
    const compressed = this.compressed;
    const width = this.width;
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
        compressed ? Infinity : 0,
        sumAdjoiningVals(energyRow, center, mergeSize, +1, width),
      ];

      for (let j = 0; j < mergeSize; j++) {
        // only calculate the straight values if not compressed
        compressed || (nextSteps[1] += energyRow[column + j]);
      }

      // compare left and right
      let dir = (nextSteps[0] || Infinity) < (nextSteps[2] || Infinity) ? -1 : 1;

      // if not compressed, compare smaller of left/right to center
      if (!compressed) {
        dir = (nextSteps[1 + dir] || Infinity) < (nextSteps[1] || Infinity) ? dir : 0;
      }

      seam.push((column += dir * stepSize));
    }

    return seam.reverse();
  }

  /**
   * Generates seams for the given image.
   *
   * @return {Promise}
   */
  generateSeams() {
    // woo-hoo, nothing to do!
    if (!this.dirty) {
      return Promise.resolve(this);
    }
    if (!this.imgPromise) {
      throw new Error('Must set an image before generating seams');
    }

    return this.imgPromise
      .then(::this.setRotation)
      .then(::this.generateEnergyMap)
      .then(::this.computeLowestSeamEnergies)
      .then(::this.__generateSeams);
  }

  /**
   * @private
   */
  @timer
  __generateSeams() {
    const numSeams = Math.ceil(Math.min(this.seamLimit, this.width / this.stepSize * this.percentSeams));
    const seams = new Array(numSeams);

    for (let i = 0; i < numSeams; i++) {
      let seam = this.createSeam();
      seams[i] = seam;
      console.log(i, numSeams);
      // console.log(seam.join(' '));
      this.removeSeamFromEnergy(seam);
    }

    this.seams = seams;
    this.dirty = false;
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
  getSeamData(allowSparse) {
    return this.generateSeams().then(() => {
      const seams = allowSparse || this.stepSize === 1 ? this.seams : toDenseArray(seams, this.stepSize);

      return {
        width: this.width,
        height: this.height,
        seams: seams,
        mergeSize: this.mergeSize,
        vertical: this.isVertical(),
      };
    });
  }

  /**
   * Improves seam compression by disabling "straight" sections of a seam, meaning that a seam _must_ move diagonally
   *   at every pixel.  This generally doesn't create a noticeable visual difference.  Makes seams 40% smaller.
   *
   * @param {Bool} [enabled=true] Enables compression
   * @chainable
   */
  setCompression(enabled) {
    this.setDirty(this.compressed !== enabled);
    this.compressed = enabled;

    return this;
  }

  //

  /**
   * Skips every Nth pixel along the seam allowing for significantly smaller, but less accurate seams.
   *
   * @param {Number} [level=1] Skip every Nth pixel, must be in the range of 1..15
   * @chainable
   */
  setSpacing(level = 1) {
    if (level < 1 || level > 15) {
      throw new Error('setSpacing only accepts levels in the range of 1..15');
    }

    level = Math.round(level);

    this.setDirty(this.stepSize !== level);
    this.stepSize = level;

    return this;
  }

  /**
   * Remove N neighboring pixels from each seam instead of 1.  Allows for significantly smaller, but less accurate seams
   *   (this can be significantly more noticeable than the effect of `setSpacing`)
   * @param {[type]} level = 1 [description]
   */
  setMerging(level = 1) {
    if (level < 1 || level > 4) {
      throw new Error('setMerging only accepts levels in the range of 1..4');
    }

    level = Math.round(level);

    this.setDirty(this.mergeSize !== level);
    this.mergeSize = level;

    return this;
  }

  /**
   * Sets the direction of the seams to generate.  Default is 'vertical'
   *
   * @param {String} [dir='vertical'] 'vertical' or 'horizontal'
   * @chainable
   */
  setDirection(dir = 'vertical') {
    this.setDirty(this.direction !== dir);
    this.direction = dir;

    return this;
  }

  /**
   * Sets a limit on the maximum number of seams to create
   *
   * @param {Number} [limit=Infinity] Maximum number of seams
   * @chainable
   */
  setMaxSeams(limit = Infinity) {
    this.setDirty(this.seamLimit !== limit);
    this.seamLimit = limit;

    return this;
  }

  /**
   * Generate this % of seams, default = 100.  e.g with a value of `50`, a 1024x768 image could be scaled down to 512px
   *   wide.
   *
   * @param {[type]} [percent=100] [description]
   */
  setPercentage(percent = 100) {
    percent /= 100;

    this.setDirty(this.percentSeams !== percent);
    this.percentSeams = percent;

    return this;
  }

  /**
   * @private
   */
  isVertical() {
    return this.direction === 'vertical';
  }

  /**
   * @private
   * @chainable
   */
  setDirty(dirty = true) {
    if (dirty) {
      this.dirty = true;
    }

    return this;
  }

  /**
   * Returns the encoded seams
   *
   * @return {Promise}
   * @return {String} return[0]
   */
  encode() {
    return this.getSeamData(true).then(::this.__encode);
  }

  /**
   * @private
   */
  @timer
  __encode(seamData) {
    const bytes = [];
    const compressed = this.compressed;

    bytes.push.apply(
      bytes,
      [].concat(
        // flattens the following data
        (this.stepSize <<
          (4 + // <4 bits> step size
          ((this.mergeSize - 1) << 2) + // <2 bits> merge size
            (this.vertical ? 0 : 1))) <<
          (1 + // <1 bit>  vertical or horizontal
            (this.compressed ? 1 : 0)), // <1 bit>  compressed or not
        intEncode(this.width), // <varInt> width
        intEncode(this.height), // <varInt> height
        intEncode(this.numSeams), // <varInt> # of seams
      ),
    );

    // converts all seams into a byte stream in the format:
    // [starting pixel number]
    // bits consiting of:
    //   compressed mode:
    //     0 = left  / down
    //     1 = right / up
    //   uncompressed mode:
    //     0  = left  / down
    //     10 = straight
    //     11 = right / up
    seamData.seams.forEach(function(seam) {
      let bitNum = 7;
      let byte = 0;

      bytes.push.apply(bytes, intEncode(seam[0]));

      for (let i = 1, l = seam.length; i < l; i++) {
        const val = seam[i];
        const prev = seam[i - 1];

        if (compressed && val === prev) {
          throw new Error('Error encoding seam -- unexpected straight seam detected');
        }

        let bits =
          val < prev
            ? [0] // there are only 3 possible values, so we can always encode one with a single bit
            : val > prev ? (compressed ? [1] : [1, 0]) : compressed ? null : [1, 1];

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

    return bytes.map(b => String.fromCharCode(b)).join('');
  }
}

module.exports = Generator;
