import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'adapters:mock',
  rootDir: '../../../adapters/mock',
};

export default config;
