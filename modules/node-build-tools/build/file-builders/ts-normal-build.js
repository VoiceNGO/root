"use strict";
/*
TODO:

Currently this builds many more files than we need to as the createCompilerHost/createProgram/program.emit method of
building a file builds every imported file along with it.  Figure out how to build just the one file.

We can just build the one file by using:

ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }});

But I can't figure out how to generate the .d.ts file other than by building everything.  This might be possible with
an incremental watcher, but then we'd have two watchers in a race condition since this file is called from a watcher

documentation: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

also see: https://github.com/swc-project/swc/issues/657 for a possible pending solution
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildFiles = exports.buildFile = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const gen_await_1 = require("js-utils/gen-await");
const typescript_1 = tslib_1.__importStar(require("typescript"));
const get_ts_config_js_1 = tslib_1.__importDefault(require("../build-utils/get-ts-config.js"));
const src_to_build_path_js_1 = tslib_1.__importDefault(require("../build-utils/src-to-build-path.js"));
function mapStringToEnumValue(keyToMap, enumMap) {
    for (const [key, value] of Object.entries(enumMap)) {
        if (key.toLowerCase() === keyToMap.toLowerCase()) {
            return value;
        }
    }
    throw new Error(`Key ${keyToMap} not found in enum`);
}
function remapCompilerOptions(options) {
    const remapEnums = { moduleResolution: typescript_1.ModuleResolutionKind };
    Object.entries(remapEnums).forEach(([key, value]) => {
        if (options.hasOwnProperty(key)) {
            options[key] = mapStringToEnumValue(options[key], value);
        }
    });
}
async function buildFile(srcPath) {
    const [tsConfig, [jsBuildPath, definitionBuildPath]] = await (0, gen_await_1.genAllEnforce)((0, get_ts_config_js_1.default)(srcPath), getBuildFiles(srcPath));
    // there are some minor differences in the public and private tsconfig spec that we don't care about
    // such as enums vs strings so cast them away
    const compilerOptions = (tsConfig.compilerOptions ||
        {});
    const { dir: srcDir } = (0, path_1.parse)(srcPath);
    // some of the options don't accept the strings that are in the tsconfig.json files and need to be re-mapped to enums
    remapCompilerOptions(compilerOptions);
    const createdFiles = {};
    const host = typescript_1.default.createCompilerHost(compilerOptions);
    host.writeFile = (fileName, contents) => (createdFiles[fileName] = contents);
    const program = typescript_1.default.createProgram([srcPath], compilerOptions, host);
    program.emit();
    [jsBuildPath, definitionBuildPath].forEach((file) => {
        if (!createdFiles[file]) {
            throw new Error(`${file} was not built`);
        }
    });
    return {
        [(0, path_1.resolve)(srcDir, jsBuildPath)]: createdFiles[jsBuildPath],
        [(0, path_1.resolve)(srcDir, definitionBuildPath)]: createdFiles[definitionBuildPath],
    };
}
exports.buildFile = buildFile;
async function getBuildFiles(srcPath) {
    const buildPath = (0, src_to_build_path_js_1.default)(srcPath);
    const parsedBuildPath = (0, path_1.parse)(buildPath);
    const rootBuildPath = `${parsedBuildPath.dir}/${parsedBuildPath.name}`;
    const jsBuildPath = `${rootBuildPath}.js`;
    const definitionBuildPath = `${rootBuildPath}.d.ts`;
    // const mapBuildPath = `${rootBuildPath}.map` as absoluteFilePath;
    return [jsBuildPath, definitionBuildPath];
}
exports.getBuildFiles = getBuildFiles;
