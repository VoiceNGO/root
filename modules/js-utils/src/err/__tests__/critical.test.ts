import CriticalErr from '../critical';

test('should create errors with critical level', () => {
  expect(new CriticalErr('foo').logLevel).toEqual('crit');
});
