import { resolve } from 'path';
import expect from 'expect';
// import Generator from '../generator';

describe('Encoding', () => {
  test.skip('Should not throw errors (stupid test to help with debugging)', () => {
    new Generator(resolve(__dirname, '/1.jpg')).encode();
  });
});
