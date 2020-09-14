module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  testRegex: '.*\\.test\\.tsx?$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
};
