import querystring from 'querystring';

<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
import {HttpClient} from '../http_client';
import {DataType, HeaderParams, RequestReturn} from '../../types';
import * as ShopifyErrors from '../../../error';
import {Context} from '../../../context';

const domain = 'test-shop.myshopify.io';
const successResponse = {message: 'Your HTTP request was successful!'};
const logFilePath = `${process.cwd()}/src/clients/http_client/__tests__/test_logs.txt`;
=======
import Shopify from '../../../adapters/node';
import {setAbstractFetchFunc, Response, Headers} from '../../../runtime/http';
import * as mockAdapter from '../../../adapters/mock';
import {Context} from '../../../context';
import {DataType} from '../types';
import {HttpClient} from '../http_client';
import {LogSeverity} from '../../../base-types';

setAbstractFetchFunc(mockAdapter.abstractFetch);

const domain = 'test-shop.myshopify.io';
const successResponseBody = JSON.stringify({
  message: 'Your HTTP request was successful!',
});
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts

const originalRetryTime = HttpClient.RETRY_WAIT_TIME;
describe('HTTP client', () => {
  beforeEach(() => {
<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
    fs.writeFileSync(logFilePath, '');
=======
    mockAdapter.reset();
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts
  });

  afterAll(() => {
    setRestClientRetryTime(originalRetryTime);
  });

  it('validates the given domain', () => {
    expect(() => new HttpClient('invalid domain')).toThrow(
      ShopifyErrors.InvalidShopError,
    );
  });

  it('can make GET request', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('can make POST request with type JSON', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with type JSON and data is already formatted', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with zero-length JSON', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: '',
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form-data type', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: new URLSearchParams(postData as any).toString(),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form-data type and data is already formatted', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: querystring.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with GraphQL type', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.GraphQL.toString()},
      data: graphqlQuery,
    }).toMatchMadeHttpRequest();
  });

  it('can make PUT request with type JSON', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

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
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'PUT',
      domain,
      path: '/url/path/123',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(putData),
    }).toMatchMadeHttpRequest();
  });

  it('can make DELETE request', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.delete({path: '/url/path/123'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'DELETE',
      domain,
      path: '/url/path/123',
    }).toMatchMadeHttpRequest();
  });

  it('gracefully handles errors', async () => {
    const client = new HttpClient(domain);

    const statusText = 'Did not work';
    const requestId = 'Request id header';

    const testErrorResponse = async (
      status: number | null,
      expectedError: NewableFunction,
      expectRequestId: boolean,
    ) => {
      let caught = false;
      await client.get({path: '/url/path'}).catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(expectedError);
        if (expectedError === ShopifyErrors.HttpResponseError) {
          expect(error).toHaveProperty('code', status);
          expect(error).toHaveProperty('statusText', statusText);
        }
        if (expectRequestId) {
          expect(error.message).toContain(requestId);
        }

        expect({
          method: 'GET',
          domain,
          path: '/url/path',
        }).toMatchMadeHttpRequest();
      });

      expect(caught).toEqual(true);
    };

    fetchMock.mockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
        {status: 403, statusText, headers: {'x-request-id': requestId}},
=======
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        {statusCode: 403, statusText, headers: {'x-request-id': requestId}},
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts
      ],
      [JSON.stringify({}), {status: 404, statusText, headers: {}}],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
        {status: 429, statusText, headers: {'x-request-id': requestId}},
      ],
      [
        JSON.stringify({}),
        {status: 500, statusText, headers: {'x-request-id': requestId}},
=======
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        {statusCode: 429, statusText, headers: {'x-request-id': requestId}},
      ],
      [
        JSON.stringify({}),
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        {statusCode: 500, statusText, headers: {'x-request-id': requestId}},
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts
      ],
    );

    await testErrorResponse(403, ShopifyErrors.HttpResponseError, true);
    await testErrorResponse(404, ShopifyErrors.HttpResponseError, false);
    await testErrorResponse(429, ShopifyErrors.HttpThrottlingError, true);
    await testErrorResponse(500, ShopifyErrors.HttpInternalError, true);

