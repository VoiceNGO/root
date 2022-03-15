import deletedFile from './deleted-file';
import buildFile from './build-file';
import buildDir from './build-dir';
import deletedDir from './deleted-dir';
import FunctionQueue from 'js-utils/function-queue';
import throwBadSwitchValue from 'js-utils/throw-bad-switch-value';

const queue = new FunctionQueue(10);
export default function addSubscriptionFileToQueue(
  eventName: chokidarEvents,
  path: absolutePath
) {
  queue.add(() => processSubscriptionFile(eventName, path));
}

type chokidarEvents = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

export async function processSubscriptionFile(
  eventName: chokidarEvents,
  path: absolutePath
): Promise<void> {
  switch (eventName) {
    case 'add':
    case 'change':
      buildFile(path as absoluteFilePath);
      break;

    case 'addDir':
      buildDir(path as absoluteDirPath);
      break;

    case 'unlink':
      deletedFile(path as absoluteFilePath);
      break;

    case 'unlinkDir':
      deletedDir(path as absoluteDirPath);
      break;

    default:
      throwBadSwitchValue(eventName);
  }
}
