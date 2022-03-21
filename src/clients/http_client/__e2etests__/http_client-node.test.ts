import querystring from 'querystring';
import fs from 'fs';

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

setAbstractFetchFunc(nodeAdapter.abstractFetch);

const domain = 'localhost:3000';
const successResponseBody = JSON.stringify({
  message: 'Your HTTP request was successful!',
});
// let server: ChildProcess;
const logFilePath = `${process.cwd()}/src/clients/http_client/__e2etests__/test_logs.txt`;
let responses: Response[] = [];
queueMockResponse(successResponseBody);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/naming-convention */
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

const originalRetryTime = HttpClient.RETRY_WAIT_TIME;
describe('HTTP client', () => {
  afterEach(() => {
    responses = [];

    fs.writeFileSync(logFilePath, '');
  });

  afterAll(() => {
    setRestClientRetryTime(originalRetryTime);
    fs.writeFileSync(logFilePath, '');

    // kill the test server gracefully
    const client = new HttpClient(domain);
    client.get({path: '/url/path/endtest'});
  });

  it('validates the given domain', () => {
    expect(() => new HttpClient('invalid domain')).toThrow(
      Shopify.Errors.InvalidShopError,
    );
  });

  it('can make GET request', async () => {
    const client = new HttpClient(domain);

    queueMockResponse(successResponseBody);

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
  });

  it('can make POST request with type JSON', async () => {
    const client = new HttpClient(domain);

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

    queueMockResponse(successResponseBody);

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

        // expect({
        //   method: 'GET',
        //   domain,
        //   path: '/url/path',
        // }).toMatchMadeHttpRequest();
      });

      expect(caught).toEqual(true);
    };

    buildMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 403, statusText, headers: {'x-request-id': requestId}},
      ],
      [JSON.stringify({}), {statusCode: 404, statusText, headers: {}}],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 429, statusText, headers: {'x-request-id': requestId}},
      ],
      [
        JSON.stringify({}),
        {statusCode: 500, statusText, headers: {'x-request-id': requestId}},
      ],
    );

    await testErrorResponse(403, Shopify.Errors.HttpResponseError, true);
    await testErrorResponse(404, Shopify.Errors.HttpResponseError, false);
    await testErrorResponse(429, Shopify.Errors.HttpThrottlingError, true);
    await testErrorResponse(500, Shopify.Errors.HttpInternalError, true);

    // FIXME
    // fetchMock.mockRejectOnce(() => Promise.reject());
    // await testErrorResponse(null, Shopify.Errors.HttpRequestError, false);
  });

  it('allows custom headers', async () => {
    const client = new HttpClient(domain);

    const customHeaders = {
      'X-Not-A-Real-Header': 'some_value',
    };

    queueMockResponse(successResponseBody);

    await expect(
      client.get({path: '/url/path/custom', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   headers: customHeaders,
    // }).toMatchMadeHttpRequest();
  });

  // FIXME: Disabled test as `toMatchMadeHttpRequest` doesn’t handle
  // `containsString()` matchers
  it('extends User-Agent if it is provided', async () => {
    const client = new HttpClient(domain);

    let customHeaders: Headers = {'User-Agent': 'My agent'};
    queueMockResponse(successResponseBody);

    await expect(
      client.get({path: '/url/path/uppercaseua', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   headers: {
    //     'User-Agent': expect.stringContaining(
    //       'My agent | Shopify API Library v',
    //     ),
    //   },
    // }).toMatchMadeHttpRequest();

    customHeaders = {'user-agent': 'My lowercase agent'};

    queueMockResponse(successResponseBody);

    await expect(
      client.get({path: '/url/path/lowercaseua', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   headers: {
    //     'User-Agent': expect.stringContaining(
    //       'My lowercase agent | Shopify API Library v',
    //     ),
    //   },
    // }).toMatchMadeHttpRequest();
  });

  // FIXME: Disabled test as `toMatchMadeHttpRequest` doesn’t handle
  // `containsString()` matchers
  it('extends a User-Agent provided by Context', async () => {
    Context.USER_AGENT_PREFIX = 'Context Agent';
    Context.initialize(Context);

    const client = new HttpClient(domain);

    queueMockResponse(successResponseBody);
    queueMockResponse(successResponseBody);

    await expect(client.get({path: '/url/path/contextua'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   headers: {
    //     'User-Agent': expect.stringContaining(
    //       'Context Agent | Shopify API Library v',
    //     ),
    //   },
    // }).toMatchMadeHttpRequest();

    const customHeaders: Headers = {'User-Agent': 'Headers Agent'};

    await expect(
      client.get({
        path: '/url/path/contextandheadersua',
        extraHeaders: customHeaders,
      }),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   headers: {
    //     'User-Agent': expect.stringContaining(
    //       'Headers Agent | Context Agent | Shopify API Library v',
    //     ),
    //   },
    // }).toMatchMadeHttpRequest();
  });

  it('fails with invalid retry count', async () => {
    const client = new HttpClient(domain);

    queueMockResponse(successResponseBody);

    await expect(
      client.get({path: '/url/path', tries: -1}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpRequestError);
  });

  it('retries failed requests but returns success', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    buildMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 429, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 429, statusText: 'Did not work'},
      ],
      [successResponseBody, {statusCode: 200}],
    );

    await expect(
      client.get({path: '/url/path/retries', tries: 3}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   tries: 3,
    // }).toMatchMadeHttpRequest();
  });

  it('retries failed requests and stops on non-retriable errors', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    buildMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 403, statusText: 'Did not work'},
      ],
      [successResponseBody, {statusCode: 200}],
    );

    await expect(
      client.get({path: '/url/path/retrythenfail', tries: 3}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpResponseError);
    // The second call resulted in a non-retriable error
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   tries: 2,
    // }).toMatchMadeHttpRequest();
  });

  it('stops retrying after reaching the limit', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    buildMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
    );

    await expect(
      client.get({path: '/url/path/maxretries', tries: 3}),
    ).rejects.toBeInstanceOf(Shopify.Errors.HttpMaxRetriesError);
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   tries: 3,
    // }).toMatchMadeHttpRequest();
  });

  it('waits for the amount of time defined by the Retry-After header', async () => {
    // Default to a lot longer than the time we actually expect to sleep for
    setRestClientRetryTime(4000);
    const realWaitTime = 0.05;

    const client = new HttpClient(domain);

    buildMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {
          statusCode: 429,
          statusText: 'Did not work',
          headers: {'Retry-After': realWaitTime.toString()},
        },
      ],
      [successResponseBody, {statusCode: 200}],
    );

    // If we don't retry within an acceptable amount of time, we assume to be paused for longer than Retry-After
    const retryTimeout = setTimeout(() => {
      throw new Error(
        'Request was not retried within the interval defined by Retry-After, test failed',
      );
    }, 4000);

    await expect(
      client.get({path: '/url/path/retrythensuccess', tries: 2}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));
    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   tries: 2,
    // }).toMatchMadeHttpRequest();
    clearTimeout(retryTimeout);
  });

  it('logs deprecation headers to the console when they are present', async () => {
    const client = new HttpClient(domain);
    console.warn = jest.fn();

    buildMockResponses(
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          statusCode: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
      [
        JSON.stringify({
          message: 'Some deprecated post request',
          body: {
            query: 'some query',
          },
        }),
        {
          statusCode: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
    );

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

    buildMockResponses(
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          statusCode: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          statusCode: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          statusCode: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
    );
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
    Context.LOG_FILE = logFilePath;
    Context.initialize(Context);

    const client = new HttpClient(domain);

    queueMockResponse(
      JSON.stringify({
        message: 'Some deprecated request',
      }),
      {
        statusCode: 200,
        headers: {
          'X-Shopify-API-Deprecated-Reason':
            'This API endpoint has been deprecated',
        },
      },
    );

    await client.get({path: '/url/path/deprecatedget'});

    // open and read test log file
    const fileContent = fs.readFileSync(logFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    });

    expect(fileContent).toContain('API Deprecation Notice');
    expect(fileContent).toContain(
      ': {"message":"This API endpoint has been deprecated","path":"http://localhost:3000/url/path/deprecatedget"}',
    );
    expect(fileContent).toContain(`Stack Trace: Error:`);
  });

  it('properly encodes strings in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    buildMockResponses([
      JSON.stringify({errors: 'Something went wrong'}),
      {statusCode: 500, statusText: 'Did not work'},
    ]);

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
    // expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('properly encodes objects in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    buildMockResponses([
      JSON.stringify({
        errors: {title: 'Invalid title', description: 'Invalid description'},
      }),
      {statusCode: 500, statusText: 'Did not work'},
    ]);

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
    // expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('adds missing slashes to paths', async () => {
    const client = new HttpClient(domain);

    queueMockResponse(successResponseBody);

    await expect(client.get({path: 'url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    // expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('properly formats arrays and hashes in query strings', async () => {
    queueMockResponse(JSON.stringify({}));
    const client = new HttpClient(domain);

    await client.get({
      path: '/url/path/query',
      query: {
        array: ['a', 'b', 'c'],
        // eslint-disable-next-line id-length
        hash: {a: 'b', c: 'd'},
      },
    });

    // expect({
    //   method: 'GET',
    //   domain,
    //   path: '/url/path',
    //   query: encodeURI('array[]=a&array[]=b&array[]=c&hash[a]=b&hash[c]=d'),
    // }).toMatchMadeHttpRequest();
  });
});

function setRestClientRetryTime(time: number) {
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}

function queueMockResponse(body: string, partial: Partial<Response> = {}) {
  responses.push({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}

function buildMockResponses(
  ...responses: Parameters<typeof queueMockResponse>[]
) {
  for (const [body, response] of responses) {
    queueMockResponse(body, response);
  }
}

function buildExpectedResponse(body: string): Response {
  const expectedResponse: Partial<Response> = {
    headers: expect.objectContaining({}),
    body: JSON.parse(body),
  };

  return expect.objectContaining(expectedResponse);
}
