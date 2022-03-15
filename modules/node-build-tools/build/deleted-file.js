"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const is_frontend_ts_js_1 = tslib_1.__importDefault(require("./build-utils/is-frontend-ts.js"));
const is_service_definition_js_1 = tslib_1.__importDefault(require("./build-utils/is-service-definition.js"));
const ts_service_build_js_1 = require("./file-builders/ts-service-build.js");
const sass_build_js_1 = require("./file-builders/sass-build.js");
const supported_extensions_js_1 = require("./enums/supported-extensions.js");
const ts_build_js_1 = require("./file-builders/ts-build.js");
const err_1 = tslib_1.__importDefault(require("js-utils/err/err"));
async function getFilesToDelete(srcPath, ext) {
    switch (ext) {
        case supported_extensions_js_1.SupportedExtensions.sass:
            return (0, sass_build_js_1.getBuildFiles)(srcPath);
        case supported_extensions_js_1.SupportedExtensions.ts:
        case supported_extensions_js_1.SupportedExtensions.tsx:
            if ((0, is_frontend_ts_js_1.default)(srcPath)) {
                throw new err_1.default('Not Yet Implemented');
            }
            else {
                if (await (0, is_service_definition_js_1.default)(srcPath)) {
                    return (0, ts_service_build_js_1.getBuildFiles)(srcPath);
                }
                else {
                    return (0, ts_build_js_1.getBuildFiles)(srcPath);
                }
            }
    }
}
async function deletedFile(srcPath) {
    const ext = (0, path_1.extname)(srcPath);
    let filesToDelete = ext in supported_extensions_js_1.SupportedExtensions
        ? await getFilesToDelete(srcPath, ext)
        : [];
    const deletePromises = filesToDelete.map(promises_1.unlink);
    return Promise.all(deletePromises);
}
exports.default = deletedFile;
