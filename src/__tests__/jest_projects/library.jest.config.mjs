import baseConfig from './base.jest.config.mjs';

export default {
  ...baseConfig,
  displayName: 'library',
  rootDir: '../../',
  testPathIgnorePatterns: [
    '<rootDir>/rest-resources/__tests__',
    '<rootDir>/auth/session/storage',
    '<rootDir>/adapters',
    '<rootDir>/runtime',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
