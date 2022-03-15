"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const path_1 = tslib_1.__importStar(require("path"));
const create_directory_if_not_exists_1 = tslib_1.__importDefault(require("./create-directory-if-not-exists"));
const path_to_folder_name_array_1 = tslib_1.__importDefault(require("./path-to-folder-name-array"));
async function mkdirp(dirPath) {
    (0, assert_1.default)((0, path_1.isAbsolute)(dirPath), 'non-absolute path passed to mkdirp');
    // include '' as 'root' so that paths start with  / since we're only working with absolute paths here
    const folderNames = ['', ...(0, path_to_folder_name_array_1.default)(dirPath)];
    for (let i = 1, l = folderNames.length; i < l; i++) {
        const partialDir = folderNames
            .slice(0, i + 1)
            .join(path_1.default.sep);
        // eslint-disable-next-line no-await-in-loop -- it's necessary for mkdirp
        await (0, create_directory_if_not_exists_1.default)(partialDir);
    }
}
exports.default = mkdirp;
