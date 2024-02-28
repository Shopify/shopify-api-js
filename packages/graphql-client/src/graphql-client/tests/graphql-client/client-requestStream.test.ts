import fetchMock from "jest-fetch-mock";

import { GraphQLClient, ClientStreamResponse } from "../../types";

import {
  clientConfig,
  getValidClient,
  createIterableResponse,
  createIterableBufferResponse,
  createReaderStreamResponse,
  defaultHeaders,
} from "./fixtures";
import {
  fetchApiTests,
  parametersTests,
  sdkHeadersTests,
  retryTests,
} from "./common-tests";

const operation = `
query shop($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  shop {
    id
    ... @defer {
      name
      description
    }
  }
}
`;

const variables = {
  language: "EN",
  country: "JP",
};

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

  describe("requestStream()", () => {
    const functionName = "requestStream";

    const id = "gid://shopify/Shop/1";
    const name = "Shop 1";
    const description = "Test shop description";

    fetchApiTests(functionName, operation);

    describe("SDK headers", () => {
      sdkHeadersTests(functionName, operation);
    });

    describe("calling the function", () => {
      describe("fetch parameters", () => {
        parametersTests("requestStream", operation);

        it("throws an error if the operation does not include the defer directive", async () => {
          const customOperation = `
              query {
                shop {
                  name
                }
              }
            `;

          await expect(() =>
            client.requestStream(customOperation),
          ).rejects.toThrow(
            new Error(
              "GraphQL Client: This operation does not result in a streamable response - use request() instead.",
            ),
          );
        });
      });

      describe("returned async iterator", () => {
        it("returns an async iterator that returns an object that includes an error object if the response is not ok", async () => {
          const responseConfig = {
            status: 400,
            statusText: "Bad request",
            ok: false,
            headers: new Headers({
              "Content-Type": "application/json",
            }),
            json: jest.fn(),
          };

          const mockedFailedResponse = new Response("", responseConfig);

          fetchMock.mockResolvedValue(mockedFailedResponse);

          const responseStream = await client.requestStream(operation, {
            variables,
          });

          for await (const response of responseStream) {
            expect(response).toHaveProperty("errors", {
              networkStatusCode: responseConfig.status,
              message: `GraphQL Client: ${responseConfig.statusText}`,
              response: mockedFailedResponse,
            });
          }
        });

        it("returns an async iterator that returns an object that includes an error object if the fetch promise fails", async () => {
          const errorMessage = "Async error message";

          fetchMock.mockRejectedValue(new Error(errorMessage));

          const responseStream = await client.requestStream(operation, {
            variables,
          });

          for await (const response of responseStream) {
            expect(response).toHaveProperty("errors", {
              message: `GraphQL Client: ${errorMessage}`,
            });
          }
        });

        describe("response is unexpected Content-Type", () => {
          it("returns an async iterator that returns an object with an error object if the content type is not JSON or Multipart", async () => {
            const contentType = "text/html";

            const responseConfig = {
              status: 200,
              ok: true,
              headers: new Headers({
                "Content-Type": contentType,
              }),
              json: jest.fn(),
            };

            const mockedSuccessResponse = new Response("", responseConfig);

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              variables,
            });

            for await (const response of responseStream) {
              expect(response).toHaveProperty("errors", {
                networkStatusCode: mockedSuccessResponse.status,
                message: `GraphQL Client: Response returned unexpected Content-Type: ${contentType}`,
                response: mockedSuccessResponse,
              });
            }
          });
        });

        describe("response is Content-Type: application/json", () => {
          const headers = new Headers({
            "Content-Type": "application/json",
          });

          it("returns an async iterator that returns an object that includes the response data object and extensions and has a false hasNext value", async () => {
            const mockResponseData = {
              data: { shop: { name: "Test shop" } },
              extensions: {
                context: {
                  country: "JP",
                  language: "ja",
                },
              },
            };

            const responseConfig = {
              status: 200,
              ok: true,
              headers,
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify(mockResponseData),
              responseConfig,
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              variables,
            });

            for await (const response of responseStream) {
              expect(response).toHaveProperty("data", mockResponseData.data);
              expect(response).toHaveProperty(
                "extensions",
                mockResponseData.extensions,
              );
              expect(response).toHaveProperty("hasNext", false);
            }
          });

          it("returns an async iterator that returns an object that includes an error object if the API response contains errors", async () => {
            const gqlError = ["GQL error"];

            const responseConfig = {
              status: 200,
              ok: true,
              headers,
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({ errors: gqlError }),
              responseConfig,
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              variables,
            });

            for await (const response of responseStream) {
              expect(response).toHaveProperty("errors", {
                networkStatusCode: responseConfig.status,
                message:
                  "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
                graphQLErrors: gqlError,
                response: mockedSuccessResponse,
              });
            }
          });

          it("returns an async iterator that returns an object that includes an error object if the API does not throw or return an error and does not include a data object in its response", async () => {
            const responseConfig = {
              status: 200,
              ok: true,
              headers,
            };

            const mockedSuccessResponse = new Response(
              JSON.stringify({}),
              responseConfig,
            );

            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              variables,
            });

            for await (const response of responseStream) {
              expect(response).toHaveProperty("errors", {
                networkStatusCode: mockedSuccessResponse.status,
                message:
                  "GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.",
                response: mockedSuccessResponse,
              });
            }
          });
        });

        describe("response is Content-Type: multipart/mixed", () => {
          describe.each([
            ["Readable Stream", createReaderStreamResponse],
            ["Async Iterator - Encoded (ArrayBuffer)", createIterableResponse],
            ["Async Iterator - Buffer", createIterableBufferResponse],
          ])("Server responded with a %s", (_name, responseGenerator) => {
            const streamCompleteDataChunks: [string, string[]] = [
              "stream multiple, complete data chunk",
              [
                `
                  --graphql
                  Content-Type: application/json
                  Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context": {"country": "${variables.country}", "language": "${variables.language}"}},"hasNext":true}
                  --graphql

                  `,
                `
                  Content-Type: application/json
                  Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}","description":"${description}"},"errors":[]}],"hasNext":false}

                  --graphql--`,
              ],
            ];

            const streamIncompleteDataChunks: [string, string[]] = [
              "stream multiple, incomplete data chunk",
              [
                `
                      --graphql
                      Content-Type: app`,
                `lication/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"`,
                `${id}"}},"exte`,
                `nsions":{"context":{"country":"`,
                `${variables.country}","language":"${variables.language}"}},"hasNext":true}
                      --graphql

                      `,
                `
                      Content-Type: appli`,
                `cation/json
                      Content-Length: 77\r\n`,
                `\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}","descripti`,
                `on":"${description}"},"errors":[]}],"hasNext":false}

                      --graphql--`,
              ],
            ];

            describe.each([
              streamCompleteDataChunks,
              streamIncompleteDataChunks,
            ])("%s", (_name, multipleResponsesArray) => {
              let results: any;
              let responseStream: any;

              beforeAll(async () => {
                const mockedSuccessResponse = responseGenerator(
                  multipleResponsesArray,
                );

                fetchMock.mockResolvedValue(mockedSuccessResponse);

                responseStream = await client.requestStream(operation, {
                  variables,
                });

                results = [];

                for await (const response of responseStream) {
                  results.push(response);
                }
              });

              afterAll(() => {
                jest.resetAllMocks();
              });

              it("returns an async iterator and the iterator returned 2 response objects", () => {
                expect(responseStream[Symbol.asyncIterator]).toBeDefined();
                expect(results.length).toBe(2);
              });

              describe("response objects returned by iterator", () => {
                let response: ClientStreamResponse;

                describe("initial response object", () => {
                  beforeAll(() => {
                    response = results[0];
                  });

                  it("contains a data object that is the first chunk of data", () => {
                    expect(response.data).toEqual({
                      shop: {
                        id,
                      },
                    });
                  });

                  it("contains the extensions object", () => {
                    expect(response.extensions).toEqual({
                      context: {
                        language: variables.language,
                        country: variables.country,
                      },
                    });
                  });

                  it("contains a true hasNext flag", () => {
                    expect(response.hasNext).toBe(true);
                  });
                });

                describe("last response object", () => {
                  beforeAll(() => {
                    response = results[1];
                  });

                  it("contains a data object that is a combination of all the data chunks", () => {
                    expect(response.data).toEqual({
                      shop: {
                        id,
                        name,
                        description,
                      },
                    });
                  });

                  it("contains the extensions object", () => {
                    expect(response.extensions).toEqual({
                      context: {
                        language: variables.language,
                        country: variables.country,
                      },
                    });
                  });

                  it("contains a false hasNext flag", () => {
                    expect(response.hasNext).toBe(false);
                  });

                  it("does not contain the errors object", () => {
                    expect(response.errors).toBeUndefined();
                  });
                });
              });
            });

            describe("stream a single completed data chunk", () => {
              const multipleResponsesArray = [
                `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context":{"country":"${variables.country}","language":"${variables.language}"}},"hasNext":true}
                      --graphql

                      Content-Type: application/json
                      Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}","description":"${description}"}, "errors":[]}],"hasNext":false}

                      --graphql--`,
              ];

              let results: any;
              let responseStream: any;

              beforeAll(async () => {
                const mockedSuccessResponse = responseGenerator(
                  multipleResponsesArray,
                );

                fetchMock.mockResolvedValue(mockedSuccessResponse);

                responseStream = await client.requestStream(operation, {
                  variables,
                });

                results = [];

                for await (const response of responseStream) {
                  results.push(response);
                }
              });

              afterAll(() => {
                jest.resetAllMocks();
              });

              it("returns an async iterator and the iterator returned 1 response object", () => {
                expect(responseStream[Symbol.asyncIterator]).toBeDefined();
                expect(results.length).toBe(1);
              });

              describe("single response object returned by iterator", () => {
                let response: ClientStreamResponse;

                beforeAll(() => {
                  response = results[0];
                });

                it("contains a data object that is the combination of all chunk data", () => {
                  expect(response.data).toEqual({
                    shop: {
                      id,
                      name,
                      description,
                    },
                  });
                });

                it("contains the extensions object", () => {
                  expect(response.extensions).toEqual({
                    context: {
                      language: variables.language,
                      country: variables.country,
                    },
                  });
                });

                it("contains a false hasNext flag", () => {
                  expect(response.hasNext).toBe(false);
                });

                it("does not contain the errors object", () => {
                  expect(response.errors).toBeUndefined();
                });
              });
            });

            describe("incremental array contains multiple chunks", () => {
              const multipleResponsesArray = [
                `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context":{"country":"${variables.country}","language":"${variables.language}"}},"hasNext":true}
                      --graphql

                      Content-Type: application/json
                      Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}"}, "errors":[]},{"path":["shop"],"data":{"description":"${description}"}, "errors":[]}],"hasNext":false}

                      --graphql--`,
              ];

              let results: any;
              let responseStream: any;

              beforeAll(async () => {
                const mockedSuccessResponse = responseGenerator(
                  multipleResponsesArray,
                );

                fetchMock.mockResolvedValue(mockedSuccessResponse);

                responseStream = await client.requestStream(operation, {
                  variables,
                });

                results = [];

                for await (const response of responseStream) {
                  results.push(response);
                }
              });

              afterAll(() => {
                jest.resetAllMocks();
              });

              it("returns an async iterator and the iterator returned 1 response object", () => {
                expect(responseStream[Symbol.asyncIterator]).toBeDefined();
                expect(results.length).toBe(1);
              });

              describe("single response object returned by iterator", () => {
                let response: ClientStreamResponse;

                beforeAll(() => {
                  response = results[0];
                });

                it("contains a data object that is the combination of all chunk data", () => {
                  expect(response.data).toEqual({
                    shop: {
                      id,
                      name,
                      description,
                    },
                  });
                });

                it("contains the extensions object", () => {
                  expect(response.extensions).toEqual({
                    context: {
                      language: variables.language,
                      country: variables.country,
                    },
                  });
                });

                it("contains a false hasNext flag", () => {
                  expect(response.hasNext).toBe(false);
                });

                it("does not contain the errors object", () => {
                  expect(response.errors).toBeUndefined();
                });
              });
            });

            describe("no extensions", () => {
              const multipleResponsesArray = [
                `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}}, "hasNext":true}
                      --graphql

                      `,
                `
                      Content-Type: application/json
                      Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}","description":"${description}"}}],"hasNext":false}

                      --graphql--`,
              ];

              let results: any;
              let responseStream: any;

              beforeAll(async () => {
                const mockedSuccessResponse = responseGenerator(
                  multipleResponsesArray,
                );

                fetchMock.mockResolvedValue(mockedSuccessResponse);

                responseStream = await client.requestStream(operation);

                results = [];

                for await (const response of responseStream) {
                  results.push(response);
                }
              });

              afterAll(() => {
                jest.resetAllMocks();
              });

              describe("response objects returned by iterator", () => {
                describe("initial response object", () => {
                  it("does not contain the extensions object", () => {
                    expect(results[0].extensions).toBeUndefined();
                  });
                });

                describe("last response object", () => {
                  it("does not contain the extensions object", () => {
                    expect(results[1].extensions).toBeUndefined();
                  });
                });
              });
            });

            describe("error scenarios", () => {
              describe("errors while processing data stream", () => {
                describe("unexpected or premature termination of stream data", () => {
                  it("returns an async iterator that returns a response object with no data field and an incomplete data error when the stream ends prematurely", async () => {
                    const multipleResponsesArray = [
                      `
                          --graphql
                          Content-Type: application/json
                          Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},
                          `,
                    ];

                    const mockedSuccessResponse = responseGenerator(
                      multipleResponsesArray,
                    );

                    fetchMock.mockResolvedValue(mockedSuccessResponse);

                    const responseStream =
                      await client.requestStream(operation);

                    const results: any = [];

                    for await (const response of responseStream) {
                      results.push(response);
                    }

                    expect(results[0].errors).toEqual({
                      networkStatusCode: 200,
                      message:
                        "GraphQL Client: Response stream terminated unexpectedly",
                      response: mockedSuccessResponse,
                    });

                    expect(results[0].data).toBeUndefined();
                  });

                  it("returns an async iterator that returns a response object with partial data and an incomplete data error when the stream ends before all deferred chunks are returned", async () => {
                    const multipleResponsesArray = [
                      `
                        --graphql
                        Content-Type: application/json
                        Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context": {"country": "${variables.country}", "language": "${variables.language}"}},"hasNext":true}
                        --graphql

                        `,
                    ];

                    const mockedSuccessResponse = responseGenerator(
                      multipleResponsesArray,
                    );

                    fetchMock.mockResolvedValue(mockedSuccessResponse);

                    const responseStream = await client.requestStream(
                      operation,
                      {
                        variables,
                      },
                    );

                    const results: any = [];

                    for await (const response of responseStream) {
                      results.push(response);
                    }

                    const lastResponse = results.slice(-1)[0];
                    expect(lastResponse.data).toEqual({
                      shop: { id },
                    });

                    expect(lastResponse.errors).toEqual({
                      networkStatusCode: 200,
                      message:
                        "GraphQL Client: Response stream terminated unexpectedly",
                      response: mockedSuccessResponse,
                    });
                  });
                });

                it("returns an async iterator that returns a response object with no data value and a JSON parsing error if the returned data is a malformed JSON", async () => {
                  const multipleResponsesArray = [
                    `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}}},"extensions":{"context": {"country": "${variables.country}", "language": "${variables.language}"}},"hasNext":false}
                      --graphql--
                      `,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(operation, {
                    variables,
                  });

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  const response = results[0];
                  const errors = response.errors;
                  expect(errors.networkStatusCode).toBe(200);
                  expect(errors.message).toMatch(
                    new RegExp(
                      /^GraphQL Client: Error in parsing multipart response - /,
                    ),
                  );
                  expect(errors.response).toBe(mockedSuccessResponse);

                  expect(response.data).toBeUndefined();
                });
              });

              describe("GQL errors", () => {
                it("returns an async iterator that returns a response object with no data value and a GQL error if the initial returned response payload contains only an errors field", async () => {
                  const errors = [
                    {
                      message: "Field 'test' doesn't exist on type 'Shop'",
                      locations: [{ line: 5, column: 11 }],
                      path: ["query shop", "shop", "test"],
                      extensions: {
                        code: "undefinedField",
                        typeName: "Shop",
                        fieldName: "test",
                      },
                    },
                  ];

                  const multipleResponsesArray = [
                    `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"errors":${JSON.stringify(
                        errors,
                      )},"hasNext":false}
                      --graphql--
                      `,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(operation, {
                    variables,
                  });

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  expect(results[0].errors).toEqual({
                    networkStatusCode: 200,
                    message:
                      "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
                    graphQLErrors: errors,
                    response: mockedSuccessResponse,
                  });

                  expect(results[0].data).toBeUndefined();
                });

                it("returns an async iterator that returns a response object with partial data and a GQL error if the initial returned response payload contains both data and error values", async () => {
                  const errors = [
                    {
                      message: "Field 'test' doesn't exist on type 'Shop'",
                      locations: [{ line: 5, column: 11 }],
                      path: ["query shop", "shop", "test"],
                      extensions: {
                        code: "undefinedField",
                        typeName: "Shop",
                        fieldName: "test",
                      },
                    },
                  ];

                  const multipleResponsesArray = [
                    `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"errors":${JSON.stringify(
                        errors,
                      )},"hasNext":false}
                      --graphql--
                      `,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(operation);

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  const response = results[0];
                  expect(response.data).toEqual({
                    shop: {
                      id,
                    },
                  });

                  expect(response.errors).toEqual({
                    networkStatusCode: 200,
                    message:
                      "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
                    graphQLErrors: errors,
                    response: mockedSuccessResponse,
                  });
                });

                it("returns an async iterator that returns a response object with the initial data value and a GQL error if the incremental response payload contains only an errors field", async () => {
                  const errors = [
                    {
                      message:
                        "Access denied for description field. Required access: `fake_unauthenticated_read_shop_description` access scope.",
                      locations: [
                        {
                          line: 7,
                          column: 13,
                        },
                      ],
                      path: ["shop", "description"],
                      extensions: {
                        code: "ACCESS_DENIED",
                        documentation:
                          "https://shopify.dev/api/usage/access-scopes",
                        requiredAccess:
                          "`fake_unauthenticated_read_shop_description` access scope.",
                      },
                    },
                  ];

                  const multipleResponsesArray = [
                    `
                          --graphql
                          Content-Type: application/json
                          Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context":{"country":"${
                            variables.country
                          }","language":"${
                            variables.language
                          }"}},"hasNext":true}
                          --graphql

                          Content-Type: application/json
                          Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"], "errors":${JSON.stringify(
                            errors,
                          )}}],"hasNext":false}

                          --graphql--`,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(operation, {
                    variables,
                  });

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  expect(results.length).toBe(1);

                  expect(results[0].errors).toEqual({
                    networkStatusCode: 200,
                    message:
                      "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
                    graphQLErrors: errors,
                    response: mockedSuccessResponse,
                  });

                  expect(results[0].data).toEqual({
                    shop: {
                      id,
                    },
                  });
                });

                it("returns an async iterator that returns a response object with a combined data value and a GQL error if the incremental response payloads contains both data and errors fields", async () => {
                  const primaryDomain = "https://test.shopify.com";

                  const shopOperation = `
                    query shop($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
                      shop {
                        id
                        ... @defer {
                          name
                        }
                        ... @defer {
                          description
                          primaryDomain
                        }
                      }
                    }
                    `;

                  const errors = [
                    {
                      message:
                        "Access denied for description field. Required access: `fake_unauthenticated_read_shop_description` access scope.",
                      locations: [
                        {
                          line: 7,
                          column: 13,
                        },
                      ],
                      path: ["shop", "description"],
                      extensions: {
                        code: "ACCESS_DENIED",
                        documentation:
                          "https://shopify.dev/api/usage/access-scopes",
                        requiredAccess:
                          "`fake_unauthenticated_read_shop_description` access scope.",
                      },
                    },
                  ];

                  const multipleResponsesArray = [
                    `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"extensions":{"context":{"country":"${
                        variables.country
                      }","language":"${variables.language}"}},"hasNext":true}
                      --graphql

                      Content-Type: application/json
                      Content-Length: 77\r\n\r\n{"incremental":[{"path":["shop"],"data":{"name":"${name}"}},{"path":["shop"],"data":{"primaryDomain":"${primaryDomain}"}, "errors":${JSON.stringify(
                        errors,
                      )}}],"hasNext":false}

                      --graphql--`,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(
                    shopOperation,
                    {
                      variables,
                    },
                  );

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  expect(results.length).toBe(1);

                  expect(results[0].errors).toEqual({
                    networkStatusCode: 200,
                    message:
                      "GraphQL Client: An error occurred while fetching from the API. Review 'graphQLErrors' for details.",
                    graphQLErrors: errors,
                    response: mockedSuccessResponse,
                  });

                  expect(results[0].data).toEqual({
                    shop: {
                      id,
                      name,
                      primaryDomain,
                    },
                  });
                });

                it("returns an async iterator that returns a response object with a no data returned error if the returned payload does not have an errors and data fields", async () => {
                  const multipleResponsesArray = [
                    `
                      --graphql
                      Content-Type: application/json
                      Content-Length: 120\r\n\r\n{"extensions":{"context": {"country": "${variables.country}", "language": "${variables.language}"}},"hasNext":false}
                      --graphql--
                      `,
                  ];

                  const mockedSuccessResponse = responseGenerator(
                    multipleResponsesArray,
                  );

                  fetchMock.mockResolvedValue(mockedSuccessResponse);

                  const responseStream = await client.requestStream(operation, {
                    variables,
                  });

                  const results: any = [];

                  for await (const response of responseStream) {
                    results.push(response);
                  }

                  expect(results[0].data).toBeUndefined();
                  expect(results[0].errors).toEqual({
                    networkStatusCode: 200,
                    message:
                      "GraphQL Client: An unknown error has occurred. The API did not return a data object or any errors in its response.",
                    response: mockedSuccessResponse,
                  });
                });
              });
            });
          });
        });
      });

      describe("retries", () => {
        const multipleResponsesArray = [
          `
              --graphql
              Content-Type: application/json
              Content-Length: 120\r\n\r\n{"data":{"shop":{"id":"${id}"}},"hasNext":true}
              --graphql

              `,
          `
              Content-Type: application/json
              Content-Length: 77\r\n\r\n{"path":["shop"],"data":{"name":"${name}","description":"${description}"},"hasNext":false,"errors":[]}

              --graphql--`,
        ];

        retryTests(functionName, operation);

        describe("Aborted fetch responses", () => {
          it("calls the global fetch 1 time and the async iterator returns a response object with a plain error when the client default retries value is 0 ", async () => {
            fetchMock.mockAbort();

            const responseStream = await client.requestStream(operation);

            for await (const response of responseStream) {
              expect(
                response.errors?.message?.startsWith("GraphQL Client: "),
              ).toBe(true);
            }

            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and the async iterator returns a response object with an error when the client was initialized with 1 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            const client = getValidClient({ retries: 1 });

            const responseStream = await client.requestStream(operation);

            for await (const response of responseStream) {
              expect(
                response.errors?.message?.startsWith(
                  "GraphQL Client: Attempted maximum number of 1 network retries. Last message - ",
                ),
              ).toBe(true);
            }

            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and the async iterator returns a response object with an error when the function is provided with 2 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            const responseStream = await client.requestStream(operation, {
              retries: 2,
            });

            for await (const response of responseStream) {
              expect(
                response.errors?.message?.startsWith(
                  "GraphQL Client: Attempted maximum number of 2 network retries. Last message - ",
                ),
              ).toBe(true);
            }

            expect(fetchMock).toHaveBeenCalledTimes(3);
          });

          it("returns a async iterator that returns valid response objects without an error property after an aborted fetch and the next response is valid", async () => {
            const mockedSuccessResponse = createReaderStreamResponse(
              multipleResponsesArray,
            );

            fetchMock.mockAbortOnce();
            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              retries: 2,
            });

            for await (const response of responseStream) {
              expect(response.errors).toBeUndefined();
              expect(response.data).toBeDefined();
            }

            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            const client = getValidClient({ retries: 1 });
            fetchMock.mockAbort();

            await client.requestStream(operation);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockAbort();

            await client.requestStream(operation);

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

          it("calls the global fetch 1 time and the async iterator returns a response object with an error when the client default retries value is 0", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const responseStream = await client.requestStream(operation);

            for await (const response of responseStream) {
              expect(response.errors?.message).toBe(
                `GraphQL Client: ${statusText}`,
              );
              expect(response.errors?.networkStatusCode).toBe(status);
            }

            expect(fetchMock).toHaveBeenCalledTimes(1);
          });

          it(`calls the global fetch 2 times and the async iterator returns a response object with an error when the client was initialized with 1 retries and all fetches returned ${status} responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const client = getValidClient({ retries: 1 });

            const responseStream = await client.requestStream(operation);

            for await (const response of responseStream) {
              expect(response.errors?.message).toBe(
                `GraphQL Client: ${statusText}`,
              );
              expect(response.errors?.networkStatusCode).toBe(status);
            }

            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it(`calls the global fetch 3 times and the async iterator returns a response object with an error when the function is provided with 2 retries and all fetches returned ${status} responses`, async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const responseStream = await client.requestStream(operation, {
              retries: 2,
            });

            for await (const response of responseStream) {
              expect(response.errors?.message).toBe(
                `GraphQL Client: ${statusText}`,
              );
              expect(response.errors?.networkStatusCode).toBe(status);
            }

            expect(fetchMock).toHaveBeenCalledTimes(3);
          });

          it(`returns a async iterator that returns valid response objects without an error property after a failed ${status} response and the next response is valid`, async () => {
            const mockedSuccessResponse = createReaderStreamResponse(
              multipleResponsesArray,
            );

            fetchMock.mockResolvedValueOnce(mockedFailedResponse);
            fetchMock.mockResolvedValue(mockedSuccessResponse);

            const responseStream = await client.requestStream(operation, {
              retries: 2,
            });

            for await (const response of responseStream) {
              expect(response.errors).toBeUndefined();
              expect(response.data).toBeDefined();
            }

            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("returns a failed non 429/503 response after an a failed 429 fetch response and the next response has failed", async () => {
            const mockedFailed500Response = new Response(JSON.stringify({}), {
              status: 500,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            });

            fetchMock.mockResolvedValueOnce(mockedFailedResponse);
            fetchMock.mockResolvedValue(mockedFailed500Response);

            const responseStream = await client.requestStream(operation, {
              retries: 2,
            });

            for await (const response of responseStream) {
              expect(response.errors?.networkStatusCode).toBe(500);
              expect(response.errors?.message).toEqual(
                "GraphQL Client: Internal Server Error",
              );
            }

            expect(fetchMock).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            const client = getValidClient({ retries: 1 });
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const responseStream = await client.requestStream(operation);

            for await (const response of responseStream) {
              expect(response.errors?.networkStatusCode).toBe(status);
            }

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            const client = getValidClient({
              retries: 2,
              logger: mockLogger,
            });
            fetchMock.mockResolvedValue(mockedFailedResponse);
            await client.requestStream(operation);

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

          const responseStream = await client.requestStream(operation, {
            retries,
          });

          for await (const response of responseStream) {
            expect(response.errors?.message).toEqual(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
            );
          }
        });

        it("returns a response object with an error when the retries config value is greater than 3", async () => {
          const retries = 4;
          const responseStream = await client.requestStream(operation, {
            retries,
          });

          for await (const response of responseStream) {
            expect(response.errors?.message).toEqual(
              `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
            );
          }
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

          await client.requestStream(operation);

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
