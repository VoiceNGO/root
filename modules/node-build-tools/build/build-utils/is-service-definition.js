"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
async function isServiceDefinition(srcPath) {
    const fileContents = await (0, promises_1.readFile)(srcPath);
    // TODO: actually verify that the export matches the expected shape
    return /: k8sConfig/gm.test(fileContents.toString());
}
exports.default = isServiceDefinition;
