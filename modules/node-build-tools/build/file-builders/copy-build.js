import { readFile } from 'fs/promises';
import srcToBuildPath from '../build-utils/src-to-build-path';
export async function buildFile(srcPath) {
    const buildPath = (await getBuildFiles(srcPath))[0];
    const fileContents = await readFile(srcPath);
    return { [buildPath]: fileContents };
}
export async function getBuildFiles(srcPath) {
    const buildPath = srcToBuildPath(srcPath);
    return [buildPath];
}
