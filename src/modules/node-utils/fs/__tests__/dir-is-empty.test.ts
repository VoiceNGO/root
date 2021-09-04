import { unlink } from 'fs/promises';
import expect from 'expect';
import { mkdirp } from '..';
import dirIsEmpty from '../dir-is-empty';
import { resolve } from 'path';

const emptyDir = resolve('__dir-is-empty-test__');
const nonEmptyDir = __dirname;

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
