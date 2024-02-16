import { createGraphQLClient } from "@shopify/graphql-client";

import { createStorefrontApiClient } from "../../storefront-api-client";
import { StorefrontApiClient } from "../../types";
import {
  SDK_VARIANT_HEADER,
  DEFAULT_SDK_VARIANT,
  SDK_VERSION_HEADER,
  DEFAULT_CLIENT_VERSION,
  SDK_VARIANT_SOURCE_HEADER,
  PUBLIC_ACCESS_TOKEN_HEADER,
  DEFAULT_CONTENT_TYPE,
} from "../../constants";

import {
  mockApiVersions,
  graphqlClientMock,
  config,
  domain,
  mockApiUrl,
} from "./fixtures";

jest.mock("@shopify/graphql-client", () => {
  return {
    ...jest.requireActual("@shopify/graphql-client"),
    createGraphQLClient: jest.fn(),
    getCurrentSupportedApiVersions: () => mockApiVersions,
  };
});

describe("Storefront API Client", () => {
  describe("createStorefrontApiClient()", () => {
    const mockFetchResponse = { status: 200 };
    const mockRequestResponse = {
      data: {},
    };
    const mockRequestStreamResponse = {};

    beforeEach(() => {
      (createGraphQLClient as jest.Mock).mockReturnValue(graphqlClientMock);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    describe("client initialization", () => {
      it("calls the graphql client with headers and API URL", () => {
        const clientName = "test-client";

        createStorefrontApiClient({ ...config, clientName });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("headers", {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Storefront-Access-Token": "public-token",
          [SDK_VARIANT_HEADER]: DEFAULT_SDK_VARIANT,
          [SDK_VERSION_HEADER]: DEFAULT_CLIENT_VERSION,
          [SDK_VARIANT_SOURCE_HEADER]: clientName,
        });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("url", mockApiUrl);
      });

      it("calls the graphql client with the default retries", () => {
        createStorefrontApiClient({ ...config });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("retries", 0);
      });

      it("calls the graphql client with the provided retries", () => {
        const retries = 1;

        createStorefrontApiClient({ ...config, retries });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("retries", retries);
      });

      it("calls the graphql client with the provided customFetchAPI", () => {
        const customFetchApi = jest.fn();

        createStorefrontApiClient({ ...config, customFetchApi });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("customFetchApi", customFetchApi);
      });

      it("calls the graphql client with the provided logger", () => {
        const logger = jest.fn();

        createStorefrontApiClient({ ...config, logger });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("logger", logger);
      });

      it("returns a client object that contains a config object, getters for header and API URL and request, requestStream and fetch functions", () => {
        const client = createStorefrontApiClient(config);

        expect(client).toHaveProperty("config");
        expect(client).toMatchObject({
          getHeaders: expect.any(Function),
          getApiUrl: expect.any(Function),
          fetch: expect.any(Function),
          request: expect.any(Function),
          requestStream: expect.any(Function),
        });
      });

      describe("validations", () => {
        it("throws an error when a store domain is not provided", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              storeDomain: undefined as any,
            }),
          ).toThrow(
            new Error(
              'Storefront API Client: a valid store domain ("undefined") must be provided',
            ),
          );
        });

        it("throws an error when an empty string is provided as the store domain", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              storeDomain: "   ",
            }),
          ).toThrow(
            new Error(
              'Storefront API Client: a valid store domain ("   ") must be provided',
            ),
          );
        });

        it("throws an error when the provided store domain is not a string", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              storeDomain: 123 as any,
            }),
          ).toThrow(
            new Error(
              'Storefront API Client: a valid store domain ("123") must be provided',
            ),
          );
        });

        it("throws an error when the api version is not provided", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              apiVersion: undefined as any,
            }),
          ).toThrow(
            new Error(
              `Storefront API Client: the provided apiVersion ("undefined") is invalid. Currently supported API versions: ${mockApiVersions.join(
                ", ",
              )}`,
            ),
          );
        });

        it("throws an error when the api version is not a string", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              apiVersion: { year: 2022, month: 1 } as any,
            }),
          ).toThrow(
            new Error(
              `Storefront API Client: the provided apiVersion ("[object Object]") is invalid. Currently supported API versions: ${mockApiVersions.join(
                ", ",
              )}`,
            ),
          );
        });

        it("console warns when a unsupported api version is provided", () => {
          const consoleWarnSpy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(jest.fn());

          createStorefrontApiClient({
            ...config,
            apiVersion: "2022-07",
          });

          expect(consoleWarnSpy).toHaveBeenCalledWith(
            `Storefront API Client: the provided apiVersion ("2022-07") is likely deprecated or not supported. Currently supported API versions: ${mockApiVersions.join(
              ", ",
            )}`,
          );
        });

        it("throws an error when neither public and private access tokens are provided", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              publicAccessToken: undefined as any,
            }),
          ).toThrow(
            new Error(
              `Storefront API Client: a public or private access token must be provided`,
            ),
          );
        });
      });
    });

    describe("client config", () => {
      it("returns a config object that includes the provided store domain", () => {
        const client = createStorefrontApiClient(config);
        expect(client.config.storeDomain).toBe(`https://${domain}`);
      });

      it("returns a config object that includes the provided public access token and not a private access token", () => {
        const client = createStorefrontApiClient(config);
        expect(client.config.publicAccessToken).toBe(config.publicAccessToken);
        expect(client.config.privateAccessToken).toBeUndefined();
      });

      it("returns a config object that includes the provided client name", () => {
        const clientName = "test-client";

        const client = createStorefrontApiClient({ ...config, clientName });
        expect(client.config.clientName).toBe(clientName);
      });

      describe("API url", () => {
        const cleanedStoreDomain = "test-store.myshopify.io";
        const expectedAPIUrl = `https://${cleanedStoreDomain}/api/${config.apiVersion}/graphql.json`;

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes 'https'", () => {
          const client = createStorefrontApiClient({
            ...config,
            storeDomain: `https://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes a non-secure protocol", () => {
          const client = createStorefrontApiClient({
            ...config,
            storeDomain: `http://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that does not include a protocol", () => {
          const client = createStorefrontApiClient({
            ...config,
            storeDomain: cleanedStoreDomain,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes a valid API url constructed with the provided spaced out API version and a store domain", () => {
          const client = createStorefrontApiClient({
            ...config,
            storeDomain: ` ${cleanedStoreDomain}   `,
            apiVersion: ` ${config.apiVersion}   `,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });
      });

      describe("config headers", () => {
        it("returns a header object that includes the content-type header", () => {
          const client = createStorefrontApiClient(config);
          expect(client.config.headers["Content-Type"]).toBe(
            DEFAULT_CONTENT_TYPE,
          );
        });

        it("returns a header object that includes the accept header", () => {
          const client = createStorefrontApiClient(config);
          expect(client.config.headers.Accept).toBe(DEFAULT_CONTENT_TYPE);
        });

        it("returns a header object that includes the SDK variant header", () => {
          const client = createStorefrontApiClient(config);
          expect(client.config.headers[SDK_VARIANT_HEADER]).toBe(
            DEFAULT_SDK_VARIANT,
          );
        });

        it("returns a header object that includes the SDK version header", () => {
          const client = createStorefrontApiClient(config);
          expect(client.config.headers[SDK_VERSION_HEADER]).toBe(
            DEFAULT_CLIENT_VERSION,
          );
        });

        it("returns a header object that includes the public headers when a public access token is provided", () => {
          const client = createStorefrontApiClient(config);
          expect(client.config.headers[PUBLIC_ACCESS_TOKEN_HEADER]).toEqual(
            config.publicAccessToken,
          );
        });

        it("returns a header object that includes the SDK variant source header when client name is provided", () => {
          const clientName = "test-client";

          const client = createStorefrontApiClient({ ...config, clientName });
          expect(client.config.headers[SDK_VARIANT_SOURCE_HEADER]).toEqual(
            clientName,
          );
        });

        it("returns a header object that does not include the SDK variant source header when client name is not provided", () => {
          const client = createStorefrontApiClient(config);
          expect(
            client.config.headers[SDK_VARIANT_SOURCE_HEADER],
          ).toBeUndefined();
        });
      });
    });

    describe("client functions", () => {
      const operation = `
          query products{
            products(first: 1) {
              nodes {
                id
                title
              }
            }
          }
        `;

      let client: StorefrontApiClient;

      beforeEach(() => {
        (graphqlClientMock.fetch as jest.Mock).mockResolvedValue(
          mockFetchResponse,
        );

        (graphqlClientMock.request as jest.Mock).mockResolvedValue(
          mockRequestResponse,
        );

        (graphqlClientMock.requestStream as jest.Mock).mockResolvedValue(
          mockRequestStreamResponse,
        );

        client = createStorefrontApiClient(config);
      });

      describe("getHeaders()", () => {
        it("returns the client's default headers if no custom headers are provided", () => {
          const headers = client.getHeaders();
          expect(headers).toEqual(client.config.headers);
        });

        it("returns a headers object that contains both the client default headers and the provided custom headers", () => {
          const headers = {
            "Shopify-Storefront-Id": "test-id",
          };
          const updatedHeaders = client.getHeaders(headers);
          expect(updatedHeaders).toEqual({
            ...headers,
            ...client.config.headers,
          });
        });
      });

      describe("getApiUrl()", () => {
        it("returns the client's default API url if no API version was provided", () => {
          const url = client.getApiUrl();
          expect(url).toBe(client.config.apiUrl);
        });

        it("returns an API url that is directed at the provided api version", () => {
          const version = "unstable";
          const url = client.getApiUrl(version);
          expect(url).toEqual(
            `${config.storeDomain}/api/${version}/graphql.json`,
          );
        });

        it("throws an error when the api version is not a string", () => {
          const version = 123;
          expect(() => client.getApiUrl(version as any)).toThrow(
            new Error(
              `Storefront API Client: the provided apiVersion ("123") is invalid. Currently supported API versions: ${mockApiVersions.join(
                ", ",
              )}`,
            ),
          );
        });

        it("console warns when a unsupported api version is provided", () => {
          const consoleWarnSpy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(jest.fn());

          const version = "2021-01";
          client.getApiUrl(version);

          expect(consoleWarnSpy).toHaveBeenCalledWith(
            `Storefront API Client: the provided apiVersion ("2021-01") is likely deprecated or not supported. Currently supported API versions: ${mockApiVersions.join(
              ", ",
            )}`,
          );
        });
      });

      describe.each([
        ["fetch", mockFetchResponse],
        ["request", mockRequestResponse],
        ["requestStream", mockRequestStreamResponse],
      ])("%s()", (functionName, mockResponse) => {
        describe("parameters", () => {
          it(`calls the graphql client ${functionName}() with just the operation string when there are no options provided`, async () => {
            await client[functionName](operation);

            expect(graphqlClientMock[functionName]).toHaveBeenCalledWith(
              operation,
            );
          });

          it(`calls the graphql client ${functionName}() with provided variables`, async () => {
            const variables = { first: 1 };

            await client[functionName](operation, { variables });
            expect(
              (graphqlClientMock[functionName] as jest.Mock).mock.calls[0][0],
            ).toBe(operation);
            expect(
              (graphqlClientMock[functionName] as jest.Mock).mock.calls[0][1],
            ).toEqual({ variables });
          });

          it(`calls the graphql client ${functionName}() with customized headers`, async () => {
            const headers = { "custom-header": "custom" };

            await client[functionName](operation, { headers });
            expect(
              (
                graphqlClientMock[functionName] as jest.Mock
              ).mock.calls.pop()[1],
            ).toEqual({
              headers: client.getHeaders(headers),
            });
          });

          it(`calls the graphql client ${functionName}() with provided api version URL`, async () => {
            const apiVersion = "unstable";

            await client[functionName](operation, { apiVersion });
            expect(
              (
                graphqlClientMock[functionName] as jest.Mock
              ).mock.calls.pop()[1],
            ).toEqual({
              url: client.getApiUrl(apiVersion),
            });
          });

          it(`calls the graphql client ${functionName}() with provided retries`, async () => {
            const retries = 2;

            await client[functionName](operation, { retries });
            expect(
              (
                graphqlClientMock[functionName] as jest.Mock
              ).mock.calls.pop()[1],
            ).toEqual({
              retries,
            });
          });
        });

        it(`returns the graphql client ${functionName} response`, async () => {
          const response = await client[functionName](operation);
          expect(response).toBe(mockResponse);
        });
      });
    });
  });
});
