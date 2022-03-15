module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>/',
  // }),
  // projects: ['<rootDir>/modules/*'],
  // rootDir: '/voice',
  // resolver:
  //   '/voice/modules/node-build-tools/build/build-utils/jest-resolver.cjs',
  testPathIgnorePatterns: ['/node_modules/', 'test.d.ts'],
  testRegex: ['src/__tests__/.*$'],
};
