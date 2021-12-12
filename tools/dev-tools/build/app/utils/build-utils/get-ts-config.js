import { exec } from '../../../../../../modules/node-utils/build/child_process/promises/index.js';
import path from 'path';
export default async function getTSConfig(srcFile) {
  const cwd = path.dirname(srcFile);
  const { stdout, stderr } = await exec('yarn tsc --showConfig', { cwd });
  if (stderr) {
    return {};
  }
  try {
    return JSON.parse(stdout);
  } catch (_a) {
    throw new Error(`Error parsing JSON for tsc output in ${cwd}`);
  }
}
