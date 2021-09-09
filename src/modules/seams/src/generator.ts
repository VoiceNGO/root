import Generator, { generatorOptions } from './generator-single';
import getImageData, { imageData } from './get-image-data';

type seamDirection = 'horizontal' | 'vertical' | 'both';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const BOTH = 'both';

/**
 * Spawns 1 or 2 instances of a the Generator class to create horizontal and/or vertical seams
 */
export default class MultiGenerator {
  imgPromise!: Promise<imageData>;
  generators: Generator[] = [];
  imgSrc!: string;

  constructor(
    imgSrc: string,
    options: Omit<generatorOptions, 'direction'> & {
      direction?: seamDirection;
    } = {}
  ) {
    const imgPromise = getImageData(imgSrc);

    const direction = options.direction || VERTICAL;
    if (direction === VERTICAL || direction === BOTH) {
      this.generators.push(
        new Generator(imgPromise, { ...options, direction: VERTICAL })
      );
    }

    if (direction === HORIZONTAL || direction === BOTH) {
      this.generators.push(
        new Generator(imgPromise, { ...options, direction: HORIZONTAL })
      );
    }
  }

  #getAllEncodedData(): Promise<string[]> {
    return Promise.all(this.generators.map((generator) => generator.encode()));
  }

  async encode(): Promise<string> {
    const encodedData = await this.#getAllEncodedData();

    return encodedData.join('\n');
  }
}
