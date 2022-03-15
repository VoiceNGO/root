import chokidar from 'chokidar';
import voiceRoot from 'node-utils/voice-root';
import processSubscriptionFile from './process-subscription-file';

export default function watchFolder(folderToWatch: absoluteDirPath) {
  chokidar
    .watch(folderToWatch, {
      followSymlinks: false,

      // ignore node_modules, dot files/folders
      ignored: /(^|\/)(node_modules|\.)/,
    })
    .on('all', (event, path) => {
      if (path.indexOf(voiceRoot) !== 0) {
        throw new Error('file not in voice root or relative path detected');
      }
      processSubscriptionFile(event, path as absolutePath);
    });
}

watchFolder(voiceRoot);
