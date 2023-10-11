import {createGraphQLClient} from '../graphql-client';
import {GraphQLClient, RequestOptions} from '../types';

describe('GraphQL Client', () => {
  const windowFetchMock = {
    status: 200,
    ok: true,
    json: () => {
      return Promise.resolve({data: {}});
    },
  };

  beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValue(windowFetchMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createGraphQLClient()', () => {
    describe('client initialization', () => {
      it('returns a client object that contains a config object and request and fetch function', () => {
        const config = {
          url: 'http://test-store.myshopify.com/api/2023-10/graphql.json',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'public-token',
          },
        };

        const client = createGraphQLClient(config);
        expect(client).toHaveProperty('config');
        expect(client).toMatchObject({
          request: expect.any(Function),
          fetch: expect.any(Function),
        });
      });
    });

    describe('config object', () => {
      it('returns a config object that includes the url', () => {
        const config = {
          url: 'http://test-store.myshopify.com/api/2023-10/graphql.json',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'public-token',
          },
        };

        const client = createGraphQLClient(config);
        expect(client.config.url).toBe(config.url);
      });

      it('returns a config object that includes the headers', () => {
        const config = {
          url: 'http://test-store.myshopify.com/api/2023-10/graphql.json',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'public-token',
          },
        };

        const client = createGraphQLClient(config);
        expect(client.config.headers).toBe(config.headers);
      });
    });

    describe('fetch()', () => {
      const operation = `
        query {
          shop {
            name
          }
        }
      `;

      const variables = {};

      const config = {
        url: 'http://test-store.myshopify.com/api/2023-10/graphql.json',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'public-token',
        },
      };

      it('uses the window fetch when a custom fetch API is not provided at initialization ', () => {
        const client = createGraphQLClient(config);

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];
        client.fetch(...props);

        expect(window.fetch).toHaveBeenCalledWith(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it('uses the provided custom fetch when a custom fetch API is provided at initialization ', () => {
        const customFetchAPI = jest.fn().mockResolvedValue({
          status: 200,
          ok: true,
          json: jest.fn().mockImplementation(() => {
            return {data: {}};
          }),
        }) as any;

        const client = createGraphQLClient({
          ...config,
          fetchAPI: customFetchAPI,
        });

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];

        client.fetch(...props);

        expect(customFetchAPI).toHaveBeenCalledWith(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(window.fetch).not.toHaveBeenCalled();
      });

      describe('calling the function', () => {
        let client: GraphQLClient;

        beforeEach(() => {
          client = createGraphQLClient({
            ...config,
          });
        });

        afterEach(() => {
          jest.resetAllMocks();
        });

        describe('parameters', () => {
          it('calls fetch API with provided operation', async () => {
            await client.fetch(operation);
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it('calls fetch API with provided variables', async () => {
            await client.fetch(operation, {variables});
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
                variables,
              }),
            });
          });

          it('calls fetch API with provided url override', async () => {
            const url =
              'http://test-store.myshopify.com/api/2023-07/graphql.json';
            await client.fetch(operation, {url});
            expect(window.fetch).toHaveBeenCalledWith(url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it('calls fetch API with provided headers override', async () => {
            const headers = {
              'Content-Type': 'application/graphql',
              'custom-header': 'custom-headers',
            };

            await client.fetch(operation, {headers});
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: {...config.headers, ...headers},
              body: JSON.stringify({
                query: operation,
              }),
            });
          });
        });

        it('returns the graphql client request response', async () => {
          const response = await client.fetch(operation, {variables});
          expect(response).toBe(windowFetchMock);
        });
      });
    });

    describe('request()', () => {
      const operation = `
        query {
          shop {
            name
          }
        }
      `;

      const variables = {};

      const config = {
        url: 'http://test-store.myshopify.com/api/2023-10/graphql.json',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'public-token',
        },
      };

      it('uses the window fetch when a custom fetch API is not provided at initialization ', () => {
        const client = createGraphQLClient(config);

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];
        client.request(...props);

        expect(window.fetch).toHaveBeenCalledWith(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it('uses the provided custom fetch when a custom fetch API is provided at initialization ', () => {
        const customFetchAPI = jest.fn().mockResolvedValue({
          status: 200,
          ok: true,
          json: jest.fn().mockImplementation(() => {
            return {data: {}};
          }),
        }) as any;

        const client = createGraphQLClient({
          ...config,
          fetchAPI: customFetchAPI,
        });

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];

        client.request(...props);

        expect(customFetchAPI).toHaveBeenCalledWith(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(window.fetch).not.toHaveBeenCalled();
      });

      describe('calling the function', () => {
        let fetch: jest.Mock;
        let client: GraphQLClient;

        beforeEach(() => {
          fetch = jest.fn();
          client = createGraphQLClient({
            ...config,
            fetchAPI: fetch,
          });
        });

        afterEach(() => {
          jest.resetAllMocks();
        });

        describe('parameters', () => {
          it('calls fetch API with provided operation', async () => {
            await client.request(operation);
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it('calls fetch API with provided variables', async () => {
            await client.request(operation, {variables});
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
                variables,
              }),
            });
          });

          it('calls fetch API with provided url override', async () => {
            const url =
              'http://test-store.myshopify.com/api/2023-07/graphql.json';
            await client.request(operation, {url});
            expect(fetch).toHaveBeenCalledWith(url, {
              method: 'POST',
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it('calls fetch API with provided headers override', async () => {
            const headers = {
              'Content-Type': 'application/graphql',
              'custom-header': 'custom-headers',
            };

            await client.request(operation, {headers});
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: 'POST',
              headers: {...config.headers, ...headers},
              body: JSON.stringify({
                query: operation,
              }),
            });
          });
        });

        describe('returned object', () => {
          it('includes a data object if the data object is included in the response', async () => {
            const mockResponseData = {data: {shop: {name: 'Test shop'}}};
            const mockedSuccessResponse: Partial<Response> = {
              status: 200,
              ok: true,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              json: jest.fn().mockReturnValue(mockResponseData),
            };

            fetch.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('data', mockResponseData.data);
          });

          it('includes an API extensions object if it is included in the response', async () => {
            const extensions = {
              context: {
                country: 'JP',
                language: 'ja',
              },
            };

            const mockedSuccessResponse: Partial<Response> = {
              status: 200,
              ok: true,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              json: jest.fn().mockReturnValue({data: {}, extensions}),
            };

            fetch.mockResolvedValue(mockedSuccessResponse);
            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('extensions', extensions);
          });

          it('includes an error object if the response is not ok', async () => {
            const mockedErrorResponse: Partial<Response> = {
              status: 400,
              statusText: 'Bad request',
              ok: false,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              json: jest.fn(),
            };

            fetch.mockResolvedValue(mockedErrorResponse);

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('error', {
              networkStatusCode: mockedErrorResponse.status,
              message: mockedErrorResponse.statusText,
            });
          });

          it('includes an error object if the fetch promise fails', async () => {
            const errorMessage = 'Async error message';

            fetch.mockRejectedValue(new Error(errorMessage));

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('error', {
              message: errorMessage,
            });
          });

          it('includes an error object if the response content type is not application/json', async () => {
            const contentType = 'multipart/mixed';
            const mockedErrorResponse: Partial<Response> = {
              status: 200,
              ok: true,
              headers: new Headers({
                'Content-Type': contentType,
              }),
              json: jest.fn(),
            };

            fetch.mockResolvedValue(mockedErrorResponse);

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('error', {
              networkStatusCode: mockedErrorResponse.status,
              message: `GraphQL Client: Response returned unexpected Content-Type: ${contentType}`,
            });
          });

          it('includes an error object if the API response contains errors', async () => {
            const gqlError = ['GQL error'];
            const mockedErrorResponse: Partial<Response> = {
              status: 200,
              ok: true,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              json: () =>
                Promise.resolve({
                  errors: gqlError,
                }),
            };

            fetch.mockResolvedValue(mockedErrorResponse);

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('error', {
              networkStatusCode: mockedErrorResponse.status,
              message:
                "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
              graphQLErrors: gqlError,
            });
          });

          it('includes an error object if the API does not throw or return an error and does not include a data object in its response', async () => {
            const mockedSuccessResponse: Partial<Response> = {
              status: 200,
              ok: true,
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              json: jest.fn().mockReturnValue({}),
            };

            fetch.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, {variables});
            expect(response).toHaveProperty('error', {
              networkStatusCode: mockedSuccessResponse.status,
              message:
                'GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.',
            });
          });
        });
      });
    });
  });
});
