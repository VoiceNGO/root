import { getTwoDotExtension } from 'node-utils/fs';
import { copy, styl, ts } from './file-builders/index.js';
export default async function buildFile(srcPath) {
    const extension = getTwoDotExtension(srcPath);
    const builder = {
        'd.ts': copy,
        styl: styl,
        ts: ts,
        tsx: ts,
    }[extension];
    if (!builder) {
        throw new Error(`No builder available for file extension "${extension}"`);
    }
    builder.buildFile(srcPath);
}
