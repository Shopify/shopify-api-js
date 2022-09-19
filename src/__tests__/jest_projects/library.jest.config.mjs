import baseConfig from './base.jest.config.mjs';

export default {
  ...baseConfig,
  displayName: 'library',
  rootDir: '../../',
  testPathIgnorePatterns: [
    '<rootDir>/rest/admin',
    '<rootDir>/session-storage',
    '<rootDir>/adapters',
    '<rootDir>/runtime',
    // TODO remove these as we refactor components, keep the ones above as they run in their own suites
    '<rootDir>/billing',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
