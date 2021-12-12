/// <reference types="voice" />
import * as ts from 'typescript';
export default function tsBuild(srcPath: absolutePath, options?: ts.CompilerOptions): Promise<void>;
export declare function getBuildFiles(srcPath: absolutePath, type?: 'all' | 'js' | 'map'): absolutePath[];
