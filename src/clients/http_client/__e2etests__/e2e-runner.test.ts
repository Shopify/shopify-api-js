import fetch from 'node-fetch';

import {TestConfig} from './test_config_types';
import {testEnvironments} from './test_environments';
import {testSuite} from './test_suite';

const testableEnvironments = testEnvironments.filter(
  (env) => env.testable,
).length;

testEnvironments.forEach((env, count) => {
  describe(`${env.name}`, () => {
    beforeAll(async () => {
      await serverPoolReady();
    });

    afterAll(() => {
      // if we've finished last test cycle, shut down processes
      if (count === testableEnvironments) {
        killServerPool();
      }
    });

    if (env.testable) {
      testSuite.forEach((test) => {
        it(test.name, async () => {
          await checkTestResponse(
            await fetch(env.domain, fetchParams(test.config)),
          );
        });
      });
    } else {
      it(`${env.name} - not a testable environment`, (done) => {
        done();
      });
    }
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

function killServerPool(): void {
  for (const env of testEnvironments) {
    if (typeof env.process.pid !== 'undefined') {
      process.kill(-env.process.pid);
    }
  }
}

async function serverReady(domain: string): Promise<boolean> {
  try {
    const response = await fetch(domain);
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

async function serverPoolReady(): Promise<boolean> {
  const maxAttempts = 5;

  for (const env of testEnvironments) {
    let attempts = 0;
    let ready = false;

    while (!ready && attempts < maxAttempts) {
      attempts++;
      await sleep(100);
      ready = await serverReady(env.domain);
    }
    env.ready = ready;
  }
  return testEnvironments
    .map((env) => env.ready)
    .reduce((prev, curr) => prev && curr, true);
}
