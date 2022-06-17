"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildFiles = exports.buildFile = void 0;
const tslib_1 = require("tslib");
const is_service_definition_1 = tslib_1.__importDefault(require("../build-utils/is-service-definition"));
const serviceBuilder = tslib_1.__importStar(require("./ts-service-build"));
const tsBuilder = tslib_1.__importStar(require("./ts-normal-build"));
const ts_types_1 = tslib_1.__importDefault(require("../enums/ts-types"));
async function getTSType(srcPath) {
    const isService = await (0, is_service_definition_1.default)(srcPath);
    if (isService) {
        return ts_types_1.default.SERVICE_DEFINITION;
    }
    return ts_types_1.default.NORMAL;
}
async function getBuilder(srcPath) {
    const tsType = await getTSType(srcPath);
    return {
        [ts_types_1.default.NORMAL]: tsBuilder,
        [ts_types_1.default.SERVICE_DEFINITION]: serviceBuilder,
    }[tsType];
}
async function buildFile(srcPath) {
    const builder = await getBuilder(srcPath);
    return builder.buildFile(srcPath);
}
exports.buildFile = buildFile;
async function getBuildFiles(srcPath) {
    const builder = await getBuilder(srcPath);
    return builder.getBuildFiles(srcPath);
}
exports.getBuildFiles = getBuildFiles;
