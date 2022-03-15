export function toFileName<T extends string>(fileName: T): fileName & T {
  if (/\//.test(fileName)) {
    throw new Error(`/ detected in filename ${fileName}`);
  }
  if (fileName === '') {
    throw new Error('filename must not be empty');
  }

  return fileName as any;
}
