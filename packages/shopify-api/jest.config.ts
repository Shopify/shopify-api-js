import type {Config} from 'jest';

const projects = [
  './lib/__tests__/jest_projects/library.jest.config.ts',
  './lib/__tests__/jest_projects/rest_resources.jest.config.ts',
  './lib/__tests__/jest_projects/eslint.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.mock.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.node.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.cf-worker.jest.config.ts',
  './lib/__tests__/jest_projects/adapters.web-api.jest.config.ts',
];

const config: Config = {
  testTimeout: 30000,
  projects,
};

export default config;
