import watchman from 'fb-watchman';
import voiceRootFolder from 'node-utils/voice-root';

const client = new watchman.Client();

client.capabilityCheck(
  { optional: [], required: ['relative_root'] },
  (err, resp) => {
    if (err) {
      return;
    }

    client.command(['watch-project', voiceRootFolder], (cmdErr, cmdResp) => {
      if (cmdErr) {
        return;
      }
    });
  }
);

console.log(42);
