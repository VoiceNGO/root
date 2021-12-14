import srcToBuildPath from '../src-to-build-path.js';

test('replaces src with build', () => {
  // @ts-ignore
  expect(srcToBuildPath('/foo/src/bar')).toBe('/foo/build/bar');
});
