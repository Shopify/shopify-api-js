import { createGraphQLClient, GraphQLClient } from "@shopify/graphql-client";
import { AdminApiClient } from "graphql/types";

import { createAdminApiClient } from "../client";
import { ACCESS_TOKEN_HEADER, DEFAULT_CONTENT_TYPE } from "../../constants";

const mockApiVersions = [
  "2023-01",
  "2023-04",
  "2023-07",
  "2023-10",
  "2024-01",
  "unstable",
];

jest.mock("@shopify/graphql-client", () => {
  return {
    ...jest.requireActual("@shopify/graphql-client"),
    createGraphQLClient: jest.fn(),
    getCurrentSupportedApiVersions: () => mockApiVersions,
  };
});

describe("Admin API Client", () => {
  describe("createAdminApiClient()", () => {
    const config = {
      storeDomain: "https://test-store.myshopify.io",
      apiVersion: "2023-10",
      accessToken: "access-token",
    };
    const mockApiUrl = `${config.storeDomain}/admin/api/2023-10/graphql.json`;

    const graphqlClientMock: GraphQLClient = {
      config: {
        url: mockApiUrl,
        headers: {},
        retries: 0,
      },
      fetch: jest.fn(),
      request: jest.fn(),
      requestStream: jest.fn(),
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
        createAdminApiClient({ ...config });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("headers", {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Access-Token": "access-token",
          "User-Agent": "Admin API Client vROLLUP_REPLACE_CLIENT_VERSION",
        });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("url", mockApiUrl);
      });

      it("calls the graphql client with the default retries", () => {
        createAdminApiClient({ ...config });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("retries", 0);
      });

      it("calls the graphql client with the provided retries", () => {
        const retries = 1;

        createAdminApiClient({ ...config, retries });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("retries", retries);
      });

      it("Prepends user agent prefix if supplied", () => {
        const userAgentPrefix = "test-UAP";

        createAdminApiClient({ ...config, userAgentPrefix });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("headers", {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Access-Token": "access-token",
          "User-Agent":
            "test-UAP | Admin API Client vROLLUP_REPLACE_CLIENT_VERSION",
        });
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("url", mockApiUrl);
      });

      it("calls the graphql client with the provided customFetchApi", () => {
        const customFetchApi = jest.fn();

        createAdminApiClient({ ...config, customFetchApi });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("customFetchApi", customFetchApi);
      });

      it("calls the graphql client with the provided logger", () => {
        const logger = jest.fn();

        createAdminApiClient({ ...config, logger });

        expect(createGraphQLClient).toHaveBeenCalled();
        expect(
          (createGraphQLClient as jest.Mock).mock.calls[0][0],
        ).toHaveProperty("logger", logger);
      });

      it("returns a client object that contains a config object, getters for header and API URL and request and fetch functions", () => {
        const client = createAdminApiClient(config);

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
            createAdminApiClient({
              ...config,
              storeDomain: undefined as any,
            }),
          ).toThrow(
            new Error(
              'Admin API Client: a valid store domain ("undefined") must be provided',
            ),
          );
        });

        it("throws an error when an empty string is provided as the store domain", () => {
          expect(() =>
            createAdminApiClient({
              ...config,
              storeDomain: "   " as any,
            }),
          ).toThrow(
            new Error(
              'Admin API Client: a valid store domain ("   ") must be provided',
            ),
          );
        });

        it("throws an error when the provided store domain is not a string", () => {
          expect(() =>
            createAdminApiClient({
              ...config,
              storeDomain: 123 as any,
            }),
          ).toThrow(
            new Error(
              'Admin API Client: a valid store domain ("123") must be provided',
            ),
          );
        });

        it("throws an error when the api version is not provided", () => {
          expect(() =>
            createAdminApiClient({
              ...config,
              apiVersion: undefined as any,
            }),
          ).toThrow(
            new Error(
              `Admin API Client: the provided apiVersion ("undefined") is invalid. Currently supported API versions: ${mockApiVersions.join(
                ", ",
              )}`,
            ),
          );
        });

        it("console warns when a unsupported api version is provided", () => {
          const consoleWarnSpy = jest
            .spyOn(global.console, "warn")
            .mockImplementation(jest.fn());

          createAdminApiClient({
            ...config,
            apiVersion: "2022-07",
          });

          expect(consoleWarnSpy).toHaveBeenCalledWith(
            `Admin API Client: the provided apiVersion ("2022-07") is likely deprecated or not supported. Currently supported API versions: ${mockApiVersions.join(
              ", ",
            )}`,
          );
        });

        it("throws an error when an access token isn't provided", () => {
          expect(() =>
            createAdminApiClient({
              ...config,
              accessToken: undefined as any,
            }),
          ).toThrow(
            new Error(`Admin API Client: an access token must be provided`),
          );
        });

        it("throws an error when run in a browser environment (window is defined)", () => {
          global.window = {} as any;

          expect(() =>
            createAdminApiClient({
              ...config,
              accessToken: "access-token",
            }),
          ).toThrow(
            new Error(
              "Admin API Client: this client should not be used in the browser",
            ),
          );

          delete (global as any).window;
        });
      });
    });

    describe("client config", () => {
      it("returns a config object that includes the provided store domain", () => {
        const client = createAdminApiClient(config);
        expect(client.config.storeDomain).toBe(config.storeDomain);
      });

      it("returns a config object that includes the provided access token", () => {
        const client = createAdminApiClient(config);
        expect(client.config.accessToken).toBe(config.accessToken);
      });

      it("returns a config object that includes the provided user agent prefix", () => {
        const userAgentPrefix = "test-UAP";

        const client = createAdminApiClient({ ...config, userAgentPrefix });
        expect(client.config.userAgentPrefix).toBe(userAgentPrefix);
      });

      describe("API url", () => {
        const cleanedStoreDomain = "test-store.myshopify.io";
        const expectedAPIUrl = `https://${cleanedStoreDomain}/admin/api/${config.apiVersion}/graphql.json`;

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes 'https'", () => {
          const client = createAdminApiClient({
            ...config,
            storeDomain: `https://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that includes 'http'", () => {
          const client = createAdminApiClient({
            ...config,
            storeDomain: `http://${cleanedStoreDomain}`,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes the secure API url constructed with the provided API version and a store domain that does not include a protocol", () => {
          const client = createAdminApiClient({
            ...config,
            storeDomain: cleanedStoreDomain,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });

        it("returns a config object that includes a valid API url constructed with the provided spaced out API version and a store domain", () => {
          const client = createAdminApiClient({
            ...config,
            storeDomain: ` ${cleanedStoreDomain}   `,
            apiVersion: ` ${config.apiVersion}   `,
          });
          expect(client.config.apiUrl).toBe(expectedAPIUrl);
        });
      });

      describe("config headers", () => {
        it("returns a header object that includes the content-type header", () => {
          const client = createAdminApiClient(config);
          expect(client.config.headers["Content-Type"]).toBe(
            DEFAULT_CONTENT_TYPE,
          );
        });

        it("returns a header object that includes the accept header", () => {
          const client = createAdminApiClient(config);
          expect(client.config.headers.Accept).toBe(DEFAULT_CONTENT_TYPE);
        });

        it("returns a header object that includes the access token headers when an access token is provided", () => {
          const client = createAdminApiClient(config);
          expect(client.config.headers[ACCESS_TOKEN_HEADER]).toEqual(
            config.accessToken,
          );
        });
      });
    });

    describe("getHeaders()", () => {
      let client: AdminApiClient;

      beforeEach(() => {
        client = createAdminApiClient(config);
      });

      it("returns the client's default headers if no custom headers are provided", () => {
        const headers = client.getHeaders();
        expect(headers).toEqual(client.config.headers);
      });

      it("returns a headers object that contains both the client default headers and the provided custom headers", () => {
        const headers = {
          "X-GraphQL-Cost-Include-Fields": "1",
        };
        const updatedHeaders = client.getHeaders(headers);
        expect(updatedHeaders).toEqual({
          ...headers,
          ...client.config.headers,
        });
      });
    });

    describe("getApiUrl()", () => {
      let client: AdminApiClient;

      beforeEach(() => {
        client = createAdminApiClient(config);
      });

      it("returns the client's default API url if no API version was provided", () => {
        const url = client.getApiUrl();
        expect(url).toBe(client.config.apiUrl);
      });

      it("returns an API url that is directed at the provided api version", () => {
        const version = "unstable";
        const url = client.getApiUrl(version);
        expect(url).toEqual(
          `${config.storeDomain}/admin/api/${version}/graphql.json`,
        );
      });

      it("throws an error when the api version is not a string", () => {
        const version: any = 123;
        expect(() => client.getApiUrl(version)).toThrow(
          new Error(
            `Admin API Client: the provided apiVersion ("123") is invalid. Currently supported API versions: ${mockApiVersions.join(
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
          `Admin API Client: the provided apiVersion ("2021-01") is likely deprecated or not supported. Currently supported API versions: ${mockApiVersions.join(
            ", ",
          )}`,
        );
      });
    });
  });
});
