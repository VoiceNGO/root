import { unlink } from 'fs/promises';
import { extname } from 'path';
import isFrontendTS from './build-utils/is-frontend-ts.js';
import isServiceDefinition from './build-utils/is-service-definition.js';
import { getBuildFiles as getServiceBuildFiles } from './file-builders/ts-service-build.js';
import { getBuildFiles as getStylBuildFiles } from './file-builders/styl-build.js';
import { SupportedExtensions } from './build-utils/supported-extensions.js';
import { getBuildFiles as getTSBuildFiles } from './file-builders/ts-build.js';
async function getFilesToDelete(srcPath, ext) {
    switch (ext) {
        case SupportedExtensions.styl:
            return getStylBuildFiles(srcPath);
        case SupportedExtensions.ts:
        case SupportedExtensions.tsx:
            if (isFrontendTS(srcPath)) {
                throw new Error('Not Yet Implemented');
            }
            else {
                if (await isServiceDefinition(srcPath)) {
                    return getServiceBuildFiles(srcPath);
                }
                else {
                    return getTSBuildFiles(srcPath);
                }
            }
    }
}
export default async function deletedFile(srcPath) {
    const ext = extname(srcPath);
    let filesToDelete = ext in SupportedExtensions
        ? await getFilesToDelete(srcPath, ext)
        : [];
    const deletePromises = filesToDelete.map(unlink);
    return Promise.all(deletePromises);
}
console.log(42);
