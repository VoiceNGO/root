module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
  // projects: ['<rootDir>/modules/*'],
  // rootDir: '/voice',
  // resolver: 'node-build-tools/build/jest-module-resolver.cjs',
  testPathIgnorePatterns: ['/node_modules/', 'test.d.ts'],
  /*
  TODO: tests are currently running against test in build instead of src because jest is *slooowwwww* compiling TS and
        I can't figure out how to make it faster.  Running tests directly against the TS would be better
  */
  testRegex: [
    '/build(?=/)(?!.*/src/).*(/__tests__/(?!_).*|(\\.|/)(test|spec))\\.[jt]sx?$',
  ],
};
