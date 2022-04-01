import {ShopifyHeader} from '../../../base-types';
import {DataType, GetRequestParams} from '../../http_client/types';
import {RestClient} from '../rest_client';
import {RestRequestReturn, PageInfo} from '../types';
import {Context} from '../../../context';
import {setAbstractFetchFunc, Response} from '../../../runtime/http';
import Shopify from '../../../adapters/node';
import * as mockAdapter from '../../../adapters/mock';

setAbstractFetchFunc(mockAdapter.abstractFetch);

const domain = 'test-shop.myshopify.io';
const successResponseBody = JSON.stringify({
  products: [
    {
      title: 'Test title',
      amount: 10,
    },
  ],
});

describe('REST client', () => {
  beforeEach(() => {
    mockAdapter.reset();
  });

  it('can make GET request', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/products.json',
    }).toMatchMadeHttpRequest();
  });

  it('can make GET request with path in query', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);
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
      path: '/admin/api/unstable/products.json',
      query: 'path=some_path',
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with JSON data', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

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
      path: '/admin/api/unstable/products.json',
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(postData),
    }).toMatchMadeHttpRequest();
  });

  it('can make POST request with form data', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

    const postData = {
      title: 'Test product',
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
      path: '/admin/api/unstable/products.json',
      headers: {'Content-Type': DataType.URLEncoded.toString()},
      data: new URLSearchParams(postData as any).toString(),
    }).toMatchMadeHttpRequest();
  });

  it('can make PUT request with JSON data', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

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
      path: '/admin/api/unstable/products/123.json',
      headers: {'Content-Type': DataType.JSON.toString()},
      data: JSON.stringify(putData),
    }).toMatchMadeHttpRequest();
  });

  it('can make DELETE request', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

    await expect(client.delete({path: 'products/123'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/unstable/products/123.json',
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with the default ones', async () => {
    const client = new RestClient(domain, 'dummy-token');

    const customHeaders: {[key: string]: string} = {
      'X-Not-A-Real-Header': 'some_value',
    };

    queueMockResponse(successResponseBody);

    await expect(
      client.get({path: 'products', extraHeaders: customHeaders}),
    ).resolves.toEqual(buildExpectedResponse(successResponseBody));

    customHeaders[ShopifyHeader.AccessToken] = 'dummy-token';
    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/products.json',
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('includes pageInfo of type PageInfo in the returned object for calls with next or previous pages', async () => {
    const params = getDefaultPageInfo();
    const client = new RestClient(domain, 'dummy-token');
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
      'This invalid info header will be ignored',
    ];

    queueMockResponses([
      successResponseBody,
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
    const client = new RestClient(domain, 'dummy-token');
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
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
    const client = new RestClient(domain, 'dummy-token');
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
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
    const client = new RestClient(domain, 'dummy-token');
    const linkHeaders = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
    ];

    queueMockResponses(
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
      [successResponseBody, {headers: {link: linkHeaders.join(', ')}}],
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
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    const client = new RestClient(domain);

    queueMockResponse(successResponseBody);

    await expect(client.get({path: 'products'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );

    const customHeaders: {[key: string]: string} = {};
    customHeaders[ShopifyHeader.AccessToken] = 'test_secret_key';

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/products.json',
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('fails to instantiate without access token', () => {
    expect(() => new RestClient(domain)).toThrow(
      Shopify.Errors.MissingRequiredArgument,
    );
  });

  it('allows paths with .json', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

    await expect(client.get({path: 'products.json'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: '/admin/api/unstable/products.json',
    }).toMatchMadeHttpRequest();
  });

  it('allows full paths', async () => {
    const client = new RestClient(domain, 'dummy-token');

    queueMockResponse(successResponseBody);

    await expect(client.get({path: '/admin/some-path.json'})).resolves.toEqual(
      buildExpectedResponse(successResponseBody),
    );
    expect({
      method: 'GET',
      domain,
      path: '/admin/some-path.json',
    }).toMatchMadeHttpRequest();
  });
});

function getDefaultPageInfo(): PageInfo {
  const limit = '10';
  const fields = ['test1', 'test2'];
  const previousUrl = `https://${domain}/admin/api/unstable/products.json?limit=${limit}&fields=${fields.join(
    ',',
  )}&page_info=previousToken`;
  const nextUrl = `https://${domain}/admin/api/unstable/products.json?limit=${limit}&fields=${fields.join(
    ',',
  )}&page_info=nextToken`;
  const prevPage = {
    path: 'products',
    query: {
      fields: fields.join(','),
      limit: `${limit}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_info: 'previousToken',
    },
  };
  const nextPage = {
    path: 'products',
    query: {
      fields: fields.join(','),
      limit: `${limit}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
