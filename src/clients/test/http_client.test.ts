import '../../test/test_helper';
import { assertHttpRequest } from './test_helper';

import { HttpClient } from '../http_client';
import ShopifyErrors from '../../error';

const domain = 'test-shop'; // Omitting the myshopify.com part to fail if real requests are made
const successResponse = { message: "Your HTTP request was successful!" };

describe("HTTP client", () => {
  test("can make GET request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.get('/url/path')).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path');
  });

  test("can make POST request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post('/url/path', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', {}, postData);
  });

  test("can make PUT request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put('/url/path/123', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('PUT', domain, '/url/path/123', {}, postData);
  });

  test("can make DELETE request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.delete('/url/path/123')).resolves.toEqual(successResponse);
    assertHttpRequest('DELETE', domain, '/url/path/123');
  });

  test("gracefully handles errors", async () => {
    const client = new HttpClient(domain);

    const testErrorResponse = async (status: number | null, expectedError: NewableFunction) => {
      const errorResponse = {
        errors: 'Something went wrong!',
      };

      fetchMock.resetMocks();
      if (status !== null) {
        const headers = new Headers();
        headers.append('content-type', 'application/json; charset=utf-8');
        const responseObject = new Response(JSON.stringify(errorResponse), {
          status: status,
          headers,
        });
        fetchMock.mockImplementation(() => Promise.resolve(responseObject));
      }
      else {
        fetchMock.mockRejectOnce(() => Promise.reject());
      }

      const expectResult = expect(client.get('/url/path')).rejects;
      await expectResult.toBeInstanceOf(expectedError);
      // Make sure we return the HTTP response code in the fallback error
      if (expectedError === ShopifyErrors.HttpResponseError) {
        expectResult.toHaveProperty('code', status);
      }

      assertHttpRequest('GET', domain, '/url/path');
    };

    await testErrorResponse(403, ShopifyErrors.HttpResponseError);
    await testErrorResponse(429, ShopifyErrors.HttpThrottlingError);
    await testErrorResponse(500, ShopifyErrors.HttpInternalError);
    await testErrorResponse(null, ShopifyErrors.HttpRequestError);
  });

  test("allows custom headers", async () => {
    const client = new HttpClient(domain);

    const customHeaders = {
      'X-Not-A-Real-Header': 'some_value',
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.get('/url/path', customHeaders)).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path', customHeaders);
  });
});
