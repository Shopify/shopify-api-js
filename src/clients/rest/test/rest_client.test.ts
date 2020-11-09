import '../../../test/test_helper';
import { ShopifyHeader } from '../../../types';
import { axiosMock, buildHttpResponse, assertHttpRequest } from '../../test/test_helper';
import { RestClient } from '../rest_client';

const domain = 'test-shop.myshopify.com';
const successResponse = {
  products: [
    {
      title: 'Test title',
      amount: 10,
    }
  ]
};

describe("REST client", () => {
  beforeEach(axiosMock.request.mockRestore);

  it("can make GET request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.get('products')).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/admin/products.json');
  });

  it("can make POST request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post('products', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/admin/products.json', {}, postData);
  });

  it("can make PUT request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put('products/123', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('PUT', domain, '/admin/products/123.json', {}, postData);
  });

  it("can make DELETE request", async () => {
    const client = new RestClient(domain, 'dummy-token');

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.delete('products/123')).resolves.toEqual(successResponse);
    assertHttpRequest('DELETE', domain, '/admin/products/123.json');
  });

  it("merges custom headers with the default ones", async () => {
    const client = new RestClient(domain, 'dummy-token');

    const customHeaders: {[key: string]: string} = {
      'X-Not-A-Real-Header': 'some_value',
    };

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.get('products', customHeaders)).resolves.toEqual(successResponse);

    customHeaders[ShopifyHeader.AccessToken] = 'dummy-token';
    assertHttpRequest('GET', domain, '/admin/products.json', customHeaders);
  });
});
