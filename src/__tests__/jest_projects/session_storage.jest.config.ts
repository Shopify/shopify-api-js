import type {Config} from 'jest';
import semver from 'semver';

import baseConfig from './base.jest.config';

// eslint-disable-next-line no-warning-comments
// TODO Remove this when dropping Node 14 support
const ignorePaths = [];
if (semver.lt(process.version, '15.0.0')) {
  ignorePaths.push('src/session-storage/__tests__/kv.test.ts');
}

const config: Config = {
  ...baseConfig,
  displayName: 'session_storage',
  rootDir: '../../session-storage',
  testPathIgnorePatterns: ignorePaths,
};

export default config;
