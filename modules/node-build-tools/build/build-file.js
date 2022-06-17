"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuilder = void 0;
const index_js_1 = require("./file-builders/index.js");
const promises_1 = require("fs/promises");
const gen_await_1 = require("js-utils/gen-await");
async function srcIsNewerThanBuildFiles(builder, srcPath) {
    const buildFiles = await builder.getBuildFiles(srcPath);
    const [srcStat, ...buildStats] = await (0, gen_await_1.genAllNull)((0, promises_1.stat)(srcPath), ...buildFiles.map((file) => (0, promises_1.stat)(file)));
    if (!srcStat) {
        throw new Error(`could not stat src file ${srcPath}`);
    }
    const olderBuildFiles = buildStats.filter((buildStat) => !buildStat || buildStat.mtime < srcStat.mtime);
    const olderFileExists = olderBuildFiles.length > 0;
    return olderFileExists;
}
async function buildFile(srcPath) {
    const builder = getBuilder(srcPath);
    if (!builder) {
        console.warn(`No builder available for for file "${srcPath}"`);
        return;
    }
    if (!(await srcIsNewerThanBuildFiles(builder, srcPath))) {
        return;
    }
    // builder.buildFile(srcPath);
}
exports.default = buildFile;
function getBuilder(srcPath) {
    const matchers = [
        [/\.d\.ts$/, index_js_1.copy],
        [/\.link$/, index_js_1.copy],
        [/\.sass$/, index_js_1.sass],
        [/\.[cm]?tsx?$/, index_js_1.ts],
    ];
    const matchedBuilder = matchers.find(([regex]) => regex.test(srcPath));
    return matchedBuilder && matchedBuilder[1];
}
exports.getBuilder = getBuilder;
