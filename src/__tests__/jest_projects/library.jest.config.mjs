import baseConfig from './base.jest.config.mjs';

export default {
  ...baseConfig,
  displayName: 'library',
  rootDir: '../../',
  testPathIgnorePatterns: [
    '<rootDir>/rest-resources/__tests__',
    '<rootDir>/session/storage',
    '<rootDir>/adapters',
    '<rootDir>/runtime',
    // TODO remove these as we refactor components, keep the ones above as they run in their own suites
    '<rootDir>/__tests__/base-rest-resource.test.ts',
    '<rootDir>/webhooks',
    '<rootDir>/billing',
    // These tests depend on the auth component and can't be fixed until it's refactored
    '<rootDir>/utils/__tests__/delete-offline-session.test.ts',
    '<rootDir>/utils/__tests__/load-offline-session.test.ts',
    '<rootDir>/utils/__tests__/graphql_proxy.test.ts',
    '<rootDir>/utils/__tests__/with-session.test.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
