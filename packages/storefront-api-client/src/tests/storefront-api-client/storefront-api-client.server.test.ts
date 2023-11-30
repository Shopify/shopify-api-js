import { createGraphQLClient } from "@shopify/graphql-client";

import { createStorefrontApiClient } from "../../storefront-api-client";
import { PRIVATE_ACCESS_TOKEN_HEADER } from "../../constants";

import { mockApiVersions, graphqlClientMock, config } from "./fixtures";

jest.mock("@shopify/graphql-client", () => {
  return {
    ...jest.requireActual("@shopify/graphql-client"),
    createGraphQLClient: jest.fn(),
    getCurrentSupportedAPIVersions: () => mockApiVersions,
  };
});

describe("Storefront API Client: Server", () => {
  describe("createStorefrontApiClient()", () => {
    beforeEach(() => {
      (createGraphQLClient as jest.Mock).mockReturnValue(graphqlClientMock);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    describe("client initialization", () => {
      describe("validations", () => {
        it("throws an error when both public and private access tokens are provided in a server environment", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              privateAccessToken: "private-token",
            } as any),
          ).toThrow(
            new Error(
              `Storefront API Client: only provide either a public or private access token`,
            ),
          );
        });
      });
    });

    describe("client config", () => {
      it("returns a config object that includes the provided private access token and not a public access token when in a server environment", () => {
        const privateAccessToken = "private-token";

        const client = createStorefrontApiClient({
          ...config,
          publicAccessToken: undefined,
          privateAccessToken,
        });
        expect(client.config.privateAccessToken).toBe(privateAccessToken);
        expect(client.config.publicAccessToken).toBeUndefined();
      });

      describe("config headers", () => {
        it("returns a header object that includes the private headers when a private access token is provided", () => {
          const privateAccessToken = "private-token";

          const client = createStorefrontApiClient({
            ...config,
            publicAccessToken: undefined,
            privateAccessToken,
          });

          expect(client.config.headers[PRIVATE_ACCESS_TOKEN_HEADER]).toEqual(
            privateAccessToken,
          );
        });
      });
    });
  });
});
