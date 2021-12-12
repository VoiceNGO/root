import { readFile } from 'fs/promises';
export default async function isServiceDefinition(srcPath) {
    const fileContents = await readFile(srcPath);
    // TODO: actually verify that the export matches the expected shape
    return /: k8sConfig/gm.test(fileContents.toString());
}
