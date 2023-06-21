import {spawn} from 'child_process';

import '..';

import '../../../runtime/__tests__/all.test';
import {runTests, E2eTestEnvironment} from '../../__e2etests__/e2e-runner.test';

const webApiAppPort = '8888';
const dummyServerPort = '8889';

// We should also try running this on a different environment that implements the Web API for better coverage.
const webApiEnvironment: E2eTestEnvironment = {
  name: 'Web API',
  domain: `http://localhost:${webApiAppPort}`,
  dummyServerPort,
  process: spawn(
    'yarn',
    [
      'miniflare',
      '--global',
      `HTTP_SERVER_PORT=${dummyServerPort}`,
      '--port',
      `${webApiAppPort}`,
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

runTests(webApiEnvironment);
