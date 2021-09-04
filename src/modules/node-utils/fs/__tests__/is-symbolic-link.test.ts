import { resolve } from 'path';
import expect from 'expect';
import isSymbolicLink from '../is-symbolic-link';

const filePath = __filename;
const dirPath = __dirname;
const linkPath = resolve(__dirname, './is-symbolic-link.link');

test('File', async () => {
  expect(await isSymbolicLink(filePath)).toBe(false);
});

test('Directory', async () => {
  expect(await isSymbolicLink(dirPath)).toBe(false);
});

test('Symlink', async () => {
  expect(await isSymbolicLink(linkPath)).toBe(true);
});

test('relative path', () => {
  expect(isSymbolicLink('./foo' as absolutePath)).rejects.toThrow();
});
