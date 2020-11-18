import '../../test/test_helper';
import { assertHttpRequest } from './test_helper';

import { HttpClient, DataType } from '../http_client';
import ShopifyErrors from '../../error';
import querystring from 'querystring';

const domain = 'test-shop'; // Omitting the myshopify.com part to fail if real requests are made
const successResponse = { message: "Your HTTP request was successful!" };

describe("HTTP client", () => {
  test("can make GET request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.get({ path: '/url/path' })).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path');
  });

  test("can make POST request with type JSON", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: postData
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(postData));
  });

  test("can make POST request with type JSON and data is already formatted", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: JSON.stringify(postData)
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(postData));
  });

  test("can make POST request with zero-length JSON", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: ''
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', {}, null);
  });

  test("can make POST request with form-data type", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: postData
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', { 'Content-Type': DataType.URLEncoded.toString() }, querystring.stringify(postData));
  });

  test("can make POST request with form-data type and data is already formatted", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: querystring.stringify(postData)
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', { 'Content-Type': DataType.URLEncoded.toString() }, querystring.stringify(postData));
  });

  test("can make POST request with GraphQL type", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const graphql_query = `
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
      data: graphql_query
    };

    await expect(client.post(postParams)).resolves.toEqual(successResponse);
    assertHttpRequest('POST', domain, '/url/path', { 'Content-Type': DataType.GraphQL.toString() }, graphql_query);
  });

  test("can make PUT request with type JSON", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const putData = {
      title: 'Test product',
      amount: 10,
    };

    const putParams = {
      path: '/url/path/123',
      type: DataType.JSON,
      data: putData
    }

    await expect(client.put(putParams)).resolves.toEqual(successResponse);
    assertHttpRequest('PUT', domain, '/url/path/123', { 'Content-Type': DataType.JSON.toString() }, JSON.stringify(putData));
  });

  test("can make DELETE request", async () => {
    const client = new HttpClient(domain);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.delete({ path: '/url/path/123' })).resolves.toEqual(successResponse);
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

      const expectResult = expect(client.get({ path: '/url/path' })).rejects;
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

    await expect(client.get({ path: '/url/path', extraHeaders: customHeaders })).resolves.toEqual(successResponse);
    assertHttpRequest('GET', domain, '/url/path', customHeaders);
  });
});
