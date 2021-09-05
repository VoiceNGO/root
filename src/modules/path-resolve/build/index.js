"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const expand_tilde_1 = (0, tslib_1.__importDefault)(require("expand-tilde"));
const path_1 = require("path");
__dirname = __dirname || process.cwd();
function pathResolve(src) {
    const expandedSrc = (0, expand_tilde_1.default)(src);
    return expandedSrc[0] === '/' ? expandedSrc : (0, path_1.resolve)(expandedSrc);
}
exports.default = pathResolve;
