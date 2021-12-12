import { readFile } from 'fs/promises';
import isObject from 'js-utils/is-object';
export default async function readJsonFile(srcPath) {
    const fileContents = await readFile(srcPath);
    try {
        const json = JSON.parse(fileContents.toString());
        if (!isObject(json)) {
            throw new Error(`Unexpected contents of JSON file: ${srcPath}`);
        }
        return json;
    }
    catch {
        throw new Error(`Failed to parse JSON: ${srcPath}`);
    }
}
