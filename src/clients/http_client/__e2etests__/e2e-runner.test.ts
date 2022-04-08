import * as child_process from 'child_process';

import fetch from 'node-fetch';

import {DataType} from '../../../types';
import ProcessedQuery from '../../../utils/processed-query';

import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

const nodeAppPort = '6666';
const nodeAppDomain = `http://localhost:${nodeAppPort}`;
const cfWorkerAppPort = '7777';
const cfWorkerAppDomain = `http://localhost:${cfWorkerAppPort}`;
const httpServerPort = '9999';
const httpServerDomain = `http://localhost:${httpServerPort}`;

const nodeAppServer: child_process.ChildProcess = child_process.spawn(
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
    stdio: 'inherit',
  },
);

const miniflareAppServer: child_process.ChildProcess = child_process.spawn(
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
    stdio: 'inherit',
  },
);

const httpServer: child_process.ChildProcess = child_process.spawn(
  'yarn',
  ['node', 'dist/clients/http_client/__e2etests__/http_server.js'],
  {
    env: {
      ...process.env, // eslint-disable-line no-process-env
      HTTP_SERVER_PORT: httpServerPort,
    },
    detached: true,
    stdio: 'inherit',
  },
);

const testEnvironments = [
  {
    name: 'NodeJS',
    appServer: nodeAppDomain,
  },
  {
    name: 'CF Worker',
    appServer: cfWorkerAppDomain,
  },
];
const maxEnvironments = testEnvironments.length;
let environmentCount = 0;

