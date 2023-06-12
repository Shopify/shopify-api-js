import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'library',
  rootDir: '../../',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

export default config;
