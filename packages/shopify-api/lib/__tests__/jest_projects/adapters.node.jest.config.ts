import type {Config} from 'jest';

import baseConfig from './base.jest.config';

const config: Config = {
  ...baseConfig,
  displayName: 'adapters:node',
  rootDir: '../../../adapters/node',
};

export default config;
