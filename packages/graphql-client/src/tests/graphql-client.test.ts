import fetchMock from "jest-fetch-mock";

import { createGraphQLClient } from "../graphql-client";
import { GraphQLClient, RequestOptions } from "../types";

describe("GraphQL Client", () => {
  const windowFetchMock = JSON.stringify({ data: {} });

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));
    fetchMock.mockResponse(() => Promise.resolve(windowFetchMock));
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  const config = {
    url: "http://test-store.myshopify.com/api/2023-10/graphql.json",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": "public-token",
    },
  };

  function getValidClient(retries?: number) {
    if (typeof retries === "number") {
      return createGraphQLClient({ ...config, retries });
    }

    return createGraphQLClient(config);
  }

  describe("createGraphQLClient()", () => {
    describe("client initialization", () => {
      it("returns a client object that contains a config object and request and fetch function", () => {
        const client = getValidClient();
        expect(client).toHaveProperty("config");
        expect(client).toMatchObject({
          request: expect.any(Function),
          fetch: expect.any(Function),
        });
      });
    });

    describe("config object", () => {
      it("returns a config object that includes the url", () => {
        const client = getValidClient();
        expect(client.config.url).toBe(config.url);
      });

      it("returns a config object that includes the headers", () => {
        const client = getValidClient();
        expect(client.config.headers).toBe(config.headers);
      });

      it("returns a config object that includes the default retries value when it is not provided at initialization", () => {
        const client = getValidClient();
        expect(client.config.retries).toBe(0);
      });

      it("returns a config object that includes the provided retries value", () => {
        const restries = 3;
        const client = getValidClient(restries);
        expect(client.config.retries).toBe(restries);
      });
    });

    describe("fetch()", () => {
      const operation = `
        query {
          shop {
            name
          }
        }
      `;

      const variables = {};

      it("uses the window fetch when a custom fetch API is not provided at initialization ", () => {
        const client = getValidClient();

        client.fetch(operation, {
          variables,
        });

        expect(window.fetch).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it("uses the provided custom fetch when a custom fetch API is provided at initialization ", () => {
        const customFetchAPI = jest
          .fn()
          .mockResolvedValue(new Response(JSON.stringify({ data: {} }))) as any;

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
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(window.fetch).not.toHaveBeenCalled();
      });

      describe("calling the function", () => {
        let client: GraphQLClient;

        beforeEach(() => {
          client = getValidClient();
        });

        afterEach(() => {
          jest.resetAllMocks();
        });

        describe("fetch parameters", () => {
          it("calls fetch API with provided operation", async () => {
            await client.fetch(operation);
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it("calls fetch API with provided variables", async () => {
            await client.fetch(operation, { variables });
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
                variables,
              }),
            });
          });

          it("calls fetch API with provided url override", async () => {
            const url =
              "http://test-store.myshopify.com/api/2023-07/graphql.json";
            await client.fetch(operation, { url });
            expect(window.fetch).toHaveBeenCalledWith(url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it("calls fetch API with provided headers override", async () => {
            const headers = {
              "Content-Type": "application/graphql",
              "custom-header": "custom-headers",
            };

            await client.fetch(operation, { headers });
            expect(window.fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: { ...config.headers, ...headers },
              body: JSON.stringify({
                query: operation,
              }),
            });
          });
        });

        describe("retries", () => {
          describe("Aborted fetch responses", () => {
            it("calls the window fetch 1 time and throws an error when the client default retries value is 0", async () => {
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow(
                "GraphQL Client: Exceeded maximum number of 1 network tries. Last message - The operation was aborted."
              );
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and throws an error when the client was initialized with 1 retries and all fetches were aborted", async () => {
              const client = getValidClient(1);
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow(
                "GraphQL Client: Exceeded maximum number of 2 network tries. Last message - The operation was aborted."
              );
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and throws an error when the function is provided with 2 retries and all fetches were aborted", async () => {
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation, { retries: 2 });
              }).rejects.toThrow(
                "GraphQL Client: Exceeded maximum number of 3 network tries. Last message - The operation was aborted."
              );

              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid http response after an aborted fetch and the next response is valid", async () => {
              fetchMock.mockAbortOnce();

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(200);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms when a retry occurs", async () => {
              const client = getValidClient(1);
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow(
                "GraphQL Client: Exceeded maximum number of 2 network tries. Last message - The operation was aborted."
              );
              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });
          });

          describe("429 responses", () => {
            const status = 429;
            const mockedFailedResponse = new Response(JSON.stringify({}), {
              status,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            });

            it("calls the window fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient(1);

              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid response after an a failed 429 fetch response and the next response is valid", async () => {
              const mockedSuccessData = { data: {} };
              fetchMock.mockResponses(
                ["", { status }],
                [JSON.stringify(mockedSuccessData), { status: 200 }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(200);
              expect(await response.json()).toEqual(mockedSuccessData);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("returns a failed non 429/503 response after an a failed 429 fetch response and the next response has failed", async () => {
              const mockedSuccessData = { data: {} };
              fetchMock.mockResponses(
                ["", { status }],
                [JSON.stringify(mockedSuccessData), { status: 500 }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(500);
              expect(await response.json()).toEqual(mockedSuccessData);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by retry-after header value when it's returned in the response, else it will delay the retry by 1000ms ", async () => {
              fetchMock.mockResponses(
                ["", { status, headers: { "Retry-After": "3" } }],
                ["", { status }],
                ["", { status }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
              expect(setTimeout).toHaveBeenCalledTimes(2);
              expect(setTimeout).toHaveBeenNthCalledWith(
                1,
                expect.any(Function),
                3000
              );
              expect(setTimeout).toHaveBeenNthCalledWith(
                2,
                expect.any(Function),
                1000
              );
            });
          });

          describe("503 responses", () => {
            const status = 503;
            const mockedFailedResponse = new Response(JSON.stringify({}), {
              status,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            });

            it("calls the window fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetch responses were 503 ", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient(1);

              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetch responses were 503", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid response after a failed 503 fetch response and the next response is valid", async () => {
              const mockedSuccessData = { data: {} };
              fetchMock.mockResponses(
                ["", { status }],
                [JSON.stringify(mockedSuccessData), { status: 200 }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(200);
              expect(await response.json()).toEqual(mockedSuccessData);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("returns a failed non 429/503 response after a failed 503 fetch response and the next response has failed", async () => {
              const mockedSuccessData = { data: {} };
              fetchMock.mockResponses(
                ["", { status }],
                [JSON.stringify(mockedSuccessData), { status: 500 }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(500);
              expect(await response.json()).toEqual(mockedSuccessData);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by the retry-after header value when it's returned in the response, else it will delay the retry by 1000ms ", async () => {
              fetchMock.mockResponses(
                ["", { status, headers: { "Retry-After": "3" } }],
                ["", { status }],
                ["", { status }]
              );

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
              expect(setTimeout).toHaveBeenCalledTimes(2);
              expect(setTimeout).toHaveBeenNthCalledWith(
                1,
                expect.any(Function),
                3000
              );
              expect(setTimeout).toHaveBeenNthCalledWith(
                2,
                expect.any(Function),
                1000
              );
            });
          });

          it("does not retry additional network requests if the initial response is successful", async () => {
            const mockedSuccessResponse = new Response(
              JSON.stringify({ data: {} }),
              {
                status: 200,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);
            const response = await client.fetch(operation);

            expect(response.status).toBe(200);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("does not retry additional network requests on a failed response that is not a 429 or 503", async () => {
            const mockedFailedResponse = new Response(
              JSON.stringify({ data: {} }),
              {
                status: 500,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await client.fetch(operation);

            expect(response.status).toBe(500);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("request()", () => {
      const operation = `
          query {
            shop {
              name
            }
          }
        `;

      const variables = {};

      it("uses the window fetch when a custom fetch API is not provided at initialization", () => {
        const client = getValidClient();

        client.request(operation, {
          variables,
        });

        expect(window.fetch).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it("uses the provided custom fetch when a custom fetch API is provided at initialization", () => {
        const customFetchAPI = jest
          .fn()
          .mockResolvedValue(new Response(JSON.stringify({ data: {} }))) as any;

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
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(window.fetch).not.toHaveBeenCalled();
      });

      describe("calling the function", () => {
        let client: GraphQLClient;

        beforeEach(() => {
          client = createGraphQLClient({
            ...config,
            fetchAPI: fetch,
          });
        });

        afterEach(() => {
          fetchMock.resetMocks();
          jest.resetAllMocks();
        });

        describe("fetch parameters", () => {
          it("calls fetch API with provided operation", async () => {
            await client.request(operation);
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it("calls fetch API with provided variables", async () => {
            await client.request(operation, { variables });
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
                variables,
              }),
            });
          });

          it("calls fetch API with provided url override", async () => {
            const url =
              "http://test-store.myshopify.com/api/2023-07/graphql.json";
            await client.request(operation, { url });
            expect(fetch).toHaveBeenCalledWith(url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it("calls fetch API with provided headers override", async () => {
            const headers = {
              "Content-Type": "application/graphql",
              "custom-header": "custom-headers",
            };

            await client.request(operation, { headers });
            expect(fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: { ...config.headers, ...headers },
              body: JSON.stringify({
                query: operation,
              }),
            });
          });
        });

        describe("returned object", () => {
          it("includes a data object if the data object is included in the response", async () => {
            const mockResponseData = { data: { shop: { name: "Test shop" } } };
            const mockedSuccessResponse = new Response(
              JSON.stringify(mockResponseData),
              {
                status: 200,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("data", mockResponseData.data);
          });

          it("includes an API extensions object if it is included in the response", async () => {
            const extensions = {
              context: {
                country: "JP",
                language: "ja",
              },
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({ data: {}, extensions }),
              {
                status: 200,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("extensions", extensions);
            expect(response).not.toHaveProperty("error");
          });

          it("includes an error object if the response is not ok", async () => {
            const responseConfig = {
              status: 400,
              statusText: "Bad request",
              ok: false,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            };

            const mockedSuccessResponse = new Response("", responseConfig);

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("error", {
              networkStatusCode: responseConfig.status,
              message: responseConfig.statusText,
            });
          });

          it("includes an error object if the fetch promise fails", async () => {
            const errorMessage = "Async error message";

            fetchMock.mockRejectedValue(new Error(errorMessage));

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("error", {
              message: `GraphQL Client: Exceeded maximum number of 1 network tries. Last message - ${errorMessage}`,
            });
          });

          it("includes an error object if the response content type is not application/json", async () => {
            const contentType = "multipart/mixed";
            const responseConfig = {
              status: 200,
              headers: new Headers({
                "Content-Type": contentType,
              }),
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({ data: {} }),
              responseConfig
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("error", {
              networkStatusCode: responseConfig.status,
              message: `GraphQL Client: Response returned unexpected Content-Type: ${contentType}`,
            });
          });

          it("includes an error object if the API response contains errors", async () => {
            const gqlError = ["GQL error"];
            const responseConfig = {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({ errors: gqlError }),
              responseConfig
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("error", {
              networkStatusCode: responseConfig.status,
              message:
                "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
              graphQLErrors: gqlError,
            });
          });

          it("includes an error object if the API does not throw or return an error and does not include a data object in its response", async () => {
            const responseConfig = {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({}),
              responseConfig
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);
            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("error", {
              networkStatusCode: mockedSuccessResponse.status,
              message:
                "GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.",
            });
          });
        });

        describe("retries", () => {
          describe("Aborted fetch responses", () => {
            it("calls the window fetch 1 time and returns a response object with an error when the client default retries value is 0 ", async () => {
              fetchMock.mockAbort();

              const response = await client.request(operation);

              expect(response.error?.message).toBe(
                "GraphQL Client: Exceeded maximum number of 1 network tries. Last message - The operation was aborted. "
              );

              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches were aborted", async () => {
              const client = getValidClient(1);
              fetchMock.mockAbort();

              const response = await client.request(operation);

              expect(response.error?.message).toBe(
                "GraphQL Client: Exceeded maximum number of 2 network tries. Last message - The operation was aborted. "
              );

              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches were aborted", async () => {
              fetchMock.mockAbort();

              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.message).toBe(
                "GraphQL Client: Exceeded maximum number of 3 network tries. Last message - The operation was aborted. "
              );

              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid response object without an error property after an aborted fetch and the next response is valid", async () => {
              const mockResponseData = {
                data: { shop: { name: "Test shop" } },
              };
              const mockedSuccessResponse = new Response(
                JSON.stringify(mockResponseData),
                {
                  status: 200,
                  headers: new Headers({
                    "Content-Type": "application/json",
                  }),
                }
              );

              fetchMock.mockAbortOnce();
              fetchMock.mockResolvedValue(mockedSuccessResponse);

              const response = await client.request(operation, { retries: 2 });

              expect(response.error).toBeUndefined();
              expect(response.data).toEqual(mockResponseData.data);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms when a retry occurs", async () => {
              const client = getValidClient(1);
              fetchMock.mockAbort();

              const response = await client.request(operation);

              expect(response.error?.message).toBe(
                "GraphQL Client: Exceeded maximum number of 2 network tries. Last message - The operation was aborted. "
              );

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });
          });

          describe("429 responses", () => {
            const status = 429;
            const mockedFailedResponse = new Response(JSON.stringify({}), {
              status,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            });

            it("calls the window fetch 1 time and returns a response object with an error when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation);

              expect(response.error?.message).toBe("Too Many Requests");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient(1);

              const response = await client.request(operation);

              expect(response.error?.message).toBe("Too Many Requests");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.message).toBe("Too Many Requests");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid response after an a failed 429 fetch response and the next response is valid", async () => {
              const mockedSuccessData = { data: { shop: { name: "shop1" } } };
              fetchMock.mockResponses(
                ["", { status }],
                [
                  JSON.stringify(mockedSuccessData),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  },
                ]
              );

              const response = await client.request(operation, { retries: 2 });

              expect(response.data).toEqual(mockedSuccessData.data);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("returns a failed non 429/503 response after an a failed 429 fetch response and the next response has failed", async () => {
              fetchMock.mockResponses(["", { status }], ["", { status: 500 }]);

              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.networkStatusCode).toBe(500);
              expect(response.error?.message).toEqual("Internal Server Error");
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by the retry-after header value when it's returned in the response, else it will delay the retry by 1000ms ", async () => {
              fetchMock.mockResponses(
                ["", { status, headers: { "Retry-After": "3" } }],
                ["", { status }],
                ["", { status }]
              );

              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
              expect(setTimeout).toHaveBeenCalledTimes(2);
              expect(setTimeout).toHaveBeenNthCalledWith(
                1,
                expect.any(Function),
                3000
              );
              expect(setTimeout).toHaveBeenNthCalledWith(
                2,
                expect.any(Function),
                1000
              );
            });
          });

          describe("503 responses", () => {
            const status = 503;
            const mockedFailedResponse = new Response(JSON.stringify({}), {
              status,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            });

            it("calls the window fetch 1 time and returns a response object with an error when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation);

              expect(response.error?.message).toBe("Service Unavailable");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the window fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches returned 503 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient(1);

              const response = await client.request(operation);

              expect(response.error?.message).toBe("Service Unavailable");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the window fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches returned 503 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.message).toBe("Service Unavailable");
              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
            });

            it("returns a valid response after an a failed 503 fetch response and the next response is valid", async () => {
              const mockedSuccessData = { data: { shop: { name: "shop1" } } };
              fetchMock.mockResponses(
                ["", { status }],
                [
                  JSON.stringify(mockedSuccessData),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  },
                ]
              );

              const response = await client.request(operation, { retries: 2 });

              expect(response.data).toEqual(mockedSuccessData.data);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("returns a failed non 429/503 response after an a failed 503 fetch response and the next response has failed", async () => {
              fetchMock.mockResponses(["", { status }], ["", { status: 500 }]);

              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.networkStatusCode).toBe(500);
              expect(response.error?.message).toEqual("Internal Server Error");
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by the retry-after header value when it's returned in the response, else it will delay the retry by 1000ms ", async () => {
              fetchMock.mockResponses(
                ["", { status, headers: { "Retry-After": "3" } }],
                ["", { status }],
                ["", { status }]
              );

              const response = await client.request(operation, { retries: 2 });

              expect(response.error?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(3);
              expect(setTimeout).toHaveBeenCalledTimes(2);
              expect(setTimeout).toHaveBeenNthCalledWith(
                1,
                expect.any(Function),
                3000
              );
              expect(setTimeout).toHaveBeenNthCalledWith(
                2,
                expect.any(Function),
                1000
              );
            });
          });

          it("does not retry additional network requests if the initial response is successful", async () => {
            const mockedSuccessData = { data: { shop: { name: "shop1" } } };
            const mockedSuccessResponse = new Response(
              JSON.stringify(mockedSuccessData),
              {
                status: 200,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);
            const response = await client.request(operation);

            expect(response.data).toEqual(mockedSuccessData.data);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("does not retry additional network requests on a failed response that is not a 429 or 503", async () => {
            const mockedFailedResponse = new Response(
              JSON.stringify({ data: {} }),
              {
                status: 500,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              }
            );

            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await client.request(operation);

            expect(response.error?.networkStatusCode).toBe(500);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
