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
    // stdio: 'inherit',
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
    // stdio: 'inherit',
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
    // stdio: 'inherit',
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

const postData = {
  title: 'Test product',
  amount: 10,
};

const putData = {
  title: 'Test product',
  amount: 10,
};

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

const testSuite = [
  {
    name: 'can make GET request',
    config: {
      testRequest: initTestRequest(),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with type JSON',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(postData),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with type JSON and data is already formatted',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(JSON.stringify(postData)),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with zero-length JSON',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(''),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with form-data type',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.URLEncoded,
        body: JSON.stringify(postData),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with form-data type and data is already formatted',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.URLEncoded,
        body: ProcessedQuery.stringify(postData),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make POST request with GraphQL type',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.GraphQL,
        body: graphqlQuery,
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make PUT request with type JSON',
    config: {
      testRequest: initTestRequest({
        method: 'put',
        url: '/url/path/123',
        bodyType: DataType.JSON,
        body: JSON.stringify(putData),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'can make DELETE request',
    config: {
      testRequest: initTestRequest({
        method: 'delete',
        url: '/url/path/123',
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'gracefully handles 403 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/403'}),
      expectedResponse: initExpectedResponse({
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'gracefully handles 404 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/404'}),
      expectedResponse: initExpectedResponse({
        statusCode: 404,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      }),
    },
  },
  {
    name: 'gracefully handles 429 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/429'}),
      expectedResponse: initExpectedResponse({
        statusCode: 429,
        statusText: 'Did not work',
        errorType: 'HttpThrottlingError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'gracefully handles 500 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/500'}),
      expectedResponse: initExpectedResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'allows custom headers',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/custom',
        headers: {'X-Not-A-Real-Header': 'some_value'}, // eslint-disable-line @typescript-eslint/naming-convention
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'extends User-Agent if it is provided (capitalized)',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/uppercaseua',
        headers: {'User-Agent': 'My agent'}, // eslint-disable-line @typescript-eslint/naming-convention
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'extends User-Agent if it is provided (lowercase)',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/lowercaseua',
        headers: {'user-agent': 'My lowercase agent'}, // eslint-disable-line @typescript-eslint/naming-convention
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'fails with invalid retry count',
    config: {
      testRequest: initTestRequest({tries: -1}),
      expectedResponse: initExpectedResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpRequestError',
      }),
    },
  },
  {
    name: 'retries failed requests but returns success',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retries',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'retries failed requests and stops on non-retriable errors',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retrythenfail',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initExpectedResponse({
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      }),
    },
  },
  {
    name: 'stops retrying after reaching the limit',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/maxretries',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initExpectedResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpMaxRetriesError',
      }),
    },
  },
  {
    name: 'waits for the amount of time defined by the Retry-After header',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retrythensuccess',
        tries: 2,
        retryTimeoutTimer: 3000,
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'properly encodes strings in the error message',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/error',
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initExpectedResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage: `Shopify internal error:\n"Something went wrong"`,
      }),
    },
  },
  {
    name: 'properly encodes objects in the error message',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/detailederror',
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initExpectedResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage:
          `Shopify internal error:` +
          `\n{` +
          `\n  "title": "Invalid title",` +
          `\n  "description": "Invalid description"` +
          `\n}`,
      }),
    },
  },
  {
    name: 'adds missing slashes to paths',
    config: {
      testRequest: initTestRequest({url: 'url/path'}),
      expectedResponse: initExpectedResponse(),
    },
  },
  {
    name: 'properly formats arrays and hashes in query strings',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/query',
        query: JSON.stringify({
          array: ['a', 'b', 'c'],
          // eslint-disable-next-line id-length
          hash: {a: 'b', c: 'd'},
        }),
      }),
      expectedResponse: initExpectedResponse(),
    },
  },
];

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

    testSuite.forEach((test) => {
      it(test.name, async () => {
        await checkTestResponse(
          await fetch(env.appServer, fetchParams(test.config)),
        );
      });
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
