import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'rest_resources',
  rootDir: '../../rest/admin',
  setupFilesAfterEnv: ['<rootDir>/../../setup-jest.ts'],
};

export default config;
