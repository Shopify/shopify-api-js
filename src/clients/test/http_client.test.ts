import '../../test/test_helper';
import { axiosMock, buildHttpResponse, assertHttpRequest } from './test_helper';

import { HttpClient } from '../http_client';
import ShopifyErrors from '../../error';
import { AxiosError, AxiosResponse } from 'axios';

const domain = 'test-shop.myshopify.com';
const successResponse = { message: "Your HTTP request was successful!" };

describe("HTTP client", () => {
  beforeEach(axiosMock.request.mockRestore);

  test("can make GET request", async () => {
    const client = new HttpClient(domain);

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.get('/url/path')).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path');
  });

  test("can make POST request", async () => {
    const client = new HttpClient(domain);

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.post('/url/path', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', {}, postData);
  });

  test("can make PUT request", async () => {
    const client = new HttpClient(domain);

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    await expect(client.put('/url/path/123', postData)).resolves.toEqual(successResponse);
    assertHttpRequest('PUT', domain, '/url/path/123', {}, postData);
  });

  test("can make DELETE request", async () => {
    const client = new HttpClient(domain);

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.delete('/url/path/123')).resolves.toEqual(successResponse);
    assertHttpRequest('DELETE', domain, '/url/path/123');
  });

  test("gracefully handles errors", async () => {
    const client = new HttpClient(domain);

    const testErrorResponse = async (status: number | null, expectedError: NewableFunction) => {
      const errorResponse: AxiosError = {
        message: "Something went wrong!",
      } as AxiosError;
      if (status) {
        errorResponse.response = {
          status: status,
        } as AxiosResponse;
      }

      axiosMock.request.mockRestore();
      axiosMock.request.mockRejectedValue(errorResponse);

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

    axiosMock.request.mockReturnValue(buildHttpResponse(successResponse));

    await expect(client.get('/url/path', customHeaders)).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path', customHeaders);
  });
});
