import type {Config} from 'jest';
import semver from 'semver';

const projects = [
  './lib/__tests__/jest_projects/library.jest.config.ts',
  './lib/__tests__/jest_projects/rest_resources.jest.config.ts',
  './lib/__tests__/jest_projects/eslint.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.mock.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.node.jest.config.ts',
];

// eslint-disable-next-line no-warning-comments
// TODO Make all projects permanent after support for version 14 is dropped
if (semver.gte(process.version, '15.0.0')) {
  projects.push(
    './lib/__tests__/jest_projects/adapters.cf-worker.jest.config.ts',
  );
}

const config: Config = {
  testTimeout: 30000,
  projects,
};

export default config;
