import querystring from 'querystring';

import Shopify from '../../../index-node';
import {
  setAbstractFetchFunc,
  Response,
  Headers,
} from '../../../adapters/abstract-http';
import * as nodeAdapter from '../../../adapters/node-adapter';
import {Context} from '../../../context';
import {DataType} from '../types';
import {HttpClient} from '../http_client';
import {LogSeverity} from '../../../base-types';

setAbstractFetchFunc(nodeAdapter.abstractFetch);

const domain = 'localhost:3000';
const successResponseBody = JSON.stringify({
  message: 'Your HTTP request was successful!',
});

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace jest {
//     /* eslint-disable @typescript-eslint/naming-convention */
//     interface Matchers<R> {
//       toBeWithinSecondsOf(compareDate: number, seconds: number): R;
//       toMatchMadeHttpRequest(): R;
//     }
//     /* eslint-enable @typescript-eslint/naming-convention */
//   }
// }

const originalRetryTime = HttpClient.RETRY_WAIT_TIME;
describe('HTTP client', () => {
  afterAll(() => {
    setRestClientRetryTime(originalRetryTime);

    // kill the test server gracefully
    const client = new HttpClient(domain);
    client.get({path: '/url/path/endtest'});
  });

  it('can make GET request', async () => {
    const client = new HttpClient(domain);

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with type JSON', async () => {
    const client = new HttpClient(domain);

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: postData,
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with type JSON and data is already formatted', async () => {
    const client = new HttpClient(domain);
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: JSON.stringify(postData),
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with zero-length JSON', async () => {
    const client = new HttpClient(domain);
    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: '',
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with form-data type', async () => {
    const client = new HttpClient(domain);
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: postData,
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with form-data type and data is already formatted', async () => {
    const client = new HttpClient(domain);
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: querystring.stringify(postData),
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with GraphQL type', async () => {
    const client = new HttpClient(domain);
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

    const postParams = {
      path: '/url/path',
      type: DataType.GraphQL,
      data: graphqlQuery,
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make PUT request with type JSON', async () => {
    const client = new HttpClient(domain);
    const putData = {
      title: 'Test product',
      amount: 10,
    };

    const putParams = {
      path: '/url/path/123',
      type: DataType.JSON,
      data: putData,
    };

    await expect(client.put(putParams)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make DELETE request', async () => {
    const client = new HttpClient(domain);
    await expect(client.delete({path: '/url/path/123'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('gracefully handles errors', async () => {
    const client = new HttpClient(domain);
    const statusText = 'Did not work';
    const requestId = 'Request id header';

    const testErrorResponse = async (
      code: number | null,
      expectedError: NewableFunction,
      expectRequestId: boolean,
    ) => {
      let caught = false;
      await client.get({path: `/url/path/${code}`}).catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(expectedError);
        if (expectedError === Shopify.Errors.HttpResponseError) {
          expect(error).toHaveProperty('code', code);
          expect(error).toHaveProperty('statusText', statusText);
        }
        if (expectRequestId) {
          expect(error.message).toContain(requestId);
        }
      });

      expect(caught).toEqual(true);
    };

    await testErrorResponse(403, Shopify.Errors.HttpResponseError, true);
    await testErrorResponse(404, Shopify.Errors.HttpResponseError, false);
    await testErrorResponse(429, Shopify.Errors.HttpThrottlingError, true);
    await testErrorResponse(500, Shopify.Errors.HttpInternalError, true);
  });

  it('allows custom headers', async () => {
    const client = new HttpClient(domain);
    const customHeaders = {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      'X-Not-A-Real-Header': 'some_value',
    };

    await expect(
      client.get({path: '/url/path/custom', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
  });

  it('extends User-Agent if it is provided', async () => {
    const client = new HttpClient(domain);

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    let customHeaders: Headers = {'User-Agent': 'My agent'};

    await expect(
      client.get({path: '/url/path/uppercaseua', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    customHeaders = {'user-agent': 'My lowercase agent'};

    await expect(
      client.get({path: '/url/path/lowercaseua', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
  });

  it('extends a User-Agent provided by Context', async () => {
    Context.USER_AGENT_PREFIX = 'Context Agent';
    Context.initialize(Context);

    const client = new HttpClient(domain);

    await expect(client.get({path: '/url/path/contextua'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const customHeaders: Headers = {'User-Agent': 'Headers Agent'};

    await expect(
      client.get({
        path: '/url/path/contextandheadersua',
        extraHeaders: customHeaders,
      }),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
  });

  it('fails with invalid retry count', async () => {
    const client = new HttpClient(domain);

    await expect(
      client.get({path: '/url/path', tries: -1}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpRequestError);
  });

  it('retries failed requests but returns success', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    await expect(
      client.get({path: '/url/path/retries', tries: 3}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
  });

  it('retries failed requests and stops on non-retriable errors', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    await expect(
      client.get({path: '/url/path/retrythenfail', tries: 3}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpResponseError);
  });

  it('stops retrying after reaching the limit', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    await expect(
      client.get({path: '/url/path/maxretries', tries: 3}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpMaxRetriesError);
  });

  it('waits for the amount of time defined by the Retry-After header', async () => {
    // Default to a lot longer than the time we actually expect to sleep for
    setRestClientRetryTime(4000);

    const client = new HttpClient(domain);

    // If we don't retry within an acceptable amount of time, we assume to be paused for longer than Retry-After
    const retryTimeout = setTimeout(() => {
      throw new Error(
        'Request was not retried within the interval defined by Retry-After, test failed',
      );
    }, 4000);

    await expect(
      client.get({path: '/url/path/retrythensuccess', tries: 2}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    clearTimeout(retryTimeout);
  });

  it('logs deprecation headers to the console when they are present', async () => {
    const client = new HttpClient(domain);
    console.warn = jest.fn();
    await client.get({path: '/url/path/deprecatedget'});

    expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
      message: 'This API endpoint has been deprecated',
      path: 'http://localhost:3000/url/path/deprecatedget',
    });

    await client.post({
      path: '/url/path/deprecatedpost',
      type: DataType.JSON,
      data: {query: 'some query'},
    });

    expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
      message: 'This API endpoint has been deprecated',
      path: 'http://localhost:3000/url/path/deprecatedpost',
    });
  });

  it('will wait 5 minutes before logging repeat deprecation alerts', async () => {
    jest.useFakeTimers();

    const client = new HttpClient(domain);
    console.warn = jest.fn();

    // first call should call console.warn
    await client.get({path: '/url/path/deprecatedget'});
    // this one should skip it
    await client.get({path: '/url/path/deprecatedget'});
    // one warn so far
    expect(console.warn).toHaveBeenCalledTimes(1);

    // use jest.fn() to advance time by 5 minutes
    const currentTime = Date.now();
    Date.now = jest.fn(() => currentTime + 300000);

    // should warn a second time since 5 mins have passed
    await client.get({path: '/url/path/deprecatedget'});

    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('writes deprecation notices to log file if one is specified in Context', async () => {
    const logs: [LogSeverity, string][] = [];
    Context.LOG_FUNCTION = async (sev, msg) => {
      logs.push([sev, msg]);
    };
    Context.initialize(Context);

    const client = new HttpClient(domain);

    await client.get({path: '/url/path/deprecatedget'});

    expect(logs[0][1]).toContain('API Deprecation Notice');
    expect(logs[0][1]).toContain(
      ': {"message":"This API endpoint has been deprecated","path":"http://localhost:3000/url/path/deprecatedget"}',
    );
    expect(logs[0][1]).toContain(`Stack Trace: Error:`);
  });

  it('properly encodes strings in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    let caught = false;
    await client
      .get({path: '/url/path/error'})
      .then(() => fail('Expected request to fail'))
      .catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(Shopify.Errors.HttpInternalError);
        expect(error.message).toEqual(
          `Shopify internal error:\n"Something went wrong"`,
        );
      });
    expect(caught).toEqual(true);
  });

  it('properly encodes objects in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    let caught = false;
    await client
      .get({path: '/url/path/detailederror'})
      .then(() => fail('Expected request to fail'))
      .catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(Shopify.Errors.HttpInternalError);
        expect(error.message).toEqual(
          `Shopify internal error:` +
            `\n{` +
            `\n  "title": "Invalid title",` +
            `\n  "description": "Invalid description"` +
            `\n}`,
        );
      });
    expect(caught).toEqual(true);
  });

  it('adds missing slashes to paths', async () => {
    const client = new HttpClient(domain);

    await expect(client.get({path: 'url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('properly formats arrays and hashes in query strings', async () => {
    const client = new HttpClient(domain);

    await client.get({
      path: '/url/path/query',
      query: {
        array: ['a', 'b', 'c'],
        // eslint-disable-next-line id-length
        hash: {a: 'b', c: 'd'},
      },
    });
  });
});

function setRestClientRetryTime(time: number) {
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}

function buildExpectedResponse(body: string): Response {
  const expectedResponse: Partial<Response> = {
    headers: expect.objectContaining({}),
    body: JSON.parse(body),
  };

  return expect.objectContaining(expectedResponse);
}
