import * as child_process from 'child_process';
import fetch from 'node-fetch';
import {DataType} from '../../../types';

import {ExpectedResponse, TestConfig} from './test_config';
import ProcessedQuery from '../../../../../utils/processed-query';

/* eslint-disable-next-line no-undef */
// const jest = require('jest');

const testAppServer: string = "http://localhost:8787";

const miniflareServer: child_process.ChildProcess = child_process.spawn(
  'yarn', [
    'miniflare',
    '-e',
    'src/clients/http_client/__e2etests__/experiments/framework/.env.test',
    '--global',
    'E2ETESTS=1',
    '--modules',
    'bundle/test-cf-worker-app.js',
  ],
  {
    detached: true,
  },
);
// miniflareServer.stdout?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.log(` miniflare: ${trimmedOutput}`);
// });

// miniflareServer.stderr?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.error(` miniflare: ${trimmedOutput}`);
// });

// miniflareServer.on('close', (code) => {
//   console.log(`miniflare exited with code ${code}`);
// });

const httpServer: child_process.ChildProcess = child_process.spawn(
  'yarn',
  [
    'node',
    'dist/clients/http_client/__e2etests__/experiments/framework/http_server.js',
  ],
  {
    detached: true,
  }
);
// httpServer.stdout?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.log(`httpServer: ${trimmedOutput}`);
// });

// httpServer.stderr?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.error(`httpServer: ${trimmedOutput}`);
// });

