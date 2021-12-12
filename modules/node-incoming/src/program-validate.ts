import { programConfig } from './program.js';

export function validateConfig(config: programConfig): void {
  const { handler, commands } = config;

  if (!handler && !commands) {
    throw new Error(
      'Program config must container either a handler or nested commands'
    );
  }

  if (config.options) {
    Object.entries(config.options).forEach(([long, option]) => {
      const { short } = option;

      if (!/^[a-z]\w{1,}$/i.test(long)) {
        throw new Error(`option name "${long}" must be 2 or more letters.`);
      }
      if (short && !/^[a-z]$/i.test(short)) {
        throw new Error(`Short option "${short}" must be a single letter.`);
      }
    });
  }
}
