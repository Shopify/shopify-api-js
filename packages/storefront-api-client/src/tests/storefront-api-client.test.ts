import { createGraphQLClient, GraphQLClient } from "@shopify/graphql-client";
import { StorefrontAPIClient } from "types";

import { createStorefrontAPIClient } from "../storefront-api-client";
import {
  SDK_VARIANT_HEADER,
  DEFAULT_SDK_VARIANT,
  SDK_VERSION_HEADER,
  DEFAULT_CLIENT_VERSION,
  SDK_VARIANT_SOURCE_HEADER,
  PUBLIC_ACCESS_TOKEN_HEADER,
  PRIVATE_ACCESS_TOKEN_HEADER,
  DEFAULT_CONTENT_TYPE,
} from "../constants";

const mockApiVersions = [
  "2023-01",
  "2023-04",
  "2023-07",
  "2023-10",
  "2024-01",
  "unstable",
];

jest.mock("../utilities/api-versions", () => {
  return {
    ...jest.requireActual("../utilities/api-versions"),
    getCurrentSupportedAPIVersions: () => mockApiVersions,
  };
});

jest.mock("@shopify/graphql-client", () => {
  return {
    ...jest.requireActual("@shopify/graphql-client"),
    createGraphQLClient: jest.fn(),
  };
});

