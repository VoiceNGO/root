"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuilder = void 0;
const tslib_1 = require("tslib");
const get_two_dot_extension_1 = tslib_1.__importDefault(require("node-utils/fs/get-two-dot-extension"));
const index_js_1 = require("./file-builders/index.js");
const promises_1 = require("fs/promises");
const gen_await_1 = require("js-utils/gen-await");
async function srcIsNewerThanBuildFiles(builder, srcPath) {
    const buildFiles = await builder.getBuildFiles(srcPath);
    const [srcStat, ...buildStats] = await (0, gen_await_1.genAllEnforce)((0, promises_1.stat)(srcPath), ...buildFiles.map((file) => (0, promises_1.stat)(file)));
    const olderBuildFiles = buildStats.filter((buildStat) => buildStat.mtime < srcStat.mtime);
    const olderFileExists = olderBuildFiles.length > 0;
    return olderFileExists;
}
async function buildFile(srcPath) {
    const builder = getBuilder(srcPath);
    if (!builder) {
        const extension = (0, get_two_dot_extension_1.default)(srcPath);
        console.warn(`No builder available for for file "${srcPath}"`);
        return;
    }
    if (!(await srcIsNewerThanBuildFiles(builder, srcPath))) {
        return;
    }
    builder.buildFile(srcPath);
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
