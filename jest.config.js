module.exports = {
  testTimeout: 30000,
  projects: [
    './src/__tests__/jest_projects/library.jest.config.mjs',
    './src/__tests__/jest_projects/session_storage.jest.config.mjs',
    './src/__tests__/jest_projects/adapters.node.jest.config.mjs',
    './src/__tests__/jest_projects/adapters.cf-worker.jest.config.mjs',
    './src/__tests__/jest_projects/eslint.jest.config.mjs',
  ],
};
