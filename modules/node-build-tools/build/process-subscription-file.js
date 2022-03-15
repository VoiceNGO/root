"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSubscriptionFile = void 0;
const tslib_1 = require("tslib");
const deleted_file_1 = tslib_1.__importDefault(require("./deleted-file"));
const build_file_1 = tslib_1.__importDefault(require("./build-file"));
const build_dir_1 = tslib_1.__importDefault(require("./build-dir"));
const deleted_dir_1 = tslib_1.__importDefault(require("./deleted-dir"));
const function_queue_1 = tslib_1.__importDefault(require("js-utils/function-queue"));
const throw_bad_switch_value_1 = tslib_1.__importDefault(require("js-utils/throw-bad-switch-value"));
const queue = new function_queue_1.default(10);
function addSubscriptionFileToQueue(eventName, path) {
    queue.add(() => processSubscriptionFile(eventName, path));
}
exports.default = addSubscriptionFileToQueue;
async function processSubscriptionFile(eventName, path) {
    switch (eventName) {
        case 'add':
        case 'change':
            (0, build_file_1.default)(path);
            break;
        case 'addDir':
            (0, build_dir_1.default)(path);
            break;
        case 'unlink':
            (0, deleted_file_1.default)(path);
            break;
        case 'unlinkDir':
            (0, deleted_dir_1.default)(path);
            break;
        default:
            (0, throw_bad_switch_value_1.default)(eventName);
    }
}
exports.processSubscriptionFile = processSubscriptionFile;
