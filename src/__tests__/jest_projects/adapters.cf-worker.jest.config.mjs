import baseConfig from './base.jest.config.mjs';

export default {
  ...baseConfig,
  displayName: 'adapters:cf-worker',
  rootDir: '../../adapters/cf-worker',
  testEnvironment: 'miniflare',
};
