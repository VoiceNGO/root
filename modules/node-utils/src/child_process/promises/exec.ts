import { exec as cpExec, ExecOptions } from 'child_process';
import { ObjectEncodingOptions } from 'fs';
import { promisify } from 'util';
promisify;

export default async function exec(
  command: string,
  options: (ObjectEncodingOptions & ExecOptions) | null | undefined
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    cpExec(command, options, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
    });
  });
}
