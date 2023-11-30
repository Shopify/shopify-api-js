import { createGraphQLClient } from "@shopify/graphql-client";

import { createStorefrontApiClient } from "../../storefront-api-client";

import { mockApiVersions, graphqlClientMock, config } from "./fixtures";

jest.mock("@shopify/graphql-client", () => {
  return {
    ...jest.requireActual("@shopify/graphql-client"),
    createGraphQLClient: jest.fn(),
    getCurrentSupportedAPIVersions: () => mockApiVersions,
  };
});

describe("Storefront API Client: Browser", () => {
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
        it("throws an error when a private access token is provided in a browser environment", () => {
          expect(() =>
            createStorefrontApiClient({
              ...config,
              publicAccessToken: undefined as any,
              privateAccessToken: "private-access-token",
            }),
          ).toThrow(
            new Error(
              "Storefront API Client: private access tokens and headers should only be used in a server-to-server implementation. Use the public API access token in nonserver environments.",
            ),
          );
        });
      });
    });
  });
});
