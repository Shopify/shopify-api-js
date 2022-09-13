const semver = require('semver');

const projects = [
  './src/__tests__/jest_projects/library.jest.config.mjs',
  './src/__tests__/jest_projects/session_storage.jest.config.mjs',
  './src/__tests__/jest_projects/eslint.jest.config.mjs',
  './src/__tests__/jest_projects/adapters.mock.jest.config.mjs',
  './src/__tests__/jest_projects/adapters.node.jest.config.mjs',
];

// TODO Make all projects permanent after support for version 14 is dropped
if (semver.gte(process.version, '15.0.0')) {
  projects.push(
    './src/__tests__/jest_projects/adapters.cf-worker.jest.config.mjs',
  );
}

module.exports = {
  testTimeout: 30000,
  projects,
};
