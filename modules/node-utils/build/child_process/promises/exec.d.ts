/// <reference types="node" />
/// <reference types="node" />
import { ExecOptions } from 'child_process';
import { ObjectEncodingOptions } from 'fs';
export default function exec(command: string, options: (ObjectEncodingOptions & ExecOptions) | null | undefined): Promise<{
    stdout: string;
    stderr: string;
}>;
//# sourceMappingURL=exec.d.ts.map