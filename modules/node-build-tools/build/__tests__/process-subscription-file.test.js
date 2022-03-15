"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const build_file_1 = tslib_1.__importDefault(require("../build-file"));
const process_subscription_file_1 = require("../process-subscription-file");
jest.mock('buildFile');
jest.mock('buildDir');
jest.mock('deletedFile');
jest.mock('deletedDir');
jest.mock('exists');
const fileInfo = {
    type: 'f',
    name: 'foo.ts',
    exists: true,
};
const dirInfo = {
    type: 'd',
    name: 'foo',
    exists: true,
};
test('calls buildFile when file created', async () => {
    await (0, process_subscription_file_1.processSubscriptionFile)(fileInfo);
    expect(build_file_1.default).toHaveBeenCalled();
});