// httpServer.on('close', (code) => {
//   console.log(`httpServer process exited with code ${code}`);
// });

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('CF Worker HTTP client', () => {
  const expectedSuccessResponse: ExpectedResponse = {
    statusCode: 200,
    statusText: 'OK',
    body: JSON.stringify({
      message: 'Your HTTP request was successful!',
    }),
  };

  beforeAll(async () => {
    await sleep(3000);
  });

  afterAll(async () => {
    await sleep(1000);
    await killChildProcesses();
  });

  it('can make GET request', async () => {
    const getTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path',
        headers: {},
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(getTest)));
  });

  it('can make POST request with type JSON', async () => {
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(postData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
  });

  it('can make POST request with type JSON and data is already formatted', async () => {
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(JSON.stringify(postData)),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
  });

  it('can make POST request with zero-length JSON', async () => {
    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(''),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
  });

  it('can make POST request with form-data type', async () => {
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.URLEncoded,
        body: JSON.stringify(postData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
  });

  it('can make POST request with form-data type and data is already formatted', async () => {
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.URLEncoded,
        body: ProcessedQuery.stringify(postData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
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
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.GraphQL,
        body: graphqlQuery,
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(postTest)));
  });


  it('can make PUT request with type JSON', async () => {
    const putData = {
      title: 'Test product',
      amount: 10,
    };

    const putTest: TestConfig = {
      testRequest: {
        method: 'put',
        url: '/url/path/123',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(putData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(putTest)));
  });

  it('can make DELETE request', async () => {
    const deleteTest: TestConfig = {
      testRequest: {
        method: 'delete',
        url: '/url/path/123',
        headers: {},
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(deleteTest)));
  });

  it('gracefully handles 403 error', async () => {
    const fourZeroThreeTestConfig: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/403',
        headers: {},
      },
      expectedResponse: {
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
        expectRequestId: 'Request id header',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(fourZeroThreeTestConfig)));
  });

  it('gracefully handles 404 error', async () => {
    const fourZeroFourTestConfig: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/404',
        headers: {},
      },
      expectedResponse: {
        statusCode: 404,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(fourZeroFourTestConfig)));
  });

  it('gracefully handles 429 error', async () => {
    const fourTwoNineTestConfig: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/429',
        headers: {},
      },
      expectedResponse: {
        statusCode: 429,
        statusText: 'Did not work',
        errorType: 'HttpThrottlingError',
        expectRequestId: 'Request id header',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(fourTwoNineTestConfig)));
  });


  it('gracefully handles 500 error', async () => {
    const fourTwoNineTestConfig: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/500',
        headers: {},
      },
      expectedResponse: {
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        expectRequestId: 'Request id header',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(fourTwoNineTestConfig)));
  });

  it('allows custom headers', async () => {
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    const customHeaders = {
      'X-Not-A-Real-Header': 'some_value',
    };
    const customHeaderTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path',
        headers: customHeaders,
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(customHeaderTest)));
  });

  it('extends User-Agent if it is provided (capitalized)', async () => {
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    const customHeaders = {'User-Agent': 'My agent'};
    const extendUATest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/uppercaseua',
        headers: customHeaders,
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(extendUATest)));
  });

  it('extends User-Agent if it is provided (lowercase)', async () => {
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    const customHeaders = {'user-agent': 'My lowercase agent'};
    const extendUATest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/lowercaseua',
        headers: customHeaders,
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(extendUATest)));
  });

  it.skip('extends a User-Agent provided by Context', async () => {
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: implement this test
    // Context.USER_AGENT_PREFIX = 'Context Agent';
    // Context.initialize(Context);

    // response = await client.get({path: '/url/path/contextua'});
    // const contextuaPassed =
    //   JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    // customHeaders = {'User-Agent': 'Headers Agent'};

    // response = await client.get({
    //   path: '/url/path/contextandheadersua',
    //   extraHeaders: customHeaders,
    // });
    // const contextandheadersuaPassed =
    //   JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    // allPassed = allPassed && contextuaPassed && contextandheadersuaPassed;
  });

  it('fails with invalid retry count', async () => {
    const invalidRetryCountTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path',
        headers: {},
        tries: -1,
      },
      expectedResponse: {
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpRequestError',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(invalidRetryCountTest)));
  });

  it('retries failed requests but returns success', async () => {
    const retryThenSuccessTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/retries',
        headers: {},
        tries: 3,
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(retryThenSuccessTest)));
  });

  it('retries failed requests and stops on non-retriable errors', async () => {
    const retryThenFailTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/retrythenfail',
        headers: {},
        tries: 3,
      },
      expectedResponse: {
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(retryThenFailTest)));
  });

  it('stops retrying after reaching the limit', async () => {
    const maxRetriesTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/maxretries',
        headers: {},
        tries: 3,
      },
      expectedResponse: {
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpMaxRetriesError',
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(maxRetriesTest)));
  });

  it.skip('waits for the amount of time defined by the Retry-After header', async () => {
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: implement this test
    // Default to a lot longer than the time we actually expect to sleep for
    // setRestClientRetryTime(4000);

    // If we don't retry within an acceptable amount of time, we assume to be paused for longer than Retry-After
    /* eslint-disable-next-line no-undef */
    // const retryTimeout = setTimeout(() => {
    // throw new Error(
    //   '18. Request was not retried within the interval defined by Retry-After, test failed',
    // );
    // }, 4000);

    // response = await client.get({path: '/url/path/retrythensuccess', tries: 2});
    // allPassed =
    // allPassed &&
    // JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    // logResultToConsole(
    // '18. waits for the amount of time defined by the Retry-After header',
    // JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    // );
    // /* eslint-disable-next-line no-undef */
    // clearTimeout(retryTimeout);
  });

  it.skip('logs deprecation headers to the console when they are present', async () => {
    //   console.warn = jest.fn();
    //   await client.get({path: '/url/path/deprecatedget'});

    //   expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
    //     message: 'This API endpoint has been deprecated',
    //     path: 'http://localhost:3000/url/path/deprecatedget',
    //   });

    //   await client.post({
    //     path: '/url/path/deprecatedpost',
    //     type: DataType.JSON,
    //     data: {query: 'some query'},
    //   });

    //   expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
    //     message: 'This API endpoint has been deprecated',
    //     path: 'http://localhost:3000/url/path/deprecatedpost',
    //   });
  });


  it.skip('will wait 5 minutes before logging repeat deprecation alerts', async () => {
    //   jest.useFakeTimers();
    //   console.warn = jest.fn();

    //   // first call should call console.warn
    //   await client.get({path: '/url/path/deprecatedget'});
    //   // this one should skip it
    //   await client.get({path: '/url/path/deprecatedget'});
    //   // one warn so far
    //   expect(console.warn).toHaveBeenCalledTimes(1);

    //   // use jest.fn() to advance time by 5 minutes
    //   const currentTime = Date.now();
    //   Date.now = jest.fn(() => currentTime + 300000);

    //   // should warn a second time since 5 mins have passed
    //   await client.get({path: '/url/path/deprecatedget'});

    //   expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it.skip('writes deprecation notices to log file if one is specified in Context', async () => {
    // const logs = [];
    // /* eslint-disable-next-line require-await */
    // Context.LOG_FUNCTION = async (sev, msg) => {
    //   logs.push([sev, msg]);
    // };
    // Context.initialize(Context);

    // await client.get({path: '/url/path/deprecatedget'});

    // // console.log(logs);
    // const includesNotice = logs[0][1].includes('API Deprecation Notice');
    // const includesMessage = logs[0][1].includes(
    //   ': {"message":"This API endpoint has been deprecated","path":"http://localhost:3000/url/path/deprecatedget"}',
    // );
    // const includesStackTrack = logs[0][1].includes(`Stack Trace: Error`);
    // allPassed =
    //   allPassed && includesNotice && includesMessage && includesStackTrack;
  });

  it('properly encodes strings in the error message', async () => {
    const errorMessageTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/error',
        headers: {},
      },
      expectedResponse: {
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage: `Shopify internal error:\n"Something went wrong"`,
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(errorMessageTest)));
  });

  it('properly encodes objects in the error message', async () => {
    const detailedErrorMessageTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/detailederror',
        headers: {},
      },
      expectedResponse: {
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage: `Shopify internal error:` +
          `\n{` +
          `\n  "title": "Invalid title",` +
          `\n  "description": "Invalid description"` +
          `\n}`,
      },
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(detailedErrorMessageTest)));
  });

  it('adds missing slashes to paths', async () => {
    const missingSlashesTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: 'url/path',
        headers: {},
      },
      expectedResponse: expectedSuccessResponse,
    };

    checkTestResponse(await fetch(testAppServer, fetchParams(missingSlashesTest)));
  });

  it('properly formats arrays and hashes in query strings', async () => {
    const formatsArraysHashesTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path/query',
        headers: {},
        query: JSON.stringify({
          array: ['a', 'b', 'c'],
          hash: {a: 'b', c: 'd'},
        }),
      },
      expectedResponse: expectedSuccessResponse,
    };
    checkTestResponse(await fetch(testAppServer, fetchParams(formatsArraysHashesTest)));
  });
});

function fetchParams(testConfig: TestConfig): any {
  return {
    method: 'post',
    body: JSON.stringify(testConfig),
    headers: { 'Content-Type': 'application/json' }
  }
}

async function checkTestResponse(response: any): Promise<void> {
  try {
    expect(response.status).toEqual(200);
  } catch (err) {
    const responseBody = await response.json();
    err.message = `${err.message}\nfailing test debug: ${JSON.stringify(responseBody, undefined, 2)}`;
    throw err;
  }
}

async function killChildProcesses(): Promise<void> {
  if (typeof httpServer.pid !== 'undefined' ) {
    process.kill(-httpServer.pid);
  }
  if (typeof miniflareServer.pid !== 'undefined' ) {
    process.kill(-miniflareServer.pid);
  }
}