"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const voice_root_1 = tslib_1.__importDefault(require("node-utils/voice-root"));
const process_subscription_file_1 = tslib_1.__importDefault(require("./process-subscription-file"));
function watchFolder(folderToWatch) {
    chokidar_1.default
        .watch(folderToWatch, {
        followSymlinks: false,
        // ignore node_modules, dot files/folders
        ignored: /(^|\/)(node_modules|\.)/,
    })
        .on('all', (event, path) => {
        if (path.indexOf(voice_root_1.default) !== 0) {
            throw new Error('file not in voice root or relative path detected');
        }
        (0, process_subscription_file_1.default)(event, path);
    });
}
exports.default = watchFolder;
watchFolder(voice_root_1.default);
