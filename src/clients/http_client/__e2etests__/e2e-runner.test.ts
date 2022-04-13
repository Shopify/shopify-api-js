import fetch from 'node-fetch';

import {TestConfig} from './test_config_types';
import {
  runEnvironments,
  shutdownEnvironments,
  testEnvironments,
} from './test_environments';
import {testSuite} from './test_suite';

testEnvironments.forEach((env, count) => {
  describe(`${env.name}`, () => {
    beforeAll(async () => {
      await runEnvironments();
    });

    afterAll(() => {
      // if we've finished last test cycle, shut down processes
      if (count + 1 === testEnvironments.length) {
        shutdownEnvironments();
      }
    });

    testSuite.forEach((test) => {
      it(test.name, async () => {
        await checkTestResponse(
          await fetch(env.domain, fetchParams(test.config)),
        );
      });
    });
  });
});

function fetchParams(testConfig: TestConfig): any {
  return {
    method: 'post',
    body: JSON.stringify(testConfig),
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
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
    )}`;
    throw err;
  }
}
