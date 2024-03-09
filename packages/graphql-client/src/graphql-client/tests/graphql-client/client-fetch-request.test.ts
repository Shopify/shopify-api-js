import fetchMock from "jest-fetch-mock";

import { GraphQLClient } from "../../types";

import {
  operation,
  variables,
  clientConfig,
  getValidClient,
  defaultHeaders,
} from "./fixtures";
import {
  fetchApiTests,
  parametersTests,
  sdkHeadersTests,
  retryTests,
} from "./common-tests";

describe("GraphQL Client", () => {
  let mockLogger: jest.Mock;
  let client: GraphQLClient;

  fetchMock.enableMocks();

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));
    fetchMock.mockResponse(() => Promise.resolve(JSON.stringify({ data: {} })));
    mockLogger = jest.fn();
    client = getValidClient();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  describe("fetch()", () => {
    const functionName = "fetch";

    fetchApiTests(functionName);

    describe("calling the function", () => {
      describe("function parameters", () => {
        parametersTests(functionName);
      });

      describe("SDK headers", () => {
        sdkHeadersTests(functionName);
      });

      describe("returned object", () => {
        it("returns the HTTP response", async () => {
          const response = await client.fetch(operation);
          expect(response.status).toBe(200);
        });
      });

      describe("retries", () => {
        retryTests(functionName);

        describe("Aborted fetch responses", () => {
          it("calls the global fetch 1 time and throws a plain error when the client retries value is 0", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await client.fetch(operation);
            }).rejects.toThrow(new RegExp(/^GraphQL Client: /));
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and throws a retry error when the client was initialized with 1 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            const client = getValidClient({ retries: 1 });

            await expect(async () => {
              await client.fetch(operation);
            }).rejects.toThrow(
              new RegExp(
                /^GraphQL Client: Attempted maximum number of 1 network retries. Last message - /,
              ),
            );
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and throws a retry error when the function is provided with 2 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await client.fetch(operation, { retries: 2 });
            }).rejects.toThrow(
              new RegExp(
                /^GraphQL Client: Attempted maximum number of 2 network retries. Last message - /,
              ),
            );

            expect(fetchMock).toHaveBeenCalledTimes(3);
          });

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
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockAbort();

            await expect(async () => {
              await client.fetch(operation);
            }).rejects.toThrow();

            const requestParams = [
              clientConfig.url,
              {
                method: "POST",
                body: JSON.stringify({ query: operation }),
                headers: defaultHeaders,
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

        describe.each([
          [429, "Too Many Requests"],
          [503, "Service Unavailable"],
        ])("%i responses", (status, statusText) => {
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
            expect(response.statusText).toBe(statusText);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it(`calls the global fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetches returned ${status} responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const client = getValidClient({ retries: 1 });

            const response = await client.fetch(operation);

            expect(response.status).toBe(status);
            expect(response.statusText).toBe(statusText);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it(`calls the global fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetches returned ${status}  responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await client.fetch(operation, { retries: 2 });

            expect(response.status).toBe(status);
            expect(response.statusText).toBe(statusText);
            expect(fetchMock).toHaveBeenCalledTimes(3);
          });

          it(`returns a valid response after an a failed ${status} fetch response and the next response is valid`, async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 200 }],
            );

            const response = await client.fetch(operation, { retries: 2 });

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockedSuccessData);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it(`returns a failed non 429/503 response after an a failed ${status} fetch response and the next response has failed`, async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 500 }],
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
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockResolvedValue(mockedFailedResponse);
            await client.fetch(operation);

            const retryLogs = mockLogger.mock.calls.filter(
              (args) => args[0].type === "HTTP-Retry",
            );

            expect(retryLogs.length).toBe(2);

            const requestParams = [
              clientConfig.url,
              {
                method: "POST",
                body: JSON.stringify({ query: operation }),
                headers: defaultHeaders,
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

        it("throws an error when the retries config value is less than 0", async () => {
          const retries = -1;
          await expect(async () => {
            await client.fetch(operation, { retries });
          }).rejects.toThrow(
            `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
          );
        });

        it("throws an error when the retries config value is greater than 3", async () => {
          const retries = 4;
          await expect(async () => {
            await client.fetch(operation, { retries });
          }).rejects.toThrow(
            `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
          );
        });
      });

      describe("request/response logging", () => {
        it("logs the request and response info if a logger is provided", async () => {
          const mockResponseData = { data: { shop: { name: "Test shop" } } };
          const mockedSuccessResponse = new Response(
            JSON.stringify(mockResponseData),
            {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            },
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);

          const client = getValidClient({ logger: mockLogger });

          await client.fetch(operation);

          expect(mockLogger).toBeCalledWith({
            type: "HTTP-Response",
            content: {
              response: mockedSuccessResponse,
              requestParams: [
                clientConfig.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: defaultHeaders,
                },
              ],
            },
          });
        });
      });
    });
  });

  describe("request()", () => {
    const functionName = "request";

    fetchApiTests(functionName);

    describe("SDK headers", () => {
      sdkHeadersTests(functionName);
    });

    describe("calling the function", () => {
      describe("function parameters", () => {
        parametersTests(functionName);

        it("throws an error when the operation includes a @defer directive", async () => {
          const customOperation = `
              query {
                shop {
                  id
                  ... @defer {
                    name
                  }
                }
              }
            `;

          await expect(() => client.request(customOperation)).rejects.toThrow(
            new Error(
              "GraphQL Client: This operation will result in a streamable response - use requestStream() instead.",
            ),
          );
        });
      });

      describe("returned object", () => {
        it("includes a data object if the data object is included in the response", async () => {
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
            },
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
            },
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);

          const response = await client.request(operation, { variables });
          expect(response).toHaveProperty("extensions", extensions);
          expect(response).not.toHaveProperty("errors");
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
            message: `GraphQL Client: ${responseConfig.statusText}`,
            response: mockedSuccessResponse,
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
            responseConfig,
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);

          const response = await client.request(operation, { variables });
          expect(response).toHaveProperty("errors", {
            networkStatusCode: responseConfig.status,
            message: `GraphQL Client: Response returned unexpected Content-Type: ${contentType}`,
            response: mockedSuccessResponse,
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
            responseConfig,
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);

          const response = await client.request(operation, { variables });
          expect(response).toHaveProperty("errors", {
            networkStatusCode: responseConfig.status,
            message:
              "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
            graphQLErrors: gqlError,
            response: mockedSuccessResponse,
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
            responseConfig,
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);
          const response = await client.request(operation, { variables });
          expect(response).toHaveProperty("errors", {
            networkStatusCode: mockedSuccessResponse.status,
            message:
              "GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.",
            response: mockedSuccessResponse,
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
            responseConfig,
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);
          const response = await client.request(operation, { variables });

          expect(response).toHaveProperty("data", data);
          expect(response).toHaveProperty("errors", {
            networkStatusCode: responseConfig.status,
            message:
              "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
            graphQLErrors: gqlError,
            response: mockedSuccessResponse,
          });
        });
      });

      describe("retries", () => {
        retryTests(functionName);

        describe("Aborted fetch responses", () => {
          it("calls the global fetch 1 time and returns a response object with a plain error when the client default retries value is 0 ", async () => {
            fetchMock.mockAbort();

            const { errors } = await client.request(operation);

            expect(errors?.message?.startsWith("GraphQL Client: ")).toBe(true);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            const client = getValidClient({ retries: 1 });

            const { errors } = await client.request(operation);

            expect(
              errors?.message?.startsWith(
                "GraphQL Client: Attempted maximum number of 1 network retries. Last message - ",
              ),
            ).toBe(true);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            const { errors } = await client.request(operation, {
              retries: 2,
            });

            expect(
              errors?.message?.startsWith(
                "GraphQL Client: Attempted maximum number of 2 network retries. Last message - ",
              ),
            ).toBe(true);
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
              },
            );

            fetchMock.mockAbortOnce();
            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const response = await client.request(operation, {
              retries: 2,
            });

            expect(response.errors).toBeUndefined();
            expect(response.data).toEqual(mockResponseData.data);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            const client = getValidClient({ retries: 1 });
            fetchMock.mockAbort();

            await client.request(operation);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockAbort();

            await client.request(operation);

            const requestParams = [
              clientConfig.url,
              {
                method: "POST",
                body: JSON.stringify({ query: operation }),
                headers: defaultHeaders,
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

        describe.each([
          [429, "Too Many Requests"],
          [503, "Service Unavailable"],
        ])("%i responses", (status, statusText) => {
          const mockedFailedResponse = new Response(JSON.stringify({}), {
            status,
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          });

          it("calls the global fetch 1 time and returns a response object with an error when the client default retries value is 0", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await client.request(operation);

            expect(response.errors?.message).toBe(
              `GraphQL Client: ${statusText}`,
            );
            expect(response.errors?.networkStatusCode).toBe(status);
            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it(`calls the global fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches returned ${status} responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const client = getValidClient({ retries: 1 });

            const response = await client.request(operation);

            expect(response.errors?.message).toBe(
              `GraphQL Client: ${statusText}`,
            );
            expect(response.errors?.networkStatusCode).toBe(status);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it(`calls the global fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches returned ${status} responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await client.request(operation, {
              retries: 2,
            });

            expect(response.errors?.message).toBe(
              `GraphQL Client: ${statusText}`,
            );
            expect(response.errors?.networkStatusCode).toBe(status);
            expect(fetchMock).toHaveBeenCalledTimes(3);
          });

          it(`returns a valid response after an a failed ${status} fetch response and the next response is valid`, async () => {
            const mockedSuccessData = { data: { shop: { name: "shop1" } } };
            fetchMock.mockResponses(
              ["", { status }],
              [
                JSON.stringify(mockedSuccessData),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                },
              ],
            );

            const response = await client.request(operation, {
              retries: 2,
            });

            expect(response.data).toEqual(mockedSuccessData.data);
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it(`returns a failed non 429/503 response after an a failed ${status} fetch response and the next response has failed`, async () => {
            fetchMock.mockResponses(["", { status }], ["", { status: 500 }]);

            const response = await client.request(operation, {
              retries: 2,
            });

            expect(response.errors?.networkStatusCode).toBe(500);
            expect(response.errors?.message).toEqual(
              "GraphQL Client: Internal Server Error",
            );
            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            const client = getValidClient({ retries: 1 });
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const response = await client.request(operation);

            expect(response.errors?.networkStatusCode).toBe(status);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockResolvedValue(mockedFailedResponse);
            await client.request(operation);

            const retryLogs = mockLogger.mock.calls.filter(
              (args) => args[0].type === "HTTP-Retry",
            );

            expect(retryLogs.length).toBe(2);

            const requestParams = [
              clientConfig.url,
              {
                method: "POST",
                body: JSON.stringify({ query: operation }),
                headers: defaultHeaders,
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

        it("returns a response object with an error when the retries config value is less than 0", async () => {
          const retries = -1;

          const response = await client.request(operation, { retries });

          expect(response.errors?.message).toEqual(
            `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
          );
        });

        it("returns a response object with an error when the retries config value is greater than 3", async () => {
          const retries = 4;
          const response = await client.request(operation, { retries });

          expect(response.errors?.message).toEqual(
            `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
          );
        });
      });

      describe("request/response logging", () => {
        it("logs the request and response info if a logger is provided", async () => {
          const mockResponseData = { data: { shop: { name: "Test shop" } } };
          const mockedSuccessResponse = new Response(
            JSON.stringify(mockResponseData),
            {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            },
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);

          const client = getValidClient({ logger: mockLogger });

          await client.request(operation);

          expect(mockLogger).toBeCalledWith({
            type: "HTTP-Response",
            content: {
              response: mockedSuccessResponse,
              requestParams: [
                clientConfig.url,
                {
                  method: "POST",
                  body: JSON.stringify({ query: operation }),
                  headers: defaultHeaders,
                },
              ],
            },
          });
        });
      });
    });
  });
});
