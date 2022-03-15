import { join, resolve } from 'path';
import exists from '../exists';

const fileName = __filename as fileName;
const dirPath = __dirname as absoluteDirPath;
const filePath = join(dirPath, fileName);
const invalidFilePath = resolve('does.not.exist');

test('file that exists', async () => {
  expect(await exists(filePath)).toBe(true);
});

test('directory that exists', async () => {
  expect(await exists(dirPath)).toBe(true);
});

test('file that does not exist', async () => {
  expect(await exists(invalidFilePath)).toBe(false);
});

test('relative path', () => {
  expect(exists('./foo' as absolutePath)).rejects.toThrow();
});
