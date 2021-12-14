"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildFiles = exports.buildFile = void 0;
const tslib_1 = require("tslib");
const is_service_definition_1 = (0, tslib_1.__importDefault)(require("../build-utils/is-service-definition"));
const serviceBuilder = (0, tslib_1.__importStar)(require("./ts-service-build.js"));
const tsBuilder = (0, tslib_1.__importStar)(require("./ts-normal-build.js"));
var TSTypes;
(function (TSTypes) {
    TSTypes[TSTypes["NORMAL"] = 0] = "NORMAL";
    TSTypes[TSTypes["SERVICE_DEFINITION"] = 1] = "SERVICE_DEFINITION";
})(TSTypes || (TSTypes = {}));
async function getTSType(srcPath) {
    const isService = await (0, is_service_definition_1.default)(srcPath);
    if (isService) {
        return TSTypes.SERVICE_DEFINITION;
    }
    return TSTypes.NORMAL;
}
async function getBuilder(srcPath) {
    const tsType = await getTSType(srcPath);
    return {
        [TSTypes.NORMAL]: tsBuilder,
        [TSTypes.SERVICE_DEFINITION]: serviceBuilder,
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
