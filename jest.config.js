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
  testRegex: ['(/__tests__/(?!_).*|(\\.|/)(test|spec))\\.[jt]sx?$'],
  transform: {
    '^.+\\.[cm]?tsx?$': 'babel-jest',
  },
};
