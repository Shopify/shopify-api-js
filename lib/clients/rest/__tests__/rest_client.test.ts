<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
import {
  queueMockResponse,
  queueMockResponses,
  shopify,
} from '../../../__tests__/test-helper';
=======
import {ShopifyHeader} from '../../../base-types';
>>>>>>> origin/isomorphic/main:src/clients/rest/__tests__/rest_client.test.ts
import {DataType, GetRequestParams} from '../../http_client/types';
import {RestRequestReturn, PageInfo} from '../types';
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
import * as ShopifyErrors from '../../../error';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
=======
import {Context} from '../../../context';
import {setAbstractFetchFunc, Response} from '../../../runtime/http';
import Shopify from '../../../adapters/node';
import * as mockAdapter from '../../../adapters/mock';

setAbstractFetchFunc(mockAdapter.abstractFetch);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

const domain = 'test-shop.myshopify.io';
const successResponseBody = JSON.stringify({
  products: [
    {
      title: 'Test title',
      amount: 10,
    },
  ],
});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
const accessToken = 'dangit';
let session: Session;
let jwtPayload: JwtPayload;

describe('REST client', () => {
  beforeEach(() => {
    jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: shopify.config.apiKey,
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
    const client = new shopify.clients.Rest({session});

    queueMockResponse(JSON.stringify(successResponse));
=======
describe('REST client', () => {
  beforeEach(() => {
    mockAdapter.reset();
  });

  it('can make GET request', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
    }).toMatchMadeHttpRequest();
  });

  it('can make GET request with path in query', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
    const getRequest = {
      path: 'products',
      query: {
        path: 'some_path',
      },
    };

    await expect(client.get(getRequest)).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
      path: `/admin/api/${shopify.config.apiVersion}/products.json?path=some_path`,
=======
      path: '/admin/api/unstable/products.json',
      query: 'path=some_path',
>>>>>>> origin/isomorphic/main:src/clients/rest/__tests__/rest_client.test.ts
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with JSON data', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(
      client.post({path: 'products', type: DataType.JSON, data: postData}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    expect({
      method: 'POST',
      domain,
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
=======
      path: '/admin/api/unstable/products.json',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
>>>>>>> origin/isomorphic/main:src/clients/rest/__tests__/rest_client.test.ts
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form data', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

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
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    expect({
      method: 'POST',
      domain,
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: 'title=Test+product+%2B+something+else&amount=10',
=======
      path: '/admin/api/unstable/products.json',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: new URLSearchParams(postData as any).toString(),
>>>>>>> origin/isomorphic/main:src/clients/rest/__tests__/rest_client.test.ts
    }).toMatchMadeHttpRequest();
  });

  it('can make PUT request with JSON data', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(
      client.put({path: 'products/123', type: DataType.JSON, data: putData}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    expect({
      method: 'PUT',
      domain,
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
      path: `/admin/api/${shopify.config.apiVersion}/products/123.json`,
=======
      path: '/admin/api/unstable/products/123.json',
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
>>>>>>> origin/isomorphic/main:src/clients/rest/__tests__/rest_client.test.ts
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(putData),
    }).toMatchMadeHttpRequest();
  });

  it('can make DELETE request', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(client.delete({path: 'products/123'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );

    expect({
      method: 'DELETE',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products/123.json`,
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with the default ones', async () => {
    const client = new shopify.clients.Rest({session});

    const customHeaders: {[key: string]: string} = {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      'X-Not-A-Real-Header': 'some_value',
    };

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(
      client.get({path: 'products', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    customHeaders[ShopifyHeader.AccessToken] = accessToken;
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('includes pageInfo of type PageInfo in the returned object for calls with next or previous pages', async () => {
    const params = getDefaultPageInfo();
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
      'This invalid info header will be ignored',
    ];

    queueMockResponses([
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
      JSON.stringify(successResponse),
=======
      successResponseBody,
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
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
    const params = getDefaultPageInfo();
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
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
=======
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
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
    const params = getDefaultPageInfo();
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
=======
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
      [
        successResponseBody,
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
    const params = getDefaultPageInfo();
    const client = new shopify.clients.Rest({session});
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
=======
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
      [
        successResponseBody,
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
    shopify.config.isCustomStoreApp = true;
    shopify.config.adminApiAccessToken = 'test-admin-api-access-token';

    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );

    const customHeaders: {[key: string]: string} = {};
    customHeaders[ShopifyHeader.AccessToken] =
      shopify.config.adminApiAccessToken;

    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();

    shopify.config.isCustomStoreApp = false;
  });

  it('fails to instantiate without access token', () => {
<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    const sessionWithoutAccessToken = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
    });

    expect(
      () => new shopify.clients.Rest({session: sessionWithoutAccessToken}),
    ).toThrow(ShopifyErrors.MissingRequiredArgument);
=======
    expect(() => new RestClient(domain)).toThrow(
      Shopify.Errors.MissingRequiredArgument,
    );
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts
  });

  it('allows paths with .json', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(client.get({path: 'products.json'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/products.json`,
    }).toMatchMadeHttpRequest();
  });

  it('allows full paths', async () => {
    const client = new shopify.clients.Rest({session});

<<<<<<< HEAD:lib/clients/rest/__tests__/rest_client.test.ts
    queueMockResponse(JSON.stringify(successResponse));
=======
    queueMockResponse(successResponseBody);
>>>>>>> origin/isomorphic/crypto:src/clients/rest/__tests__/rest_client.test.ts

    await expect(client.get({path: '/admin/some-path.json'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: '/admin/some-path.json',
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
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
});

function getDefaultPageInfo(): PageInfo {
  const limit = '10';
  const fields = ['test1', 'test2'];
  const previousUrl = `https://${domain}/admin/api/${
    shopify.config.apiVersion
  }/products.json?limit=${limit}&fields=${fields.join(
    ',',
  )}&page_info=previousToken`;
  const nextUrl = `https://${domain}/admin/api/${
    shopify.config.apiVersion
  }/products.json?limit=${limit}&fields=${fields.join(
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

function queueMockResponse(body: string, partial: Partial<Response> = {}) {
  mockAdapter.queueResponse({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}

function queueMockResponses(
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
