import {spawn} from 'child_process';

import '..';

import '../../../runtime/__tests__/all.test';
import {runTests, E2eTestEnvironment} from '../../__e2etests__/e2e-runner.test';

const cfWorkerAppPort = '7777';
const dummyServerPort = '7778';

const workerEnvironment: E2eTestEnvironment = {
  name: 'CF Worker',
  domain: `http://localhost:${cfWorkerAppPort}`,
  dummyServerPort,
  process: spawn(
    'yarn',
    [
      'miniflare',
      '--global',
      `HTTP_SERVER_PORT=${dummyServerPort}`,
      '--port',
      `${cfWorkerAppPort}`,
      '--modules',
      'bundle/test-web-api-app.js',
    ],
    {
      detached: true,
      // stdio: 'inherit',
    },
  ),
  testable: true,
  ready: false,
};

runTests(workerEnvironment);
