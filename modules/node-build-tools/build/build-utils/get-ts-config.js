"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("node-utils/child_process/promises");
const path_1 = tslib_1.__importDefault(require("path"));
async function getTSConfig(srcFile) {
    const cwd = path_1.default.dirname(srcFile);
    const { stdout, stderr } = await (0, promises_1.exec)('yarn tsc --showConfig', { cwd });
    if (stderr) {
        return {};
    }
    try {
        return JSON.parse(stdout);
    }
    catch {
        throw new Error(`Error parsing JSON for tsc output in ${cwd}`);
    }
}
exports.default = getTSConfig;
