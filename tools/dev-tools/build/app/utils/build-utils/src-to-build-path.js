import { replaceLastOccurrence } from '../../../../../../modules/js-utils/build/string.js';
const srcFolder = 'src';
const buildFolder = 'build';
export default function srcToBuildPath(srcPath) {
  return replaceLastOccurrence(srcPath, `/${srcFolder}/`, `/${buildFolder}/`);
}
