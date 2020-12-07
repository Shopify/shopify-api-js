import '../../../test/test_helper';
import { ShopifyHeader } from '../../../types';
import { DataType } from '../../http_client';
import { assertHttpRequest } from '../../test/test_helper';
import { RestClient, RestRequestReturn } from '../rest_client';
import querystring from 'querystring';

const domain = 'test-shop.myshopify.io';
const successResponse = {
  products: [
    {
      title: 'Test title',
      amount: 10,
    }
  ]
};

describe("REST client", () => {
  it("can make GET request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({ path: 'products' })).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json');
  });

  it("can make POST request with JSON data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post({ path: 'products', type: DataType.JSON, data: postData })).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('POST', domain, '/admin/api/unstable/products.json', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(postData));
  });

  it("can make POST request with form data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post({ path: 'products', type: DataType.URLEncoded, data: postData })).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('POST', domain, '/admin/api/unstable/products.json', { 'Content-Type': DataType.URLEncoded.toString() }, querystring.stringify(postData));
  });

  it("can make PUT request with JSON data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put({ path: 'products/123', type: DataType.JSON, data: putData })).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('PUT', domain, '/admin/api/unstable/products/123.json', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(putData));
  });

  it("can make DELETE request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.delete({ path: 'products/123' })).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('DELETE', domain, '/admin/api/unstable/products/123.json');
  });

  it("merges custom headers with the default ones", async () => {
    const client = new RestClient(domain, 'dummy-token');

    const customHeaders: Record<string, string> = {
      'X-Not-A-Real-Header': 'some_value',
    };

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({ path: 'products', extraHeaders: customHeaders })).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeaders[ShopifyHeader.AccessToken] = 'dummy-token';
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json', customHeaders);
  });

  it("handles pagination headers", async () => {
    const client = new RestClient(domain, 'dummy-token');

    const linkHeader = [];

    linkHeader.push(`<https://${domain}/admin/api/unstable/products.json?limit=10&fields=test1,test2&page_info=nextToken>; rel="next"`);
    linkHeader.push(`<https://${domain}/admin/api/unstable/products.json?limit=10&fields=test1,test2&page_info=previousToken>; rel="previous"`);
    linkHeader.push(`<https://${domain}/admin/api/unstable/products.json?limit=10&fields=test1,test2&page_info=>; rel="previous"`); // No token - will be ignored
    linkHeader.push(`Not a valid link - will be ignored`); // Invalid link - will be ignored

    fetchMock.mockResponses(
      [JSON.stringify(successResponse), { headers: { 'link': linkHeader.join(', ') } }],
    );

    const pageInfo = {
      limit: 10,
      fields: ['test1', 'test2'],
      previousPageId: 'previousToken',
      nextPageId: 'nextToken',
    };

    const expectedResponse = buildExpectedResponse(successResponse, pageInfo);
    await expect(client.get({ path: 'products', query: { limit : 10 } })).resolves.toEqual(expectedResponse);
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json?limit=10');
  });
});

function buildMockResponse(obj: unknown): string {
  return JSON.stringify(obj);
}

function buildExpectedResponse(obj: unknown, pageInfo?: unknown): RestRequestReturn {
  const expectedResponse: RestRequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  if (pageInfo) {
    expectedResponse.pageInfo = expect.objectContaining(pageInfo);
  }

  return expect.objectContaining(expectedResponse);
}
