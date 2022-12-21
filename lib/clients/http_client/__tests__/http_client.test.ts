import {
  buildExpectedResponse,
  buildMockResponse,
  queueError,
  queueMockResponse,
  queueMockResponses,
  shopify,
} from '../../../__tests__/test-helper';
import {httpClientClass} from '../http_client';
import {DataType, HeaderParams} from '../../types';
import * as ShopifyErrors from '../../../error';
import {LogSeverity} from '../../../types';

const domain = 'test-shop.myshopify.io';
const successResponse = {message: 'Your HTTP request was successful!'};

let HttpClient: ReturnType<typeof httpClientClass>;
let originalRetryTime: number;

describe('HTTP client', () => {
  beforeEach(() => {
    HttpClient = httpClientClass(shopify.config);
    originalRetryTime = HttpClient.RETRY_WAIT_TIME;
  });

  afterAll(() => {
    setRestClientRetryTime(originalRetryTime);
  });

  it('can make GET request', async () => {
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});
    queueMockResponse('not a json object');

    const request = client.get({path: '/url/path'});

    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
    expect(request).resolves.toMatchObject({body: {}});
  });

  it('handles non-json non-2xx response', () => {
    const client = new HttpClient({domain});
    queueMockResponse('not a json object', {
      statusCode: 404,
      statusText: 'not found',
      headers: {},
    });

    const request = client.get({path: '/url/path'});

    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
    expect(request).rejects.toBeInstanceOf(ShopifyErrors.HttpResponseError);
  });

  it('can make POST request with type JSON', async () => {
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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

  it('defaults to JSON type for POST and PUT', async () => {
    const client = new HttpClient({domain});

    queueMockResponses(
      [buildMockResponse(successResponse)],
      [buildMockResponse(successResponse)],
    );

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    expect(
      await client.post({
        path: '/url/path',
        data: postData,
      }),
    ).toEqual(buildExpectedResponse(successResponse));
    expect(
      await client.put({
        path: '/url/path',
        data: postData,
      }),
    ).toEqual(buildExpectedResponse(successResponse));

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
    expect({
      method: 'PUT',
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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

    const postData = {
      title: 'Test product + something else',
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
      data: 'title=Test+product+%2B+something+else&amount=10',
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form-data type and data is already formatted', async () => {
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: new URLSearchParams(postData as any).toString(),
    };

    await expect(client.post(postParams)).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'POST',
      domain,
      path: '/url/path',
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: 'title=Test+product&amount=10',
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with GraphQL type', async () => {
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
    const client = new HttpClient({domain});

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

    queueMockResponses(
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

    await testErrorResponse(403, ShopifyErrors.HttpResponseError, true);
    await testErrorResponse(404, ShopifyErrors.HttpResponseError, false);
    await testErrorResponse(429, ShopifyErrors.HttpThrottlingError, true);
    await testErrorResponse(500, ShopifyErrors.HttpInternalError, true);

    class MyError extends Error {
      constructor(...args: any) {
        super(...args);
        Object.setPrototypeOf(this, new.target.prototype);
      }
    }
    queueError(new MyError());
    await testErrorResponse(null, MyError, false);
  });

  it('allows custom headers', async () => {
    const client = new HttpClient({domain});

    const customHeaders = {
      'X-Not-A-Real-Header': 'some_value',
    };

    queueMockResponse(buildMockResponse(successResponse));

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

  it('extends User-Agent (uppercase) if it is provided', async () => {
    const client = new HttpClient({domain});

    const customHeaders: HeaderParams = {'User-Agent': 'My agent'};
    queueMockResponse(buildMockResponse(successResponse));

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
  });

  it('extends User-Agent (lowercase) if it is provided', async () => {
    const client = new HttpClient({domain});

    const customHeaders: HeaderParams = {'user-agent': 'My lowercase agent'};
    queueMockResponse(buildMockResponse(successResponse));

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

  it('extends a User-Agent provided by config', async () => {
    shopify.config.userAgentPrefix = 'Config Agent';

    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

    await expect(client.get({path: '/url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      headers: {
        'User-Agent': expect.stringContaining(
          'Config Agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();
  });

  it('extends a User-Agent provided by config and an extra header', async () => {
    shopify.config.userAgentPrefix = 'Config Agent';

    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

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
          'Headers Agent | Config Agent | Shopify API Library v',
        ),
      },
    }).toMatchMadeHttpRequest();
  });

  it('fails with invalid retry count', async () => {
    const client = new HttpClient({domain});

    await expect(
      client.get({path: '/url/path', tries: -1}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpRequestError);
  });

  it('retries failed requests but returns success', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient({domain});

    queueMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 429, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 429, statusText: 'Did not work'},
      ],
      [buildMockResponse(successResponse), {statusCode: 200}],
    );

    await expect(client.get({path: '/url/path', tries: 3})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      attempts: 3,
    }).toMatchMadeHttpRequest();
  });

  it('retries failed requests and stops on non-retriable errors', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient({domain});

    queueMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 500, statusText: 'Did not work'},
      ],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {statusCode: 403, statusText: 'Did not work'},
      ],
    );

    await expect(
      client.get({path: '/url/path', tries: 3}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpResponseError);
    // The second call resulted in a non-retriable error
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      attempts: 2,
    }).toMatchMadeHttpRequest();
  });

  it('stops retrying after reaching the limit', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient({domain});

    queueMockResponses(
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
      client.get({path: '/url/path', tries: 3}),
    ).rejects.toBeInstanceOf(ShopifyErrors.HttpMaxRetriesError);
    expect({
      method: 'GET',
      domain,
      path: '/url/path',
      attempts: 3,
    }).toMatchMadeHttpRequest();
  });

  it('waits for the amount of time defined by the Retry-After header', async () => {
    // Default to a lot longer than the time we actually expect to sleep for
    setRestClientRetryTime(4000);
    const realWaitTime = 0.05;

    const client = new HttpClient({domain});

    queueMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {
          statusCode: 429,
          statusText: 'Did not work',
          headers: {'Retry-After': realWaitTime.toString()},
        },
      ],
      [JSON.stringify(successResponse), {statusCode: 200}],
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
      attempts: 2,
    }).toMatchMadeHttpRequest();
    clearTimeout(retryTimeout);
  });

  it('logs deprecation headers to the console when they are present', async () => {
    const client = new HttpClient({domain});

    const postBody = {
      query: 'some query',
    };

    queueMockResponses(
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
          body: postBody,
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

    await client.get({path: '/url/path'});

    // first call to .log is .debug with package and runtime info during initialization
    expect(shopify.config.logger.log).toHaveBeenCalledTimes(2);
    expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
      LogSeverity.Warning,
      expect.stringContaining('API Deprecation Notice'),
    );
    expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
      LogSeverity.Warning,
      expect.stringContaining(
        JSON.stringify({
          message: 'This API endpoint has been deprecated',
          path: 'https://test-shop.myshopify.io/url/path',
        }),
      ),
    );

    await client.post({
      path: '/url/path',
      type: DataType.JSON,
      data: postBody,
    });

    expect(shopify.config.logger.log).toHaveBeenCalledTimes(3);
    expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
      LogSeverity.Warning,
      expect.stringContaining(
        JSON.stringify({
          message: 'This API endpoint has been deprecated',
          path: 'https://test-shop.myshopify.io/url/path',
          body: `${JSON.stringify(postBody)}...`,
        }),
      ),
    );
  });

  it('will wait 5 minutes before logging repeat deprecation alerts', async () => {
    jest.useFakeTimers();

    const client = new HttpClient({domain});

    queueMockResponses(
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
    await client.get({path: '/url/path'});
    // this one should skip it
    await client.get({path: '/url/path'});
    // first call to .log is .debug with package and runtime info during initialization
    expect(shopify.config.logger.log).toHaveBeenCalledTimes(2);
    expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
      LogSeverity.Warning,
      expect.anything(),
    );

    // use jest.fn() to advance time by 5 minutes
    const currentTime = Date.now();
    Date.now = jest.fn(() => currentTime + 300000);

    // should warn a second time since 5 mins have passed
    await client.get({path: '/url/path'});

    expect(shopify.config.logger.log).toHaveBeenCalledTimes(3);
    expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
      LogSeverity.Warning,
      expect.anything(),
    );
  });

  it('calls log function with deprecation notice if one is specified in config', async () => {
    const client = new HttpClient({domain});

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

    await client.get({path: '/url/path'});

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Warning,
      expect.stringContaining('API Deprecation Notice'),
    );
    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Warning,
      expect.stringContaining(
        JSON.stringify({
          message: 'This API endpoint has been deprecated',
          path: 'https://test-shop.myshopify.io/url/path',
        }),
      ),
    );
    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Warning,
      expect.stringContaining('Stack Trace: Error'),
    );
  });

  it('properly encodes strings in the error message', async () => {
    setRestClientRetryTime(0);
    const client = new HttpClient({domain});

    queueMockResponses([
      JSON.stringify({errors: 'Something went wrong'}),
      {statusCode: 500, statusText: 'Did not work'},
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
    const client = new HttpClient({domain});

    queueMockResponses([
      JSON.stringify({
        errors: {title: 'Invalid title', description: 'Invalid description'},
      }),
      {statusCode: 500, statusText: 'Did not work'},
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
    const client = new HttpClient({domain});

    queueMockResponse(buildMockResponse(successResponse));

    await expect(client.get({path: 'url/path'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({method: 'GET', domain, path: '/url/path'}).toMatchMadeHttpRequest();
  });

  it('properly formats arrays and hashes in query strings', async () => {
    queueMockResponse(JSON.stringify({}));
    const client = new HttpClient({domain});

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
    const client = new HttpClient({domain});

    queueMockResponse(JSON.stringify({errors: 'Error 500'}), {
      statusCode: 500,
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
    const client = new HttpClient({domain});

    queueMockResponse(JSON.stringify({errors: 'Error 429'}), {
      statusCode: 429,
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
    const client = new HttpClient({domain});

    queueMockResponse(JSON.stringify({errors: 'Error 403'}), {
      statusCode: 403,
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

  it('does not log HTTP requests when the setting is off', async () => {
    shopify.config.logger.httpRequests = false;
    shopify.config.logger.log = jest.fn();

    const data = {test: 'data'};
    const client = new HttpClient({domain});
    queueMockResponse(buildMockResponse(successResponse));

    await client.post({path: '/url/path', data});

    expect(shopify.config.logger.log).not.toHaveBeenCalled();
  });

  it('logs HTTP requests when the setting is on', async () => {
    shopify.config.logger.httpRequests = true;
    shopify.config.logger.log = jest.fn();

    const data = {test: 'data'};
    const client = new HttpClient({domain});
    queueMockResponse(buildMockResponse(successResponse));

    await client.post({path: '/url/path', data});

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      expect.anything(),
    );
    const logMessage = (shopify.config.logger.log as jest.Mock).mock
      .calls[0][1];
    expect(logMessage).toContain('Making HTTP request');
    expect(logMessage).toContain(
      'POST https://test-shop.myshopify.io/url/path',
    );
    expect(logMessage).toContain(
      'Headers: {"User-Agent":["Shopify API Library',
    );
    expect(logMessage).toContain('Body: "{\\"test\\":\\"data\\"}"');
  });
});

function setRestClientRetryTime(time: number) {
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}
