import {
  buildMockResponse,
  queueError,
  queueMockResponse,
  queueMockResponses,
} from '../../../__tests__/test-helper';
import {testConfig} from '../../../__tests__/test-config';
import {DataType, GetRequestParams} from '../../types';
import {RestRequestReturn, PageInfo} from '../types';
import * as ShopifyErrors from '../../../error';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
import {shopifyApi} from '../../..';
import {RestClient} from '../rest/client';

const domain = 'test-shop.myshopify.io';
const successResponse = {
  products: [
    {
      title: 'Test title',
      amount: 10,
    },
  ],
};

const accessToken = 'dangit';
let session: Session;
let jwtPayload: JwtPayload;

describe('REST client', () => {
  beforeEach(() => {
    jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: 'test_key',
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    session = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
      accessToken,
    });
  });

  it('can make GET request', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
    }).toMatchMadeHttpRequest();
  });

  it('can make GET request with path in query', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));
    const getRequest = {
      path: 'products',
      query: {
        path: 'some_path',
      },
    };

    await expect(client.get(getRequest)).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json?path=some_path`,
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with JSON data', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(
      client.post({path: 'products', type: DataType.JSON, data: postData}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form data', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product + something else',
      amount: 10,
    };

    await expect(
      client.post({
        path: 'products',
        type: DataType.URLEncoded,
        data: postData,
      }),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make PUT request with JSON data', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(
      client.put({path: 'products/123', type: DataType.JSON, data: putData}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    expect({
      method: 'PUT',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products/123.json`,
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(putData),
    }).toMatchMadeHttpRequest();
  });

  it('can make DELETE request', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.delete({path: 'products/123'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    expect({
      method: 'DELETE',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products/123.json`,
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with the default ones', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    const customHeaders: Record<string, string> = {
      'X-Not-A-Real-Header': 'some_value',
    };

    queueMockResponse(JSON.stringify(successResponse));

    await expect(
      client.get({path: 'products', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeaders[ShopifyHeader.AccessToken] = accessToken;
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('includes pageInfo of type PageInfo in the returned object for calls with next or previous pages', async () => {
    const shopify = shopifyApi(testConfig());

    const params = getDefaultPageInfo(shopify.config.apiVersion);
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
      'This invalid info header will be ignored',
    ];

    queueMockResponses([
      JSON.stringify(successResponse),
      {headers: {link: linkHeaders.join(', ')}},
    ]);

    const response = (await client.get({
      path: 'products',
      query: {limit: 10},
    })) as RestRequestReturn;

    expect(response).toHaveProperty('pageInfo');
    expect(response.pageInfo).toEqual(params);
  });

  it('is able to make subsequent get requests to either pageInfo.nextPage or pageInfo.prevPage', async () => {
    const shopify = shopifyApi(testConfig());

    const params = getDefaultPageInfo(shopify.config.apiVersion);
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
    );

    const initialResponse = (await client.get({
      path: 'products',
      query: {limit: 10},
    })) as RestRequestReturn;

    const pageInfo = initialResponse.pageInfo as PageInfo;
    const nextPageResponse = await client.get(
      pageInfo.nextPage as GetRequestParams,
    );
    expect(nextPageResponse).toBeDefined();
    expect(nextPageResponse).toHaveProperty('pageInfo');

    const prevPageResponse = await client.get(
      pageInfo.prevPage as GetRequestParams,
    );
    expect(prevPageResponse).toBeDefined();
    expect(prevPageResponse).toHaveProperty('pageInfo');
  });

  it('can request next pages until they run out', async () => {
    const shopify = shopifyApi(testConfig());

    const params = getDefaultPageInfo(shopify.config.apiVersion);
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: `<${params.previousPageUrl}>; rel="previous"`}},
      ],
    );

    const initialResponse = (await client.get({
      path: 'products',
      query: {limit: 10},
    })) as RestRequestReturn;
    expect(initialResponse.pageInfo!.nextPageUrl).toBe(params.nextPageUrl);
    const secondResponse = (await client.get(
      initialResponse.pageInfo!.nextPage!,
    )) as RestRequestReturn;
    expect(secondResponse.pageInfo!.nextPageUrl).toBe(params.nextPageUrl);
    const thirdResponse = (await client.get(
      secondResponse.pageInfo!.nextPage!,
    )) as RestRequestReturn;
    expect(thirdResponse.pageInfo!.nextPageUrl).toBeUndefined();
    expect(thirdResponse.pageInfo!.nextPage).toBeUndefined();
  });

  it('can request previous pages until they run out', async () => {
    const shopify = shopifyApi(testConfig());

    const params = getDefaultPageInfo(shopify.config.apiVersion);
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: linkHeaders.join(', ')}},
      ],
      [
        JSON.stringify(successResponse),
        {headers: {link: `<${params.previousPageUrl}>; rel="next"`}},
      ],
    );

    const initialResponse = (await client.get({
      path: 'products',
      query: {limit: 10},
    })) as RestRequestReturn;
    expect(initialResponse.pageInfo!.previousPageUrl).toBe(
      params.previousPageUrl,
    );
    const secondResponse = (await client.get(
      initialResponse.pageInfo!.prevPage!,
    )) as RestRequestReturn;
    expect(secondResponse.pageInfo!.previousPageUrl).toBe(
      params.previousPageUrl,
    );
    const thirdResponse = (await client.get(
      secondResponse.pageInfo!.prevPage!,
    )) as RestRequestReturn;
    expect(thirdResponse.pageInfo!.previousPageUrl).toBeUndefined();
    expect(thirdResponse.pageInfo!.prevPage).toBeUndefined();
  });

  it('adapts to private app requests', async () => {
    const shopify = shopifyApi(
      testConfig({
        isCustomStoreApp: true,
        adminApiAccessToken: 'test-admin-api-access-token',
      }),
    );

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const customHeaders: Record<string, string> = {};
    customHeaders[ShopifyHeader.AccessToken] =
      shopify.config.adminApiAccessToken;

    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('fails to instantiate without access token', () => {
    const shopify = shopifyApi(testConfig());

    const sessionWithoutAccessToken = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
    });

    expect(
      () => new shopify.clients.Rest({session: sessionWithoutAccessToken}),
    ).toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  it('allows paths with .json', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.get({path: 'products.json'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
    }).toMatchMadeHttpRequest();
  });

  it('allows full paths', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.get({path: '/admin/some-path.json'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: '/admin/some-path.json',
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
    const shopify = shopifyApi(testConfig());

    expect(shopify.config.apiVersion).not.toBe('2020-01');
    const client = new shopify.clients.Rest({
      session,
      apiVersion: '2020-01' as any as ApiVersion,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/2020-01/products.json`,
    }).toMatchMadeHttpRequest();

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      expect.stringContaining(
        `REST client overriding default API version ${LATEST_API_VERSION} with 2020-01`,
      ),
    );
  });

  it('gracefully handles errors', async () => {
    const shopify = shopifyApi(
      testConfig({
        isCustomStoreApp: true,
        adminApiAccessToken: 'test-admin-api-access-token',
      }),
    );

    const client = new shopify.clients.Rest({session});

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
          path: `/admin/api/${shopify.config.apiVersion}/url/path.json`,
        }).toMatchMadeHttpRequest();
      });

      expect(caught).toEqual(true);
    };

    queueMockResponses(
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {
          statusCode: 403,
          statusText,
          headers: {'x-request-id': requestId},
        },
      ],
      [JSON.stringify({}), {statusCode: 404, statusText, headers: {}}],
      [
        JSON.stringify({errors: 'Something went wrong!'}),
        {
          statusCode: 429,
          statusText,
          headers: {'x-request-id': requestId},
        },
      ],
      [
        JSON.stringify({}),
        {
          statusCode: 500,
          statusText,
          headers: {'x-request-id': requestId},
        },
      ],
    );

    await testErrorResponse(403, ShopifyErrors.HttpResponseError, true);
    await testErrorResponse(404, ShopifyErrors.HttpResponseError, false);
    await testErrorResponse(429, ShopifyErrors.HttpThrottlingError, true);
    await testErrorResponse(500, ShopifyErrors.HttpInternalError, true);

    queueError(new Error());
    await testErrorResponse(null, Error, false);
  });

  it('logs deprecation headers to the console when they are present', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
          path: '/url/path',
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
          path: '/url/path',
          body: `${JSON.stringify(postBody)}...`,
        }),
      ),
    );
  });

  it('will wait 5 minutes before logging repeat deprecation alerts', async () => {
    jest.useFakeTimers();

    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
          path: '/url/path',
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
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/url/path.json`,
    }).toMatchMadeHttpRequest();
  });

  it('properly encodes objects in the error message', async () => {
    setRestClientRetryTime(0);
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

    queueMockResponses([
      JSON.stringify({
        errors: {
          title: 'Invalid title',
          description: 'Invalid description',
        },
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
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/url/path.json`,
    }).toMatchMadeHttpRequest();
  });

  it('throws exceptions with response details on internal errors', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Rest({session});

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
    const shopify = shopifyApi(
      testConfig({
        logger: {level: LogSeverity.Debug, httpRequests: false, log: jest.fn()},
      }),
    );

    const data = {test: 'data'};

    const client = new shopify.clients.Rest({session});
    queueMockResponse(buildMockResponse(successResponse));

    await client.post({path: '/url/path', data});

    // The first log call is the runtime info
    expect(shopify.config.logger.log).toHaveBeenCalledTimes(1);
  });

  it('logs HTTP requests when the setting is on', async () => {
    const shopify = shopifyApi(
      testConfig({
        logger: {level: LogSeverity.Debug, httpRequests: true, log: jest.fn()},
      }),
    );

    const data = {test: 'data'};

    const client = new shopify.clients.Rest({session});
    queueMockResponse(buildMockResponse(successResponse));

    await client.post({path: '/url/path', data});

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      expect.anything(),
    );
    const logMessage = (shopify.config.logger.log as jest.Mock).mock
      .calls[1][1];
    expect(logMessage).toContain('Received response for HTTP');
    expect(logMessage).toContain(
      `https://test-shop.myshopify.io/admin/api/${shopify.config.apiVersion}/url/path`,
    );
    expect(logMessage).toContain('"user-agent":"Shopify API Library');
    expect(logMessage).toContain('"body":"{\\"test\\":\\"data\\"}"');
  });
});

