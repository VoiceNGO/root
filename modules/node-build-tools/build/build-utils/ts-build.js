import { readFile } from 'fs/promises';
import { parse } from 'path';
import * as ts from 'typescript';
import srcToBuildPath from './src-to-build-path';
export default async function tsBuild(srcPath, options = {}) {
    const fileContents = await readFile(srcPath);
    const transpiled = ts.transpileModule(fileContents.toString(), {
        compilerOptions: options,
    });
    console.log({ transpiled });
}
export function getBuildFiles(srcPath, type = 'all') {
    const buildPath = srcToBuildPath(srcPath);
    const parsedBuildPath = parse(buildPath);
    const rootBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}`;
    const jsBuildPath = `${rootBuildPath}.js`;
    const mapBuildPath = `${rootBuildPath}.js`;
    switch (type) {
        case 'js':
            return [jsBuildPath];
        case 'map':
            return [mapBuildPath];
        case 'all':
            return [jsBuildPath, mapBuildPath];
    }
}
