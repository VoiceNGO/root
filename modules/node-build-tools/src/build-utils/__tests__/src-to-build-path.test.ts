import srcToBuildPath from '../src-to-build-path';

test('replaces src with build', () => {
  // @ts-ignore
  expect(srcToBuildPath('/foo/src/bar')).toBe('/foo/build/bar');
});

test('only replaces last src with build', () => {
  // @ts-ignore
  expect(srcToBuildPath('/foo/src/bar/src/baz')).toBe('/foo/src/bar/build/baz');
});