<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
    fetchMock.mockRejectOnce(() => Promise.reject());
    await testErrorResponse(null, ShopifyErrors.HttpRequestError, false);
=======
    class MyError extends Error {
      constructor(...args: any) {
        super(...args);
        Object.setPrototypeOf(this, new.target.prototype);
      }
    }
    mockAdapter.queueError(new MyError());
    await testErrorResponse(null, MyError, false);
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts
  });

  it('allows custom headers', async () => {
    const client = new HttpClient(domain);

    const customHeaders = {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      'X-Not-A-Real-Header': 'some_value',
    };

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('extends User-Agent if it is provided', async () => {
    const client = new HttpClient(domain);

<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
    let customHeaders: HeaderParams = {'User-Agent': 'My agent'};
    fetchMock.mockResponseOnce(buildMockResponse(successResponse));
=======
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    let customHeaders: Headers = {'User-Agent': 'My agent'};
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        'User-Agent': expect.stringContaining(
          'My agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    customHeaders = {'user-agent': 'My lowercase agent'};

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        'User-Agent': expect.stringContaining(
          'My lowercase agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();
  });

  it('extends a User-Agent provided by Context', async () => {
    Context.USER_AGENT_PREFIX = 'Context Agent';
    Context.initialize(Context);

    const client = new HttpClient(domain);

    fetchMock.mockResponses(
      buildMockResponse(successResponse),
      buildMockResponse(successResponse),
    );

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        'User-Agent': expect.stringContaining(
          'Context Agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();

<<<<<<< HEAD:lib/clients/http_client/__tests__/http_client.test.ts
    const customHeaders: HeaderParams = {'User-Agent': 'Headers Agent'};
=======
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    const customHeaders: Headers = {'User-Agent': 'Headers Agent'};
>>>>>>> origin/isomorphic/main:src/clients/http_client/__tests__/http_client.test.ts

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
        'User-Agent': expect.stringContaining(
          'Headers Agent | Context Agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();
  });

  it('fails with invalid retry count', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(
      client.get({path: '/url/path', tries: -1}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpRequestError);
  });

  it('retries failed requests but returns success', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    fetchMock.mockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 429, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 429, statusText: 'Did not work'},
      ],
      [buildMockResponse(successResponse), {status: 200}],
    );

    await expect(client.get({path: '/url/path', tries: 3})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      tries: 3,
    }).toMatchMadeHttpRequest();
  });

  it('retries failed requests and stops on non-retriable errors', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    fetchMock.mockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 403, statusText: 'Did not work'},
      ],
      [buildMockResponse(successResponse), {status: 200}],
    );

    await expect(
      client.get({path: '/url/path', tries: 3}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpResponseError);
    // The second call resulted in a non-retriable error
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      tries: 2,
    }).toMatchMadeHttpRequest();
  });

  it('stops retrying after reaching the limit', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    fetchMock.mockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 500, statusText: 'Did not work'},
      ],
    );

    await expect(
      client.get({path: '/url/path', tries: 3}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpMaxRetriesError);
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      tries: 3,
    }).toMatchMadeHttpRequest();
  });

  it('waits for the amount of time defined by the Retry-After header', async () => {
    // Default to a lot longer than the time we actually expect to sleep for
    setRestClientRetryTime(4000);
    const realWaitTime = 0.05;

    const client = new HttpClient(domain);

    fetchMock.mockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {
          status: 429,
          statusText: 'Did not work',
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          headers: {'Retry-After': realWaitTime.toString()},
        },
      ],
      [JSON.stringify(successResponse), {status: 200}],
    );

    // If we don't retry within an acceptable amount of time, we assume to be paused for longer than Retry-After
    const retryTimeout = setTimeout(() => {
      throw new Error(
        'Request was not retried within the interval defined by Retry-After, test failed',
      );
    }, 4000);

    await expect(client.get({path: '/url/path', tries: 2})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      tries: 2,
    }).toMatchMadeHttpRequest();
    clearTimeout(retryTimeout);
  });

  it('logs deprecation headers to the console when they are present', async () => {
    const client = new HttpClient(domain);
    console.warn = jest.fn();

    fetchMock.mockResponses(
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          status: 200,
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
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
          status: 200,
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
    );

    await client.get({path: '/url/path'});

    expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
      message: 'This API endpoint has been deprecated',
      path: 'https://test-shop.myshopify.io/url/path',
    });

    await client.post({
      path: '/url/path',
      type: DataType.JSON,
      data: {query: 'some query'},
    });

    expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
      message: 'This API endpoint has been deprecated',
      path: 'https://test-shop.myshopify.io/url/path',
    });
  });

  it('will wait 5 minutes before logging repeat deprecation alerts', async () => {
    jest.useFakeTimers();

    const client = new HttpClient(domain);
    console.warn = jest.fn();

    fetchMock.mockResponses(
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          status: 200,
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
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
          status: 200,
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
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
          status: 200,
          headers: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
    );
    // first call should call console.warn
    await client.get({path: '/url/path'});
    // this one should skip it
    await client.get({path: '/url/path'});
    // one warn so far
    expect(console.warn).toHaveBeenCalledTimes(1);

    // use jest.fn() to advance time by 5 minutes
    const currentTime = Date.now();
    Date.now = jest.fn(() => currentTime + 300000);

    // should warn a second time since 5 mins have passed
    await client.get({path: '/url/path'});

    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('writes deprecation notices to log file if one is specified in Context', async () => {
    const logs: [LogSeverity, string][] = [];
    Context.LOG_FUNCTION = async (sev, msg) => {
      logs.push([sev, msg]);
    };
    Context.initialize(Context);

    const client = new HttpClient(domain);

    fetchMock.mockResponse(
      JSON.stringify({
        message: 'Some deprecated request',
      }),
      {
        status: 200,
        headers: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          'X-Shopify-API-Deprecated-Reason':
            'This API endpoint has been deprecated',
        },
      },
    );

    await client.get({path: '/url/path'});

    expect(logs[0][1]).toContain('API Deprecation Notice');
    expect(logs[0][1]).toContain(
      ': {"message":"This API endpoint has been deprecated","path":"https://test-shop.myshopify.io/url/path"}',
    );
    expect(logs[0][1]).toContain(`Stack Trace: Error`);
  });

  it('properly encodes strings in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    fetchMock.mockResponses([
      JSON.stringify({errors: 'Something went wrong'}),
      {status: 500, statusText: 'Did not work'},
    ]);

    let caught = false;
    await client
      .get({path: '/url/path'})
      .then(() => fail('Expected request to fail'))
      .catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(ShopifyErrors.HttpInternalError);
        expect(error.message).toEqual(
          `Shopify internal error:\n"Something went wrong"`,
        );
      });
    expect(caught).toEqual(true);
    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('properly encodes objects in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient(domain);

    fetchMock.mockResponses([
      JSON.stringify({
        errors: {title: 'Invalid title', description: 'Invalid description'},
      }),
      {status: 500, statusText: 'Did not work'},
    ]);

    let caught = false;
    await client
      .get({path: '/url/path'})
      .then(() => fail('Expected request to fail'))
      .catch((error) => {
        caught = true;
        expect(error).toBeInstanceOf(ShopifyErrors.HttpInternalError);
        expect(error.message).toEqual(
          `Shopify internal error:` +
            `\n{` +
            `\n  "title": "Invalid title",` +
            `\n  "description": "Invalid description"` +
            `\n}`,
        );
      });
    expect(caught).toEqual(true);
    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('adds missing slashes to paths', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({path: 'url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('properly formats arrays and hashes in query strings', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    const client = new HttpClient(domain);

    await client.get({
      path: '/url/path',
      query: {
        array: ['a', 'b', 'c'],
        // eslint-disable-next-line id-length
        hash: {a: 'b', c: 'd'},
      },
    });

    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      query: encodeURI('array[]=a&array[]=b&array[]=c&hash[a]=b&hash[c]=d'),
    }).toMatchMadeHttpRequest();
  });
});

function setRestClientRetryTime(time: number) {
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}

function buildMockResponse(obj: unknown): string {
  return JSON.stringify(obj);
}

function buildExpectedResponse(obj: unknown): RequestReturn {
  const expectedResponse: RequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  return expect.objectContaining(expectedResponse);
}
