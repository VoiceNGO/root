import { parse } from 'path';
import srcToBuildPath from '../build-utils/src-to-build-path';
export async function buildFile(srcPath) { }
export async function getBuildFiles(srcPath) {
    const buildPath = srcToBuildPath(srcPath);
    const parsedBuildPath = parse(buildPath);
    const cssBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}.css`;
    return [cssBuildPath];
}
