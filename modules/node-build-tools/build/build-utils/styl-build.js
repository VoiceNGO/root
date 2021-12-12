import { parse } from 'path';
import srcToBuildPath from './src-to-build-path';
export default function serviceBuild(srcPath) { }
export function getBuildFiles(srcPath) {
    const buildPath = srcToBuildPath(srcPath);
    const parsedBuildPath = parse(buildPath);
    const cssBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}.css`;
    return [cssBuildPath];
}
