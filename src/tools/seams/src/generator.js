import Generator from './generator-single';
import getImageData from './get-image-data';

/**
 * Spawns 1 or 2 instances of a the Generator class to create horizontal and/or vertical seams
 */
class MultiGenerator {
  constructor(imgSrc) {
    this.loadImage(imgSrc).setDirection();

    this.generators = {
      vertical: new Generator(this.imgPromise),
      horizontal: new Generator(this.imgPromise).setDirection('horizontal'),
    };
  }

  /**
   * @private
   * @chainable
   */
  loadImage(src) {
    if (this.imgSrc === src) {
      return this;
    }

    this.imgPromise = getImageData(src);

    return this;
  }

  /**
   * Sets direction of seams to generate
   *
   * @param {String} [direction='vertical'] vertical|horizontal|both
   * @chainable
   */
  setDirection(direction = 'vertical') {
    if (!~' vertical horizontal both '.indexOf(` ${direction} `)) {
      console.error(`${direction} is not a valid seam direction`);
    }

    this.direction = direction === 'both' ? ['vertical', 'horizontal'] : [direction];

    return this;
  }

  /**
   * @private
   */
  getAllSeamData() {
    return Promise.all(this.direction.map(dir => this.generators[dir].getSeamData()));
  }

  /**
   * Returns a promise that resolves with horizontal and/or vertical seam data depending on what was previously set via
   *   `.setDirection()`
   *
   * @return {[type]} [description]
   */
  getSeamData() {
    return this.getAllSeamData().then(
      function(results) {
        let outData = {};

        this.direction.forEach((dir, ix) => (outData[dir] = results[ix]));

        return outData;
      }.bind(this),
    );
  }

  /**
   * @private
   */
  getAllEncodedData() {
    return Promise.all(this.direction.map(dir => this.generators[dir].encode()));
  }

  /**
   * Returns the encoded seams
   *
   * @return {Promise}
   * @return {String} return[0]
   */
  encode() {
    return this.getAllEncodedData().then(function(results) {
      return results.join('');
    });
  }
}

['setCompression', 'setSpacing', 'setMerging', 'setMaxSeams', 'setPercentage'].forEach(method => {
  MultiGenerator.prototype[method] = function() {
    ['vertical', 'horizontal'].forEach(dir => this.generators[dir][method].apply(this.generators[dir], arguments));

    return this;
  };
});

module.exports = MultiGenerator;
