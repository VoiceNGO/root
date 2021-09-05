import tilde from 'expand-tilde';
import { resolve } from 'path';

// eslint-disable-next-line
__dirname = __dirname || process.cwd();

export default function pathResolve(src: string): string {
  const expandedSrc = tilde(src);

  return expandedSrc[0] === '/' ? expandedSrc : resolve(expandedSrc);
}
