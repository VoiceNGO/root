import { exec as cpExec } from 'child_process';
import { promisify } from 'util';
promisify;
export default async function exec(command, options) {
    return new Promise((resolve, reject) => {
        cpExec(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
        });
    });
}
