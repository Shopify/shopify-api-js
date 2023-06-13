/* eslint-disable-next-line no-undef */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: 'src/.*\\.test\\.tsx?$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/src/utils/setup-jest.ts'],
};
