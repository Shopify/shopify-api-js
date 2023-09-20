import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'adapters:cf-worker',
  rootDir: '../../../adapters/cf-worker',
  testEnvironment: 'miniflare',
};

export default config;
