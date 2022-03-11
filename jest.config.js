module.exports = {
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: 'src/clients/http_client/.*\\.test\\.tsx?$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/src/utils/setup-jest.ts'],
};
