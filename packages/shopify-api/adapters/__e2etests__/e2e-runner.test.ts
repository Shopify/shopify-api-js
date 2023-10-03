import {spawn} from 'child_process';

import fetch from 'node-fetch';

import {TestConfig, E2eTestEnvironment} from './test_config_types';
import {runEnvironments, shutdownEnvironments} from './test_environments';
import {testSuite} from './test_suite';

export {E2eTestEnvironment} from './test_config_types';

export function runTests(env: E2eTestEnvironment) {
  const dummyShopifyServerEnvironment = {
    name: 'Dummy Shopify server',
    domain: `http://localhost:${env.dummyServerPort}`,
    dummyServerPort: 'not actually used',
    process: spawn(
      'yarn',
      ['node', 'adapters/__e2etests__/test_apps/test-dummy-shopify-server.js'],
      {
        env: {
          ...process.env, // eslint-disable-line no-process-env
          HTTP_SERVER_PORT: env.dummyServerPort,
        },
        detached: true,
        // stdio: 'inherit',
      },
    ),
    testable: false,
    ready: false,
  };

  const testEnvironments = [env, dummyShopifyServerEnvironment];

  describe(`${env.name}`, () => {
    beforeAll(async () => {
      await runEnvironments(testEnvironments);
    });

    afterAll(() => {
      shutdownEnvironments(testEnvironments);
    });

    testSuite.forEach((test) => {
      it(test.name, async () => {
        await checkTestResponse(
          await fetch(env.domain, fetchParams(test.config)),
        );
      });
    });
  });
}

function fetchParams(testConfig: TestConfig): any {
  return {
    method: 'post',
    body: JSON.stringify(testConfig),
    headers: {'Content-Type': 'application/json'},
  };
}

async function checkTestResponse(response: any): Promise<void> {
  try {
    expect(response.status).toEqual(200);
  } catch (err) {
    const responseBody = await response.json();
    err.message = `TEST FAILED - debug from appServer: ${JSON.stringify(
      responseBody,
      undefined,
      2,
    )}\n${responseBody.errorMessageReceived}`;
    throw err;
  }
}
