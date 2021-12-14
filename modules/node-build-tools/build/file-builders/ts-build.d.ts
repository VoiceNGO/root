/// <reference types="voice" />
export declare function buildFile(srcPath: absoluteFilePath): Promise<void | Record<absoluteFilePath, string>>;
export declare function getBuildFiles(srcPath: absoluteFilePath): Promise<absoluteFilePath[]>;
