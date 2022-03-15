import { join, resolve } from 'path';
import isFile from '../is-file';

const fileName = __filename as fileName;
const dirPath = __dirname as absoluteDirPath;
const filePath = join(dirPath, fileName);
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
