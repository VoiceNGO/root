"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path_1 = __importStar(require("path"));
const index_js_1 = require("./index.js");
async function mkdirp(dirPath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(dirPath), 'non-absolute path passed to mkdirp');
    // include '' as 'root' so that paths start with  / since we're only working with absolute paths here
    const folderNames = ['', ...(0, index_js_1.pathToFolderNameArray)(dirPath)];
    for (let i = 1, l = folderNames.length; i < l; i++) {
        const partialDir = folderNames
            .slice(0, i + 1)
            .join(path_1.default.sep);
        // eslint-disable-next-line no-await-in-loop -- it's necessary for mkdirp
        await (0, index_js_1.createDirectoryIfNotExists)(partialDir);
    }
}
exports.default = mkdirp;
