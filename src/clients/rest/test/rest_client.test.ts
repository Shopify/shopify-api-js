import '../../../test/test_helper';
import { ShopifyHeader } from '../../../types';
import { DataType } from '../../http_client';
import { assertHttpRequest } from '../../test/test_helper';
import { RestClient } from '../rest_client';
import querystring from 'querystring';

const domain = 'test-shop'; // Omitting the myshopify.com part to fail if real requests are made
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

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.get({ path: 'products' })).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json');
  });

  it("can make POST request with JSON data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post({ path: 'products', type: DataType.JSON, data: postData })).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/admin/api/unstable/products.json', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(postData));
  });

  it("can make POST request with form data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post({ path: 'products', type: DataType.URLEncoded, data: postData })).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/admin/api/unstable/products.json', { 'Content-Type': DataType.URLEncoded.toString() }, querystring.stringify(postData));
  });

  it("can make PUT request with JSON data", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put({ path: 'products/123', type: DataType.JSON, data: putData })).resolves.toEqual(successResponse);
    assertHttpRequest('PUT', domain, '/admin/api/unstable/products/123.json', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(putData));
  });

  it("can make DELETE request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.delete({ path: 'products/123' })).resolves.toEqual(successResponse);
    assertHttpRequest('DELETE', domain, '/admin/api/unstable/products/123.json');
  });

  it("merges custom headers with the default ones", async () => {
    const client = new RestClient(domain, 'dummy-token');

    const customHeaders: Record<string, string> = {
      'X-Not-A-Real-Header': 'some_value',
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.get({ path: 'products', extraHeaders: customHeaders })).resolves.toEqual(successResponse);

    customHeaders[ShopifyHeader.AccessToken] = 'dummy-token';
    assertHttpRequest('GET', domain, '/admin/api/unstable/products.json', customHeaders);
  });
});
