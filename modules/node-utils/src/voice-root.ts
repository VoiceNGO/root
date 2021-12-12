import { resolve } from 'path';

const voiceRootProjectName = 'voice-npo';

export function voiceRoot(dir = resolve('.')): string {
  const jsonPath = resolve(dir, 'package.json');
  try {
    const packageJson = require(jsonPath);
    if (packageJson.name === voiceRootProjectName) return dir;
  } catch (err) {}

  const upDir = resolve(dir, '..');

  if (upDir !== dir) {
    return voiceRoot(upDir);
  }

  throw new Error('Must be run from within the VoiceNPO root');
}

export default voiceRoot();
