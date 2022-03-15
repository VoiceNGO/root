import Err from '../err';

test('should accept strings', () => {
  const err = new Err('foo');
  expect(err.message).toEqual('foo');
});

test('should accept numbers', () => {
  const err = new Err(42);
  expect(err.message).toEqual('42');
});

test('should accept other Err instances', () => {
  const err = new Err(new Err('foo'));
  expect(err.message).toEqual('foo');
});

test('should accept Error instances', () => {
  const err = new Err(new Error('foo'));
  expect(err.message).toEqual('foo');
});

test('should accept and keep log levels', () => {
  expect(new Err('foo', null, 'info').logLevel).toBe('info');
  expect(new Err('foo', null, 'warn').logLevel).toBe('warn');
  expect(new Err('foo', null, 'emerg').logLevel).toBe('emerg');
});
