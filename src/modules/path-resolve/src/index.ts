import tilde from 'expand-tilde';
import { resolve } from 'path';
__dirname = __dirname || process.cwd();

export default function pathResolve(src: string) {
  const expandedSrc = tilde(src);
  return expandedSrc[0] === '/' ? expandedSrc : resolve(expandedSrc);
}
