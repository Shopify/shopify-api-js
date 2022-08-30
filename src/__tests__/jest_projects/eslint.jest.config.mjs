export default {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  rootDir: '../../',
  testMatch: ['<rootDir>/**/*.ts', '<rootDir>/**/*.js'],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
};
