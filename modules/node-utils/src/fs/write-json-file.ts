import { writeFile } from 'fs/promises';

export default async function writeJsonFile(
  filePath: absoluteFilePath,
  contents: json
): Promise<void> {
  writeFile(filePath, JSON.stringify(contents, undefined, 2));
}
