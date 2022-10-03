import baseConfig from './base.jest.config.mjs';

import semver from 'semver';

// eslint-disable-next-line no-warning-comments
// TODO Remove this when dropping Node 14 support
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
