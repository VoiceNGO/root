import buildFile from '../build-file';
import buildDir from '../build-dir';
import deletedFile from '../deleted-file';
import deletedDir from '../deleted-dir';
import exists from 'node-utils/fs/exists';
import { processSubscriptionFile } from '../process-subscription-file';

jest.mock('buildFile');
jest.mock('buildDir');
jest.mock('deletedFile');
jest.mock('deletedDir');
jest.mock('exists');

const fileInfo = {
  type: 'f' as const,
  name: 'foo.ts',
  exists: true,
};

const dirInfo = {
  type: 'd' as const,
  name: 'foo',
  exists: true,
};

test('calls buildFile when file created', async () => {
  await processSubscriptionFile(fileInfo);
  expect(buildFile).toHaveBeenCalled();
});
