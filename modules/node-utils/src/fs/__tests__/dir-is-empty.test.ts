import { unlink } from 'fs/promises';
import { mkdirp } from '..';
import dirIsEmpty from '../dir-is-empty';
import { resolve } from 'path';

const nonEmptyDir = __dirname as absolutePath;
const emptyDir = resolve(__dirname, '__dir-is-empty-test__');

afterAll(async () => {
  try {
    await unlink(emptyDir);
  } catch {}
});

test('Empty directory', async () => {
  await mkdirp(emptyDir as absolutePath);
  expect(await dirIsEmpty(emptyDir)).toBe(true);
});

test('Non-empty directory', async () => {
  expect(await dirIsEmpty(nonEmptyDir)).toBe(false);
});

test('relative path', () => {
  expect(dirIsEmpty('./foo' as absolutePath)).rejects.toThrow();
});
