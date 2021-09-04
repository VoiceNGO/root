/* eslint no-console: "off" */

import Generator from './generator-single';
import getImageData, { imageData } from './get-image-data';

type seamDirection = 'horizontal' | 'vertical';

/**
 * Spawns 1 or 2 instances of a the Generator class to create horizontal and/or vertical seams
 */
class MultiGenerator {
  imgPromise!: Promise<imageData>;
  generators: { vertical: Generator; horizontal: Generator };
  direction!: seamDirection[];
  imgSrc!: string;

  constructor(imgSrc: string) {
    this.#loadImage(imgSrc).setDirection();

    this.generators = {
      vertical: new Generator(this.imgPromise),
      horizontal: new Generator(this.imgPromise).setDirection('horizontal'),
    };
  }

  #loadImage(src: string) {
    if (this.imgSrc === src) {
      return this;
    }

    this.imgPromise = getImageData(src);

    return this;
  }

  /**
   * Sets direction of seams to generate
   */
  setDirection(direction: seamDirection | 'both' = 'vertical') {
    if (' vertical horizontal both '.indexOf(` ${direction} `) === -1) {
      console.error(`${direction} is not a valid seam direction`);
    }

    this.direction =
      direction === 'both' ? ['vertical', 'horizontal'] : [direction];

    return this;
  }

  #getAllSeamData() {
    return Promise.all(
      this.direction.map((dir) => this.generators[dir].getSeamData())
    );
  }

  /**
   * Returns a promise that resolves with horizontal and/or vertical seam data depending on what was previously set via
   *   `.setDirection()`
   */
  async getSeamData() {
    const seamData = await this.#getAllSeamData();
    const mappedSeamData = this.direction.map((dir, ix) => seamData[ix]);

    return mappedSeamData;
  }

  #getAllEncodedData() {
    return Promise.all(
      this.direction.map((dir) => this.generators[dir].encode())
    );
  }

  async encode(): Promise<string> {
    const encodedData = await this.#getAllEncodedData();
    return encodedData.join('');
  }

  getGeneratorsArray(): Generator[] {
    return Object.values(this.generators);
  }

  setCompression(...args: Parameters<Generator['setCompression']>): this {
    this.getGeneratorsArray().forEach((generator) =>
      generator.setCompression(...args)
    );

    return this;
  }

  setSpacing(...args: Parameters<Generator['setSpacing']>): this {
    this.getGeneratorsArray().forEach((generator) =>
      generator.setSpacing(...args)
    );

    return this;
  }

  setMerging(...args: Parameters<Generator['setMerging']>): this {
    this.getGeneratorsArray().forEach((generator) =>
      generator.setMerging(...args)
    );

    return this;
  }

  setMaxSeams(...args: Parameters<Generator['setMaxSeams']>): this {
    this.getGeneratorsArray().forEach((generator) =>
      generator.setMaxSeams(...args)
    );

    return this;
  }

  setPercentage(...args: Parameters<Generator['setPercentage']>): this {
    this.getGeneratorsArray().forEach((generator) =>
      generator.setPercentage(...args)
    );

    return this;
  }
}

module.exports = MultiGenerator;
