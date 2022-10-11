import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
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

export default config;
