/// <reference types="voice" />
/// <reference types="node" />
export declare type iBuilder = {
    buildFile: (srcPath: absoluteFilePath) => Promise<Record<absoluteFilePath, Buffer | string>>;
    getBuildFiles: (srcPath: absoluteFilePath) => Promise<[absoluteFilePath]>;
};
declare const copy: iBuilder, sass: iBuilder, ts: iBuilder;
export { copy, sass, ts };
//# sourceMappingURL=index.d.ts.map