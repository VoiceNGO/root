import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

export function dirname(importMeta: ImportMeta) {
  return pathDirname(filename(importMeta));
}

export function filename(importMeta: ImportMeta) {
  return importMeta.url ? fileURLToPath(importMeta.url) : '';
}