testEnvironments.forEach((env) => {
  describe(`${env.name} HTTP client`, () => {
    beforeAll(async () => {
      if (environmentCount === 0) {
        // first time through - wait for processes to be ready
        const maxAttempts = 20;
        let attempts = 0;
        let httpSrvrReady = false;
        let nodeAppReady = false;
        let cfWorkerReady = false;

        while (
          !(httpSrvrReady && nodeAppReady && cfWorkerReady) &&
          attempts < maxAttempts
        ) {
          attempts++;
          await sleep(100);
          if (!(cfWorkerReady = await serverReady(cfWorkerAppDomain))) continue;
          if (!(httpSrvrReady = await serverReady(httpServerDomain))) continue;
          if (!(nodeAppReady = await serverReady(nodeAppDomain))) continue;
        }
      }
      environmentCount++;
    });

    afterAll(async () => {
      // if we've finished last test cycle, shut down processes
      if (environmentCount === maxEnvironments) killChildProcesses();
    });

    it('can make GET request', async () => {
      const getTest: TestConfig = {
        testRequest: initTestRequest(),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(getTest)));
    });

    it('can make POST request with type JSON', async () => {
      const postData = {
        title: 'Test product',
        amount: 10,
      };

      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.JSON,
          body: JSON.stringify(postData),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make POST request with type JSON and data is already formatted', async () => {
      const postData = {
        title: 'Test product',
        amount: 10,
      };

      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.JSON,
          body: JSON.stringify(JSON.stringify(postData)),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make POST request with zero-length JSON', async () => {
      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.JSON,
          body: JSON.stringify(''),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make POST request with form-data type', async () => {
      const postData = {
        title: 'Test product',
        amount: 10,
      };

      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.URLEncoded,
          body: JSON.stringify(postData),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make POST request with form-data type and data is already formatted', async () => {
      const postData = {
        title: 'Test product',
        amount: 10,
      };

      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.URLEncoded,
          body: ProcessedQuery.stringify(postData),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make POST request with GraphQL type', async () => {
      const graphqlQuery = `
        query {
          webhookSubscriptions(first:5) {
            edges {
              node {
                id
                endpoint
              }
            }
          }
        }
      `;

      const postTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'post',
          bodyType: DataType.GraphQL,
          body: graphqlQuery,
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(postTest)));
    });

    it('can make PUT request with type JSON', async () => {
      const putData = {
        title: 'Test product',
        amount: 10,
      };

      const putTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'put',
          url: '/url/path/123',
          bodyType: DataType.JSON,
          body: JSON.stringify(putData),
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(putTest)));
    });

    it('can make DELETE request', async () => {
      const deleteTest: TestConfig = {
        testRequest: initTestRequest({
          method: 'delete',
          url: '/url/path/123',
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(deleteTest)));
    });

    it('gracefully handles 403 error', async () => {
      const fourZeroThreeTestConfig: TestConfig = {
        testRequest: initTestRequest({url: '/url/path/403'}),
        expectedResponse: {
          statusCode: 403,
          statusText: 'Did not work',
          errorType: 'HttpResponseError',
          expectRequestId: 'Request id header',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(fourZeroThreeTestConfig)),
      );
    });

    it('gracefully handles 404 error', async () => {
      const fourZeroFourTestConfig: TestConfig = {
        testRequest: initTestRequest({url: '/url/path/404'}),
        expectedResponse: {
          statusCode: 404,
          statusText: 'Did not work',
          errorType: 'HttpResponseError',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(fourZeroFourTestConfig)),
      );
    });

    it('gracefully handles 429 error', async () => {
      const fourTwoNineTestConfig: TestConfig = {
        testRequest: initTestRequest({url: '/url/path/429'}),
        expectedResponse: {
          statusCode: 429,
          statusText: 'Did not work',
          errorType: 'HttpThrottlingError',
          expectRequestId: 'Request id header',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(fourTwoNineTestConfig)),
      );
    });

    it('gracefully handles 500 error', async () => {
      const fourTwoNineTestConfig: TestConfig = {
        testRequest: initTestRequest({url: '/url/path/500'}),
        expectedResponse: {
          statusCode: 500,
          statusText: 'Did not work',
          errorType: 'HttpInternalError',
          expectRequestId: 'Request id header',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(fourTwoNineTestConfig)),
      );
    });

    it('allows custom headers', async () => {
      /* eslint-disable-next-line no-warning-comments */
      // FIXME: change http_server.js to check that the headers were actually sent across
      const customHeaderTest: TestConfig = {
        testRequest: initTestRequest({
          headers: {'X-Not-A-Real-Header': 'some_value'}, // eslint-disable-line @typescript-eslint/naming-convention
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(customHeaderTest)),
      );
    });

    it('extends User-Agent if it is provided (capitalized)', async () => {
      /* eslint-disable-next-line no-warning-comments */
      // FIXME: change http_server.js to check that the headers were actually sent across
      const extendUATest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/uppercaseua',
          headers: {'User-Agent': 'My agent'}, // eslint-disable-line @typescript-eslint/naming-convention
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(extendUATest)));
    });

    it('extends User-Agent if it is provided (lowercase)', async () => {
      /* eslint-disable-next-line no-warning-comments */
      // FIXME: change http_server.js to check that the headers were actually sent across
      const extendUATest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/lowercaseua',
          headers: {'user-agent': 'My lowercase agent'}, // eslint-disable-line @typescript-eslint/naming-convention
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(await fetch(env.appServer, fetchParams(extendUATest)));
    });

    it('fails with invalid retry count', async () => {
      const invalidRetryCountTest: TestConfig = {
        testRequest: initTestRequest({tries: -1}),
        expectedResponse: {
          statusCode: 500,
          statusText: 'Did not work',
          errorType: 'HttpRequestError',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(invalidRetryCountTest)),
      );
    });

    it('retries failed requests but returns success', async () => {
      const retryThenSuccessTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/retries',
          tries: 3,
          retryTimeoutTimer: 0,
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(retryThenSuccessTest)),
      );
    });

    it('retries failed requests and stops on non-retriable errors', async () => {
      const retryThenFailTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/retrythenfail',
          tries: 3,
          retryTimeoutTimer: 0,
        }),
        expectedResponse: {
          statusCode: 403,
          statusText: 'Did not work',
          errorType: 'HttpResponseError',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(retryThenFailTest)),
      );
    });

    it('stops retrying after reaching the limit', async () => {
      const maxRetriesTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/maxretries',
          tries: 3,
          retryTimeoutTimer: 0,
        }),
        expectedResponse: {
          statusCode: 500,
          statusText: 'Did not work',
          errorType: 'HttpMaxRetriesError',
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(maxRetriesTest)),
      );
    });

    it('waits for the amount of time defined by the Retry-After header', async () => {
      const retryHeaderTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/retrythensuccess',
          tries: 2,
          retryTimeoutTimer: 3000,
        }),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(retryHeaderTest)),
      );
    });

    it('properly encodes strings in the error message', async () => {
      const errorMessageTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/error',
          retryTimeoutTimer: 0,
        }),
        expectedResponse: {
          statusCode: 500,
          statusText: 'Did not work',
          errorType: 'HttpInternalError',
          errorMessage: `Shopify internal error:\n"Something went wrong"`,
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(errorMessageTest)),
      );
    });

    it('properly encodes objects in the error message', async () => {
      const detailedErrorMessageTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/detailederror',
          retryTimeoutTimer: 0,
        }),
        expectedResponse: {
          statusCode: 500,
          statusText: 'Did not work',
          errorType: 'HttpInternalError',
          errorMessage:
            `Shopify internal error:` +
            `\n{` +
            `\n  "title": "Invalid title",` +
            `\n  "description": "Invalid description"` +
            `\n}`,
        },
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(detailedErrorMessageTest)),
      );
    });

    it('adds missing slashes to paths', async () => {
      const missingSlashesTest: TestConfig = {
        testRequest: initTestRequest({url: 'url/path'}),
        expectedResponse: initExpectedResponse(),
      };

      checkTestResponse(
        await fetch(env.appServer, fetchParams(missingSlashesTest)),
      );
    });

    it('properly formats arrays and hashes in query strings', async () => {
      const formatsArraysHashesTest: TestConfig = {
        testRequest: initTestRequest({
          url: '/url/path/query',
          query: JSON.stringify({
            array: ['a', 'b', 'c'],
            // eslint-disable-next-line id-length
            hash: {a: 'b', c: 'd'},
          }),
        }),
        expectedResponse: initExpectedResponse(),
      };
      checkTestResponse(
        await fetch(env.appServer, fetchParams(formatsArraysHashesTest)),
      );
    });
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

function killChildProcesses(): void {
  if (typeof httpServer.pid !== 'undefined') {
    process.kill(-httpServer.pid);
  }
  if (typeof nodeAppServer.pid !== 'undefined') {
    process.kill(-nodeAppServer.pid);
  }
  if (typeof miniflareAppServer.pid !== 'undefined') {
    process.kill(-miniflareAppServer.pid);
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

function initTestRequest(options?: Partial<TestRequest>): TestRequest {
  const defaults = {
    method: 'get',
    url: '/url/path',
    headers: {},
  };
  return {
    ...defaults,
    ...options,
  };
}

function initExpectedResponse(
  options?: Partial<ExpectedResponse>,
): ExpectedResponse {
  const defaults = {
    statusCode: 200,
    statusText: 'OK',
    body: JSON.stringify({
      message: 'Your HTTP request was successful!',
    }),
  };

  return {
    ...defaults,
    ...options,
  };
}
