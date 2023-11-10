import fetchMock from "jest-fetch-mock";

import { createGraphQLClient } from "../../graphql-client";
import { GraphQLClient, RequestOptions } from "../../types";

import {
  config,
  getValidClient,
  operation,
  variables,
  globalFetchMock,
} from "./fixtures";

describe("GraphQL Client", () => {
  let mockLogger: jest.Mock;

  fetchMock.enableMocks();

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));
    fetchMock.mockResponse(() => Promise.resolve(globalFetchMock));
    mockLogger = jest.fn();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

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

      it("throws an error when the retries config value is less than 0", () => {
        const retries = -1;
        expect(() => getValidClient({ retries })).toThrowError(
          `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
        );
      });

      it("throws an error when the retries config value is greater than 3", () => {
        const retries = 4;
        expect(() => getValidClient({ retries })).toThrowError(
          `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
        );
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
        const retries = 3;
        const client = getValidClient({ retries });
        expect(client.config.retries).toBe(retries);
      });
    });

    describe("fetch()", () => {
      it("uses the global fetch when a custom fetch API is not provided at initialization ", () => {
        const client = getValidClient();

        client.fetch(operation, {
          variables,
        });

        expect(global.fetch).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it("uses the provided custom fetch when a custom fetch API is provided at initialization ", () => {
        const customFetchApi = jest
          .fn()
          .mockResolvedValue(new Response(JSON.stringify({ data: {} }))) as any;

        const client = createGraphQLClient({
          ...config,
          fetchApi: customFetchApi,
        });

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];

        client.fetch(...props);

        expect(customFetchApi).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(global.fetch).not.toHaveBeenCalled();
      });

      describe("calling the function", () => {
        let client: GraphQLClient;

        beforeEach(() => {
          client = getValidClient();
        });

        it("returns the HTTP response", async () => {
          const response = await client.fetch(operation);
          expect(response.status).toBe(200);
        });

        it("logs the request and response info if a logger is provided", async () => {
          const client = getValidClient({ logger: mockLogger });

          const response = await client.fetch(operation);
          expect(response.status).toBe(200);
          expect(mockLogger).toBeCalledWith({
            type: "HTTP-Response",
            content: {
              response,
              requestParams: [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ],
            },
          });
        });

        describe("fetch parameters", () => {
          it("calls fetch API with provided operation", async () => {
            await client.fetch(operation);
            expect(global.fetch).toHaveBeenCalledWith(config.url, {
              method: "POST",
              headers: config.headers,
              body: JSON.stringify({
                query: operation,
              }),
            });
          });

          it("calls fetch API with provided variables", async () => {
            await client.fetch(operation, { variables });
            expect(global.fetch).toHaveBeenCalledWith(config.url, {
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
            expect(global.fetch).toHaveBeenCalledWith(url, {
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
            expect(global.fetch).toHaveBeenCalledWith(config.url, {
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
            it("returns a valid http response after an aborted fetch and the next response is valid", async () => {
              fetchMock.mockAbortOnce();

              const response = await client.fetch(operation, { retries: 2 });

              expect(response.status).toBe(200);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow();

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockAbort();

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow();

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              expect(mockLogger).toHaveBeenCalledTimes(2);
              expect(mockLogger).toHaveBeenNthCalledWith(1, {
                type: "HTTP-Retry",
                content: {
                  requestParams,
                  lastResponse: undefined,
                  retryAttempt: 1,
                  maxRetries: 2,
                },
              });

              expect(mockLogger).toHaveBeenNthCalledWith(2, {
                type: "HTTP-Retry",
                content: {
                  requestParams,
                  lastResponse: undefined,
                  retryAttempt: 2,
                  maxRetries: 2,
                },
              });
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

            it("calls the global fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient({ retries: 1 });

              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetches returned 429 responses", async () => {
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

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockResolvedValue(mockedFailedResponse);

              const response = await client.request(operation);

              expect(response.errors?.networkStatusCode).toBe(status);

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockResolvedValue(mockedFailedResponse);
              await client.fetch(operation);

              const retryLogs = mockLogger.mock.calls.filter(
                (args) => args[0].type === "HTTP-Retry"
              );

              expect(retryLogs.length).toBe(2);

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              const firstLogContent = retryLogs[0][0].content;
              expect(firstLogContent.requestParams).toEqual(requestParams);
              expect(firstLogContent.lastResponse.status).toBe(status);
              expect(firstLogContent.retryAttempt).toBe(1);
              expect(firstLogContent.maxRetries).toBe(2);

              const secondLogContent = retryLogs[1][0].content;
              expect(secondLogContent.requestParams).toEqual(requestParams);
              expect(secondLogContent.lastResponse.status).toBe(status);
              expect(secondLogContent.retryAttempt).toBe(2);
              expect(secondLogContent.maxRetries).toBe(2);
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

            it("calls the global fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetch responses were 503 ", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient({ retries: 1 });

              const response = await client.fetch(operation);

              expect(response.status).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetch responses were 503", async () => {
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

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockResolvedValue(mockedFailedResponse);

              const response = await client.request(operation);

              expect(response.errors?.networkStatusCode).toBe(status);

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockResolvedValue(mockedFailedResponse);
              await client.fetch(operation);

              const retryLogs = mockLogger.mock.calls.filter(
                (args) => args[0].type === "HTTP-Retry"
              );

              expect(retryLogs.length).toBe(2);

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              const firstLogContent = retryLogs[0][0].content;
              expect(firstLogContent.requestParams).toEqual(requestParams);
              expect(firstLogContent.lastResponse.status).toBe(status);
              expect(firstLogContent.retryAttempt).toBe(1);
              expect(firstLogContent.maxRetries).toBe(2);

              const secondLogContent = retryLogs[1][0].content;
              expect(secondLogContent.requestParams).toEqual(requestParams);
              expect(secondLogContent.lastResponse.status).toBe(status);
              expect(secondLogContent.retryAttempt).toBe(2);
              expect(secondLogContent.maxRetries).toBe(2);
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

          it("throws an error when the retries config value is less than 0", async () => {
            const retries = -1;
            await expect(async () => {
              await client.fetch(operation, { retries });
            }).rejects.toThrow(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
            );
          });

          it("throws an error when the retries config value is greater than 3", async () => {
            const retries = 4;
            await expect(async () => {
              await client.fetch(operation, { retries });
            }).rejects.toThrow(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
            );
          });
        });
      });
    });

    describe("request()", () => {
      it("uses the global fetch when a custom fetch API is not provided at initialization", () => {
        const client = getValidClient();

        client.request(operation, {
          variables,
        });

        expect(global.fetch).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
      });

      it("uses the provided custom fetch when a custom fetch API is provided at initialization", () => {
        const customFetchApi = jest
          .fn()
          .mockResolvedValue(new Response(JSON.stringify({ data: {} }))) as any;

        const client = createGraphQLClient({
          ...config,
          fetchApi: customFetchApi,
        });

        const props: [string, RequestOptions] = [
          operation,
          {
            variables,
          },
        ];

        client.request(...props);

        expect(customFetchApi).toHaveBeenCalledWith(config.url, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            query: operation,
            variables,
          }),
        });
        expect(global.fetch).not.toHaveBeenCalled();
      });

      describe("calling the function", () => {
        let client: GraphQLClient;

        beforeEach(() => {
          client = getValidClient();
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
            expect(response).toHaveProperty("errors", {
              networkStatusCode: responseConfig.status,
              message: responseConfig.statusText,
            });
          });

          it("includes an error object if the fetch promise fails", async () => {
            const errorMessage = "Async error message";

            fetchMock.mockRejectedValue(new Error(errorMessage));

            const response = await client.request(operation, { variables });
            expect(response).toHaveProperty("errors", {
              message: `GraphQL Client: ${errorMessage}`,
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
            expect(response).toHaveProperty("errors", {
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
            expect(response).toHaveProperty("errors", {
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
            expect(response).toHaveProperty("errors", {
              networkStatusCode: mockedSuccessResponse.status,
              message:
                "GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.",
            });
          });

          it("includes an error object and a data object if the API returns both errors and data in the response", async () => {
            const gqlError = ["GQL error"];
            const data = { product: { title: "product title" } };

            const responseConfig = {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({ errors: gqlError, data }),
              responseConfig
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);
            const response = await client.request(operation, { variables });

            expect(response).toHaveProperty("data", data);
            expect(response).toHaveProperty("errors", {
              networkStatusCode: responseConfig.status,
              message:
                "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
              graphQLErrors: gqlError,
            });
          });
        });

        describe("retries", () => {
          describe("Aborted fetch responses", () => {
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

              expect(response.errors).toBeUndefined();
              expect(response.data).toEqual(mockResponseData.data);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockAbort();

              await client.request(operation);

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockAbort();

              await client.request(operation);

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              expect(mockLogger).toHaveBeenCalledTimes(2);
              expect(mockLogger).toHaveBeenNthCalledWith(1, {
                type: "HTTP-Retry",
                content: {
                  requestParams,
                  lastResponse: undefined,
                  retryAttempt: 1,
                  maxRetries: 2,
                },
              });

              expect(mockLogger).toHaveBeenNthCalledWith(2, {
                type: "HTTP-Retry",
                content: {
                  requestParams,
                  lastResponse: undefined,
                  retryAttempt: 2,
                  maxRetries: 2,
                },
              });
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

            it("calls the global fetch 1 time and returns a response object with an error when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation);

              expect(response.errors?.message).toBe("Too Many Requests");
              expect(response.errors?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient({ retries: 1 });

              const response = await client.request(operation);

              expect(response.errors?.message).toBe("Too Many Requests");
              expect(response.errors?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches returned 429 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation, { retries: 2 });

              expect(response.errors?.message).toBe("Too Many Requests");
              expect(response.errors?.networkStatusCode).toBe(status);
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

              expect(response.errors?.networkStatusCode).toBe(500);
              expect(response.errors?.message).toEqual("Internal Server Error");
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockResolvedValue(mockedFailedResponse);

              const response = await client.request(operation);

              expect(response.errors?.networkStatusCode).toBe(status);

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockResolvedValue(mockedFailedResponse);
              await client.request(operation);

              const retryLogs = mockLogger.mock.calls.filter(
                (args) => args[0].type === "HTTP-Retry"
              );

              expect(retryLogs.length).toBe(2);

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              const firstLogContent = retryLogs[0][0].content;
              expect(firstLogContent.requestParams).toEqual(requestParams);
              expect(firstLogContent.lastResponse.status).toBe(status);
              expect(firstLogContent.retryAttempt).toBe(1);
              expect(firstLogContent.maxRetries).toBe(2);

              const secondLogContent = retryLogs[1][0].content;
              expect(secondLogContent.requestParams).toEqual(requestParams);
              expect(secondLogContent.lastResponse.status).toBe(status);
              expect(secondLogContent.retryAttempt).toBe(2);
              expect(secondLogContent.maxRetries).toBe(2);
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

            it("calls the global fetch 1 time and returns a response object with an error when the client default retries value is 0", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation);

              expect(response.errors?.message).toBe("Service Unavailable");
              expect(response.errors?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches returned 503 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const client = getValidClient({ retries: 1 });

              const response = await client.request(operation);

              expect(response.errors?.message).toBe("Service Unavailable");
              expect(response.errors?.networkStatusCode).toBe(status);
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches returned 503 responses", async () => {
              fetchMock.mockResolvedValue(mockedFailedResponse);
              const response = await client.request(operation, { retries: 2 });

              expect(response.errors?.message).toBe("Service Unavailable");
              expect(response.errors?.networkStatusCode).toBe(status);
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

              expect(response.errors?.networkStatusCode).toBe(500);
              expect(response.errors?.message).toEqual("Internal Server Error");
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("delays a retry by 1000ms", async () => {
              const client = getValidClient({ retries: 1 });
              fetchMock.mockResolvedValue(mockedFailedResponse);

              const response = await client.request(operation);

              expect(response.errors?.networkStatusCode).toBe(status);

              expect(setTimeout).toHaveBeenCalledTimes(1);
              expect(setTimeout).toHaveBeenCalledWith(
                expect.any(Function),
                1000
              );
            });

            it("logs each retry attempt if a logger is provided", async () => {
              const client = getValidClient({ retries: 2, logger: mockLogger });
              fetchMock.mockResolvedValue(mockedFailedResponse);
              await client.request(operation);

              const retryLogs = mockLogger.mock.calls.filter(
                (args) => args[0].type === "HTTP-Retry"
              );

              expect(retryLogs.length).toBe(2);

              const requestParams = [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ];

              const firstLogContent = retryLogs[0][0].content;
              expect(firstLogContent.requestParams).toEqual(requestParams);
              expect(firstLogContent.lastResponse.status).toBe(status);
              expect(firstLogContent.retryAttempt).toBe(1);
              expect(firstLogContent.maxRetries).toBe(2);

              const secondLogContent = retryLogs[1][0].content;
              expect(secondLogContent.requestParams).toEqual(requestParams);
              expect(secondLogContent.lastResponse.status).toBe(status);
              expect(secondLogContent.retryAttempt).toBe(2);
              expect(secondLogContent.maxRetries).toBe(2);
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

            expect(response.errors?.networkStatusCode).toBe(500);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("returns a response object with an error when the retries config value is less than 0", async () => {
            const retries = -1;

            const response = await client.request(operation, { retries });

            expect(response.errors?.message).toEqual(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
            );
          });

          it("returns a response object with an error when the retries config value is greater than 3", async () => {
            const retries = 4;
            const response = await client.request(operation, { retries });

            expect(response.errors?.message).toEqual(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
            );
          });
        });

        it("logs the request and response info if a logger is provided", async () => {
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

          const client = getValidClient({ logger: mockLogger });

          await client.request(operation);

          expect(mockLogger).toBeCalledWith({
            type: "HTTP-Response",
            content: {
              response: mockedSuccessResponse,
              requestParams: [
                config.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: config.headers,
                },
              ],
            },
          });
        });
      });
    });
  });
});
