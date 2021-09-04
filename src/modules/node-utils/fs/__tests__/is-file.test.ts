import expect from 'expect';
import { resolve } from 'path';
import isFile from '../is-file';

const filePath = __filename;
const dirPath = __dirname;
const linkPath = resolve('is-symbolic-link.link');

test('File', async () => {
  expect(await isFile(filePath)).toBe(true);
});

test('Directory', async () => {
  expect(await isFile(dirPath)).toBe(false);
});

test('Symlink', async () => {
  expect(await isFile(linkPath)).toBe(false);
});

test('relative path', () => {
  expect(isFile('./foo' as absolutePath)).rejects.toThrow();
});
