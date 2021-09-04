export function toRelativePath(path: string): relativePath {
  return path as relativePath;
}

export function toAbsolutePath(path: string): absolutePath {
  if (path[0] !== '/') {
    throw new Error('absolutePath type must begin with a /');
  }

  return path as absolutePath;
}