describe("Storefront API Client", () => {
  describe("createStorefrontAPIClient()", () => {
    const config = {
      storeDomain: "https://test-store.myshopify.io",
      apiVersion: "2023-10",
      publicAccessToken: "public-token",
    };
    const mockApiUrl = `${config.storeDomain}/api/2023-10/graphql.json`;

    const graphqlClientMock: GraphQLClient = {
      config: {
        url: mockApiUrl,
        headers: {},
        retries: 0,
      },
      fetch: jest.fn(),
      request: jest.fn(),
    };

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

        createStorefrontAPIClient({ ...config, clientName });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0]
        ).toHaveProperty("headers", {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Storefront-Access-Token": "public-token",
          [SDK_VARIANT_HEADER]: DEFAULT_SDK_VARIANT,
          [SDK_VERSION_HEADER]: DEFAULT_CLIENT_VERSION,
          [SDK_VARIANT_SOURCE_HEADER]: clientName,
        });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0]
        ).toHaveProperty("url", mockApiUrl);
      });

      it("calls the graphql client with the provided customFetchAPI", () => {
        const customFetchAPI = jest.fn();

        createStorefrontAPIClient({ ...config, customFetchAPI });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0]
        ).toHaveProperty("fetchAPI", customFetchAPI);
      });

      it("returns a client object that contains a config object, getters for header and API URL and request and fetch functions", () => {
        const client = createStorefrontAPIClient(config);

        expect(client).toHaveProperty("config");
        expect(client).toMatchObject({
          getHeaders: expect.any(Function),
          getApiUrl: expect.any(Function),
          request: expect.any(Function),
          fetch: expect.any(Function),
        });
      });

      describe("validations", () => {
        it("throws an error when a store domain is not provided", () => {
          expect(() =>
            createStorefrontAPIClient({
              ...config,
              // @ts-ignore
              storeDomain: undefined,
            })
          ).toThrow(
            new Error(
              "Storefront API Client: a valid store domain must be provided"
            )
          );
        });

        it("throws an error when an empty string is provided as the store domain", () => {
          expect(() =>
            createStorefrontAPIClient({
              ...config,
              // @ts-ignore
              storeDomain: "   ",
            })
          ).toThrow(
            new Error(
              "Storefront API Client: a valid store domain must be provided"
            )
          );
        });

        it("throws an error when the provided store domain is not a string", () => {
          expect(() =>
            createStorefrontAPIClient({
              ...config,
              // @ts-ignore
              storeDomain: 123,
            })
          ).toThrow(
            new Error(
              "Storefront API Client: a valid store domain must be provided"
            )
          );
        });

        it("throws an error when the api version is not provided", () => {
          expect(() =>
            createStorefrontAPIClient({
              ...config,
              // @ts-ignore
              apiVersion: undefined,
            })
          ).toThrow(
            new Error(
              `Storefront API Client: the provided \`apiVersion\` is invalid. Current supported API versions: ${mockApiVersions.join(
                ", "
              )}`
            )
          );
        });

        it("throws an error when the api version is not a string", () => {
          expect(() =>
            createStorefrontAPIClient({
              ...config,
              // @ts-ignore
              apiVersion: { year: 2022, month: 1 },
            })
          ).toThrow(
            new Error(
              `Storefront API Client: the provided \`apiVersion\` is invalid. Current supported API versions: ${mockApiVersions.join(
                ", "
              )}`
            )
          );
        });

        it("console warns when a unsupported api version is provided", () => {
          const consoleWarnSpy = jest
            .spyOn(window.console, "warn")
            .mockImplementation(jest.fn());

          createStorefrontAPIClient({
            ...config,
            apiVersion: "2022-07",
          });

          expect(consoleWarnSpy).toHaveBeenCalledWith(
            `Storefront API Client: the provided \`apiVersion\` (\`2022-07\`) is deprecated or not supported. Current supported API versions: ${mockApiVersions.join(
              ", "
            )}`
          );
        });

        it("throws an error when neither public and private access tokens are provided", () => {
          expect(() =>
            // @ts-ignore
            createStorefrontAPIClient({
              ...config,
              publicAccessToken: undefined,
            })
          ).toThrow(
            new Error(
              `Storefront API Client: a public or private access token must be provided`
            )
          );
        });

        it("throws an error when a private access token is provided in a browser environment (window is defined)", () => {
          expect(() =>
            // @ts-ignore
            createStorefrontAPIClient({
              ...config,
              publicAccessToken: undefined,
              privateAccessToken: "private-access-token",
            })
          ).toThrow(
            new Error(
              "Storefront API Client: private access tokens and headers should only be used in a server-to-server implementation. Use the API public access token in nonserver environments."
            )
          );
        });

        it("throws an error when both public and private access tokens are provided in a server environment (window is undefined)", () => {
          const windowSpy = jest
            .spyOn(window, "window", "get")
            .mockImplementation(() => undefined as any);

          expect(() =>
            // @ts-ignore
            createStorefrontAPIClient({
              ...config,
              privateAccessToken: "private-token",
            })
          ).toThrow(
            new Error(
              `Storefront API Client: only provide either a public or private access token`
            )
          );

          windowSpy.mockRestore();
        });
      });
    });

    describe("client config", () => {
      it("returns a config object that includes the provided store domain", () => {
        const client = createStorefrontAPIClient(config);
        expect(client.config.storeDomain).toBe(config.storeDomain);
      });

      it("returns a config object that includes the provided public access token and a null private access token", () => {
        const client = createStorefrontAPIClient(config);
        expect(client.config.publicAccessToken).toBe(config.publicAccessToken);
        expect(client.config.privateAccessToken).toBeNull();
      });

      it("returns a config object that includes the provided private access token and a null public access token when in a server environment (window is undefined)", () => {
        const windowSpy = jest
          .spyOn(window, "window", "get")
          .mockImplementation(() => undefined as any);

        const privateAccessToken = "private-token";

        const client = createStorefrontAPIClient({
          ...config,
          publicAccessToken: undefined,
          privateAccessToken,
        });
        expect(client.config.privateAccessToken).toBe(privateAccessToken);
        expect(client.config.publicAccessToken).toBeNull();

        windowSpy.mockRestore();
      });

      it("returns a config object that includes the provided client name", () => {
        const clientName = "test-client";

        const client = createStorefrontAPIClient({ ...config, clientName });
        expect(client.config.clientName).toBe(clientName);
      });

      describe("API url", () => {
        const cleanedStoreDomain = "test-store.myshopify.io";
        const expectedAPIUrl = `https://${cleanedStoreDomain}/api/${config.apiVersion}/graphql.json`;

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes 'https'", () => {
          const client = createStorefrontAPIClient({
            ...config,
            storeDomain: `https://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes 'http'", () => {
          const client = createStorefrontAPIClient({
            ...config,
            storeDomain: `http://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that does not include a protocol", () => {
          const client = createStorefrontAPIClient({
            ...config,
            storeDomain: cleanedStoreDomain,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes a valid API url constructed with the provided spaced out API version and a store domain", () => {
          const client = createStorefrontAPIClient({
            ...config,
            storeDomain: ` ${cleanedStoreDomain}   `,
            apiVersion: ` ${config.apiVersion}   `,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });
      });

      describe("config headers", () => {
        it("returns a header object that includes the content-type header", () => {
          const client = createStorefrontAPIClient(config);
          expect(client.config.headers["Content-Type"]).toBe(
            DEFAULT_CONTENT_TYPE
          );
        });

        it("returns a header object that includes the accept header", () => {
          const client = createStorefrontAPIClient(config);
          expect(client.config.headers.Accept).toBe(DEFAULT_CONTENT_TYPE);
        });

        it("returns a header object that includes the SDK variant header", () => {
          const client = createStorefrontAPIClient(config);
          expect(client.config.headers[SDK_VARIANT_HEADER]).toBe(
            DEFAULT_SDK_VARIANT
          );
        });

        it("returns a header object that includes the SDK version header", () => {
          const client = createStorefrontAPIClient(config);
          expect(client.config.headers[SDK_VERSION_HEADER]).toBe(
            DEFAULT_CLIENT_VERSION
          );
        });

        it("returns a header object that includes the public headers when a public access token is provided", () => {
          const client = createStorefrontAPIClient(config);
          expect(client.config.headers[PUBLIC_ACCESS_TOKEN_HEADER]).toEqual(
            config.publicAccessToken
          );
        });

        it("returns a header object that includes the private headers when a private access token is provided", () => {
          const windowSpy = jest
            .spyOn(window, "window", "get")
            .mockImplementation(() => undefined as any);

          const privateAccessToken = "private-token";

          const client = createStorefrontAPIClient({
            ...config,
            publicAccessToken: undefined,
            privateAccessToken,
          });

          expect(client.config.headers[PRIVATE_ACCESS_TOKEN_HEADER]).toEqual(
            privateAccessToken
          );

          windowSpy.mockRestore();
        });

        it("returns a header object that includes the SDK variant source header when client name is provided", () => {
          const clientName = "test-client";

          const client = createStorefrontAPIClient({ ...config, clientName });
          expect(client.config.headers[SDK_VARIANT_SOURCE_HEADER]).toEqual(
            clientName
          );
        });

        it("returns a header object that does not include the SDK variant source header when client name is not provided", () => {
          const client = createStorefrontAPIClient(config);
          expect(
            client.config.headers[SDK_VARIANT_SOURCE_HEADER]
          ).toBeUndefined();
        });
      });
    });

    describe("getHeaders()", () => {
      let client: StorefrontAPIClient;

      beforeEach(() => {
        client = createStorefrontAPIClient(config);
      });

      it("returns the client's default headers if no custom headers are provided", () => {
        const headers = client.getHeaders();
        expect(headers).toBe(client.config.headers);
      });

      it("returns a headers object that contains both the client default headers and the provided custom headers", () => {
        const customHeaders = {
          "Shopify-Storefront-Id": "test-id",
        };
        const headers = client.getHeaders(customHeaders);
        expect(headers).toEqual({ ...customHeaders, ...client.config.headers });
      });
    });

    describe("getApiUrl()", () => {
      let client: StorefrontAPIClient;

      beforeEach(() => {
        client = createStorefrontAPIClient(config);
      });

      it("returns the client's default API url if no API version was provided", () => {
        const url = client.getApiUrl();
        expect(url).toBe(client.config.apiUrl);
      });

      it("returns an API url that is directed at the provided api version", () => {
        const version = "unstable";
        const url = client.getApiUrl(version);
        expect(url).toEqual(
          `${config.storeDomain}/api/${version}/graphql.json`
        );
      });

      it("throws an error when the api version is not a string", () => {
        const version = 123;
        expect(() =>
          // @ts-ignore
          client.getApiUrl(version)
        ).toThrow(
          new Error(
            `Storefront API Client: the provided \`apiVersion\` is invalid. Current supported API versions: ${mockApiVersions.join(
              ", "
            )}`
          )
        );
      });

      it("console warns when a unsupported api version is provided", () => {
        const consoleWarnSpy = jest
          .spyOn(window.console, "warn")
          .mockImplementation(jest.fn());

        const version = "2021-01";
        client.getApiUrl(version);

        expect(consoleWarnSpy).toHaveBeenCalledWith(
          `Storefront API Client: the provided \`apiVersion\` (\`2021-01\`) is deprecated or not supported. Current supported API versions: ${mockApiVersions.join(
            ", "
          )}`
        );
      });
    });
  });
});
