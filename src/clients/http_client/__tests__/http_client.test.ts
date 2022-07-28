import querystring from 'querystring';
import fs from 'fs';

import {HttpClient} from '../http_client';
import {DataType, HeaderParams, RequestReturn} from '../../types';
import * as ShopifyErrors from '../../../error';
import {Context} from '../../../context';

const domain = 'test-shop.myshopify.io';
const successResponse = {message: 'Your HTTP request was successful!'};
const logFilePath = `${process.cwd()}/src/clients/http_client/__tests__/test_logs.txt`;

const originalRetryTime = HttpClient.RETRY_WAIT_TIME;
describe('HTTP client', () => {
  beforeEach(() => {
    fs.writeFileSync(logFilePath, '');
  });

  afterAll(() => {
    setRestClientRetryTime(originalRetryTime);
    fs.writeFileSync(logFilePath, '');
  });

  it('can make GET request', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        'User-Agent': expect.stringContaining('Shopify API Library v'),
      },
    }).toMatchMadeHttpRequest();
  });

  it('allows the body to contain non-json 2xx response without dying', () => {
    const client = new HttpClient(domain);
    fetchMock.mockResponseOnce('not a json object');

    const request = client.get({path: '/url/path'});

    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
    expect(request).resolves.toMatchObject({body: {}});
  });

  it('handles non-json non-2xx response', () => {
    const client = new HttpClient(domain);
    fetchMock.mockResponses([
      'not a json object',
      {status: 404, statusText: 'not found', headers: {}},
    ]);

    const request = client.get({path: '/url/path'});

    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
    expect(request).rejects.toBeInstanceOf(ShopifyErrors.HttpResponseError);
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
      headers: {
        'Content-Length': JSON.stringify(postData).length,
        'Content-Type': DataType.JSON.toString(),
        'User-Agent': expect.stringContaining('Shopify API Library v'),
      },
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
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: querystring.stringify(postData),
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
      headers: {
        'Content-Length': JSON.stringify(putData).length,
        'Content-Type': DataType.JSON.toString(),
        'User-Agent': expect.stringContaining('Shopify API Library v'),
      },
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
      headers: {
        'User-Agent': expect.stringContaining('Shopify API Library v'),
      },
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
          expect(error).toHaveProperty('response.code', status);
          expect(error).toHaveProperty('response.statusText', statusText);
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
        {status: 403, statusText, headers: {'x-request-id': requestId}},
      ],
      [JSON.stringify({}), {status: 404, statusText, headers: {}}],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {status: 429, statusText, headers: {'x-request-id': requestId}},
      ],
      [
        JSON.stringify({}),
        {status: 500, statusText, headers: {'x-request-id': requestId}},
      ],
    );

    await testErrorResponse(403, ShopifyErrors.HttpResponseError, true);
    await testErrorResponse(404, ShopifyErrors.HttpResponseError, false);
    await testErrorResponse(429, ShopifyErrors.HttpThrottlingError, true);
    await testErrorResponse(500, ShopifyErrors.HttpInternalError, true);

    fetchMock.mockRejectOnce(() => Promise.reject());
    await testErrorResponse(null, ShopifyErrors.HttpRequestError, false);
  });

  it('allows custom headers', async () => {
    const client = new HttpClient(domain);

    const customHeaders = {
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

    let customHeaders: HeaderParams = {'User-Agent': 'My agent'};
    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        'User-Agent': expect.stringContaining(
          'My agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();

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
        'User-Agent': expect.stringContaining(
          'Context Agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();

    const customHeaders: HeaderParams = {'User-Agent': 'Headers Agent'};

    await expect(
      client.get({path: '/url/path', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
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

    const postBody = {
      query: 'some query',
    };

    fetchMock.mockResponses(
      [
        JSON.stringify({
          message: 'Some deprecated request',
        }),
        {
          status: 200,
          headers: {
            'X-Shopify-API-Deprecated-Reason':
              'This API endpoint has been deprecated',
          },
        },
      ],
      [
        JSON.stringify({
          message: 'Some deprecated post request',
          body: postBody,
        }),
        {
          status: 200,
          headers: {
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
      data: postBody,
    });

    expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
      message: 'This API endpoint has been deprecated',
      path: 'https://test-shop.myshopify.io/url/path',
      body: `${JSON.stringify(postBody)}...`,
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
    Context.LOG_FILE = logFilePath;
    Context.initialize(Context);

    const client = new HttpClient(domain);

    fetchMock.mockResponse(
      JSON.stringify({
        message: 'Some deprecated request',
      }),
      {
        status: 200,
        headers: {
          'X-Shopify-API-Deprecated-Reason':
            'This API endpoint has been deprecated',
        },
      },
    );

    await client.get({path: '/url/path'});

    // open and read test log file
    const fileContent = fs.readFileSync(logFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    });

    expect(fileContent).toContain('API Deprecation Notice');
    expect(fileContent).toContain(
      ': {"message":"This API endpoint has been deprecated","path":"https://test-shop.myshopify.io/url/path"}',
    );
    expect(fileContent).toContain(`Stack Trace: Error:`);
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

  it('throws exceptions with response details on internal errors', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponse(JSON.stringify({errors: 'Error 500'}), {
      status: 500,
      statusText: 'Error 500',
      headers: {'X-Text-Header': 'Error 500'},
    });

    const expectedError = await expect(client.get({path: '/url/path'})).rejects;
    expectedError.toBeInstanceOf(ShopifyErrors.HttpInternalError);
    expectedError.toBeInstanceOf(ShopifyErrors.HttpResponseError);
    expectedError.toMatchObject({
      response: {
        body: {errors: 'Error 500'},
        code: 500,
        statusText: 'Error 500',
        headers: {'X-Text-Header': ['Error 500']},
      },
    });
  });

  it('throws exceptions with response details on throttled requests', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponse(JSON.stringify({errors: 'Error 429'}), {
      status: 429,
      statusText: 'Error 429',
      headers: {'X-Text-Header': 'Error 429', 'Retry-After': '100'},
    });

    const expectedError = await expect(client.get({path: '/url/path'})).rejects;
    expectedError.toBeInstanceOf(ShopifyErrors.HttpThrottlingError);
    expectedError.toBeInstanceOf(ShopifyErrors.HttpResponseError);
    expectedError.toMatchObject({
      response: {
        body: {errors: 'Error 429'},
        code: 429,
        statusText: 'Error 429',
        headers: {'X-Text-Header': ['Error 429'], 'Retry-After': ['100']},
        retryAfter: 100,
      },
    });
  });

  it('throws exceptions with response details on any other errors', async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponse(JSON.stringify({errors: 'Error 403'}), {
      status: 403,
      statusText: 'Error 403',
      headers: {'X-Text-Header': 'Error 403'},
    });

    const expectedError = await expect(client.get({path: '/url/path'})).rejects;
    expectedError.toBeInstanceOf(ShopifyErrors.HttpResponseError);
    expectedError.toMatchObject({
      response: {
        body: {errors: 'Error 403'},
        code: 403,
        statusText: 'Error 403',
        headers: {'X-Text-Header': ['Error 403']},
      },
    });
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
