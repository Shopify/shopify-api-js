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
    "<rootDir>/clients",
    "<rootDir>/__tests__/base-rest-resource.test.ts",
    "<rootDir>/auth",
    "<rootDir>/utils",
    "<rootDir>/webhooks",
    "<rootDir>/billing",
 
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
