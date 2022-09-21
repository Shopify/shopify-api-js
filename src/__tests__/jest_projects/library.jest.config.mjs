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
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
