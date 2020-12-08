import '../../../test/test_helper';
import { ShopifyHeader } from '../../../types';
import { DataType } from '../../http_client';
import { assertHttpRequest } from '../../test/test_helper';
import { RestClient, RestRequestReturn } from '../rest_client';
import { PageInfo } from '../page_info';
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

    await expect(client.post({ path: 'products', type: DataType.JSON, data: postData }))
      .resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest(
      'POST',
      domain,
      '/admin/api/unstable/products.json',
      { 'Content-Type': DataType.JSON.toString() },
      JSON.stringify(postData)
    );
  });

  it("can make POST request with form data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post({ path: 'products', type: DataType.URLEncoded, data: postData }))
      .resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest(
      'POST',
      domain,
      '/admin/api/unstable/products.json',
      { 'Content-Type': DataType.URLEncoded.toString() },
      querystring.stringify(postData)
    );
  });

  it("can make PUT request with JSON data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put({ path: 'products/123', type: DataType.JSON, data: putData }))
      .resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest(
      'PUT',
      domain,
      '/admin/api/unstable/products/123.json',
      { 'Content-Type': DataType.JSON.toString() },
      JSON.stringify(putData)
    );
  });

  it("can make DELETE request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.delete({ path: 'products/123' }))
      .resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('DELETE', domain, '/admin/api/unstable/products/123.json');
  });

  it("merges custom headers with the default ones", async () => {
    const client = new RestClient(domain, 'dummy-token');

    const customHeaders: Record<string, string> = {
      'X-Not-A-Real-Header': 'some_value',
    };

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(client.get({ path: 'products', extraHeaders: customHeaders }))
      .resolves.toEqual(buildExpectedResponse(successResponse));

    customHeaders[ShopifyHeader.AccessToken] = 'dummy-token';
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json', customHeaders);
  });
});

function buildMockResponse(obj: unknown): string {
  return JSON.stringify(obj);
}

function buildExpectedResponse(obj: unknown, pageInfo?: PageInfo): RestRequestReturn {
  const expectedResponse: RestRequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  if (pageInfo) {
    expectedResponse.pageInfo = pageInfo;
  }

  return expect.objectContaining(expectedResponse);
}
