import baseConfig from './base.jest.config.mjs';

import semver from 'semver';

const ignorePaths = [];
if (semver.lt(process.version, '15.0.0')) {
  ignorePaths.push('src/session-storage/__tests__/kv.test.ts');
}

export default {
  ...baseConfig,
  displayName: 'session_storage',
  rootDir: '../../session-storage',
  testPathIgnorePatterns: ignorePaths,
};
