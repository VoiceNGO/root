import expect from 'expect';
import { resolve } from 'path';
import isDirectory from '../is-directory';

const filePath = __filename as absolutePath;
const dirPath = __dirname as absolutePath;
const linkPath = resolve('./is-symbolic-link.link');

test('File', async () => {
  expect(await isDirectory(filePath)).toBe(false);
});

test('Directory', async () => {
  expect(await isDirectory(dirPath)).toBe(true);
});

test('Symlink', async () => {
  expect(await isDirectory(linkPath)).toBe(false);
});

test('relative path', () => {
  expect(isDirectory('./foo' as absolutePath)).rejects.toThrow();
});