function getDefaultPageInfo(apiVersion: ApiVersion): PageInfo {
  const limit = '10';
  const fields = ['test1', 'test2'];
  const previousUrl = `https://${domain}/admin/api/${apiVersion}/products.json?limit=${limit}&fields=${fields.join(
    ',',
  )}&page_info=previousToken`;
  const nextUrl = `https://${domain}/admin/api/${apiVersion}/products.json?limit=${limit}&fields=${fields.join(
    ',',
  )}&page_info=nextToken`;
  const prevPage = {
    path: 'products',
    query: {
      fields: fields.join(','),
      limit: `${limit}`,
      page_info: 'previousToken',
    },
  };
  const nextPage = {
    path: 'products',
    query: {
      fields: fields.join(','),
      limit: `${limit}`,
      page_info: 'nextToken',
    },
  };

  return {
    limit,
    fields,
    previousPageUrl: previousUrl,
    nextPageUrl: nextUrl,
    prevPage,
    nextPage,
  };
}

function buildExpectedResponse(
  obj: unknown,
  pageInfo?: PageInfo,
): RestRequestReturn {
  const expectedResponse: RestRequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  if (pageInfo) {
    expectedResponse.pageInfo = pageInfo;
  }

  return expect.objectContaining(expectedResponse);
}

function setRestClientRetryTime(time: number) {
  (RestClient as any).RETRY_WAIT_TIME = time;
}
