import { unlink } from 'fs/promises';
import path from 'path';
import expect from 'expect';
import mkdirp from '../mkdirp';
import exists from '../exists';

const TEST_DIR = '__mkdirp-test__';

async function removeTestDir() {
  try {
    await unlink(TEST_DIR);
  } catch {}
}

beforeEach(removeTestDir);
afterAll(removeTestDir);

test('creates nested directories from absolute path', async () => {
  const dirPath = path.resolve(TEST_DIR, 'foo', 'bar', 'baz');
  await mkdirp(dirPath);
  expect(await exists(dirPath)).toBe(true);
});

test('relative path', () => {
  expect(mkdirp('./foo' as absolutePath)).rejects.toThrow();
});
