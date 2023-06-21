import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'adapters:web-api',
  rootDir: '../../../adapters/web-api',
  testEnvironment: 'miniflare',
};

export default config;
