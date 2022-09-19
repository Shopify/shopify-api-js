import baseConfig from './base.jest.config.mjs';

export default {
  ...baseConfig,
  displayName: 'rest_resources',
  rootDir: '../../rest/admin',
  setupFilesAfterEnv: ['<rootDir>/../../setup-jest.ts'],
};
