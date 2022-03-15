import getTwoDotExtension from '../get-two-dot-extension';

const extensionsToTest = [
  ['file.ts', 'ts'],
  ['/path/to/file.ts', 'ts'],
  ['file.d.ts', 'd.ts'],
  ['/path/to/file.d.ts', 'd.ts'],
  ['file.abcdefg.hijklm', 'hijklm'],
  ['file', ''],
  ['/path/to/file', ''],
  ['/path.to/file', ''],
  ['', ''],
] as [fileNameOrPath, string][];

describe('file extensions', () => {
  test.each(extensionsToTest)('fn(%s) = %s', (filePath, extension) => {
    expect(getTwoDotExtension(filePath)).toBe(extension);
  });
});
