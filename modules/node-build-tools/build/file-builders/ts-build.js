import isServiceDefinition from '../build-utils/is-service-definition';
import * as serviceBuilder from './ts-service-build.js';
import * as tsBuilder from './ts-normal-build.js';
var TSTypes;
(function (TSTypes) {
    TSTypes[TSTypes["NORMAL"] = 0] = "NORMAL";
    TSTypes[TSTypes["SERVICE_DEFINITION"] = 1] = "SERVICE_DEFINITION";
})(TSTypes || (TSTypes = {}));
async function getTSType(srcPath) {
    const isService = await isServiceDefinition(srcPath);
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
export async function buildFile(srcPath) {
    const builder = await getBuilder(srcPath);
    return builder.buildFile(srcPath);
}
export async function getBuildFiles(srcPath) {
    const builder = await getBuilder(srcPath);
    return builder.getBuildFiles(srcPath);
}
