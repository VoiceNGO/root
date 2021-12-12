import { spawn } from 'child_process';

export default function copy(
  src: string,
  dest: string,
  { recursive }: { recursive?: boolean } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = recursive ? ['-r'] : [];
    const cp = spawn('cp', [...args, src, dest]);

    cp.on('close', (code) => {
      if (code) {
        reject(`cp exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
}
