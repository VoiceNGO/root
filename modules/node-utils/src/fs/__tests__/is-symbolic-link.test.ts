import { join, resolve } from 'path';
import isSymbolicLink from '../is-symbolic-link';

const fileName = __filename as fileName;
const dirPath = __dirname as absoluteDirPath;
const filePath = join(dirPath, fileName);
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
