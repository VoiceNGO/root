import { writeFile } from 'fs/promises';
export default async function writeJsonFile(filePath, contents) {
    writeFile(filePath, JSON.stringify(contents, undefined, 2));
}
