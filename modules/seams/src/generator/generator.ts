import Generator, { generatorOptions } from './generator-single';
import getImageData from '../utils/get-image-data';
import {
  BOTH,
  HORIZONTAL,
  tSeamDirectionWithBoth,
  tPixelPriorityMaps,
  VERTICAL,
} from '../utils/seam-definition';

/**
 * Spawns 1 or 2 instances of a the Generator class to create horizontal and/or vertical seams
 */
export default class MultiGenerator {
  #imgPromise: Promise<ImageData>;
  #generators: Generator[] = [];

  constructor(
    imgSrc: string,
    options: Omit<generatorOptions, 'direction'> & {
      direction?: tSeamDirectionWithBoth;
    } = {}
  ) {
    this.#imgPromise = getImageData(imgSrc);

    const direction = options.direction || VERTICAL;
    const useVertical = direction === VERTICAL || direction === BOTH;
    const useHorizontal = direction === HORIZONTAL || direction === BOTH;

    this.#imgPromise.then((imageData) => {
      if (useVertical) {
        this.#generators.push(
          new Generator(imageData, { ...options, direction: VERTICAL })
        );
      }

      if (useHorizontal) {
        this.#generators.push(
          new Generator(imageData, { ...options, direction: HORIZONTAL })
        );
      }
    });
  }

  async getEncodedSeams(): Promise<string> {
    await this.#imgPromise;

    const encodedSeams = this.#generators.map((generator) =>
      generator.getEncodedSeamData()
    );

    return encodedSeams.join('');
  }

  async getPixelPriorityMaps(): Promise<tPixelPriorityMaps> {
    await this.#imgPromise;

    const pxPriorityMaps: tPixelPriorityMaps = {};

    this.#generators.forEach((generator) => {
      pxPriorityMaps[generator.direction] = generator.getPixelPrirityMap();
    });

    return pxPriorityMaps;
  }
}
