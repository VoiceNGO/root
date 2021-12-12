import path, { isAbsolute } from 'path';

export default function pathToFolderNameArray(
  dirPath: fsNodePath
): fsNodeName[] {
  const splitPath = dirPath.split(path.sep);
  const pathIsAbsolute = isAbsolute(dirPath);

  if (pathIsAbsolute) {
    splitPath.splice(0, 1);
  }

  return splitPath as fsNodeName[];
}
