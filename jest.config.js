module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'json'],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  testRegex: '.*\\.test\\.tsx?$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js']
};
