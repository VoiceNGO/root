import getConsole from '../console';

describe('getConsole', () => {
  test('Returns a console when it exists', () => {
    expect(getConsole()).toBe(console);
    expect(getConsole(console)).toBe(console);
  });

  test('Returns a mock console when console does not exist', () => {
    const mockedConsole = getConsole(null);
    const methods = Object.keys(console).filter(
      // something (jest?) is adding _buffer, _counters, _timers, and _groupDepth
      (key) => key != 'Console' && key[0] !== '_'
    );
    methods.forEach((method) => {
      expect(mockedConsole).toHaveProperty(method);
      // @ts-expect-error -- TS doesn't provide an easy way to get all the keys then exclude 'Console'
      expect(mockedConsole[method].toString()).toBe('() => {}');
    });
  });
});
