import expect from 'expect';
import pathToFolderNameArray from '../path-to-folder-name-array';

test('relative path', () => {
  expect(pathToFolderNameArray('foo/bar/baz' as relativePath)).toEqual([
    'foo',
    'bar',
    'baz',
  ]);
});

test('absolute path', () => {
  expect(pathToFolderNameArray('/foo/bar/baz' as absolutePath)).toEqual([
    'foo',
    'bar',
    'baz',
  ]);
});
