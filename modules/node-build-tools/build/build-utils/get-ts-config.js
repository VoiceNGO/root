import { exec } from 'node-utils/child_process/promises';
import path from 'path';
import { dirname } from 'node-utils/dirname';
const __dirname = dirname(import.meta);
export default async function getTSConfig(srcFile) {
    const cwd = path.dirname(srcFile);
    const { stdout, stderr } = await exec('yarn tsc --showConfig', { cwd });
    if (stderr) {
        return {};
    }
    try {
        return JSON.parse(stdout);
    }
    catch {
        throw new Error(`Error parsing JSON for tsc output in ${cwd}`);
    }
}
