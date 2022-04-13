import {spawn} from 'child_process';

const nodeAppPort = '6666';
const cfWorkerAppPort = '7777';
const httpServerPort = '9999';

export const testEnvironments = [
  {
    name: 'NodeJS',
    domain: `http://localhost:${nodeAppPort}`,
    process: spawn(
      'yarn',
      ['node', 'dist/clients/http_client/__e2etests__/test-node-app.js'],
      {
        env: {
          ...process.env, // eslint-disable-line no-process-env
          PORT: nodeAppPort,
          HTTP_SERVER_PORT: httpServerPort,
          E2ETESTS: '1',
        },
        detached: true,
        // stdio: 'inherit',
      },
    ),
    testable: true,
    ready: false,
  },
  {
    name: 'CF Worker',
    domain: `http://localhost:${cfWorkerAppPort}`,
    process: spawn(
      'yarn',
      [
        'miniflare',
        '--env',
        'src/clients/http_client/__e2etests__/.env.test',
        '--global',
        'E2ETESTS=1',
        '--port',
        `${cfWorkerAppPort}`,
        '--modules',
        'bundle/test-cf-worker-app.js',
      ],
      {
        detached: true,
        // stdio: 'inherit',
      },
    ),
    testable: true,
    ready: false,
  },
  {
    name: 'HTTP server',
    domain: `http://localhost:${httpServerPort}`,
    process: spawn(
      'yarn',
      ['node', 'dist/clients/http_client/__e2etests__/http_server.js'],
      {
        env: {
          ...process.env, // eslint-disable-line no-process-env
          HTTP_SERVER_PORT: httpServerPort,
        },
        detached: true,
        // stdio: 'inherit',
      },
    ),
    testable: false,
    ready: false,
  },
];
