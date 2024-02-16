import { GraphQLClient } from "@shopify/graphql-client";

export const mockApiVersions = [
  "2023-01",
  "2023-04",
  "2023-07",
  "2023-10",
  "2024-01",
  "unstable",
];

export const domain = "test-store.myshopify.io";
export const config = {
  storeDomain: `https://${domain}`,
  apiVersion: "2023-10",
  publicAccessToken: "public-token",
};

export const mockApiUrl = `${config.storeDomain}/api/2023-10/graphql.json`;

export const graphqlClientMock: GraphQLClient = {
  config: {
    url: mockApiUrl,
    headers: {},
    retries: 0,
  },
  fetch: jest.fn(),
  request: jest.fn(),
  requestStream: jest.fn(),
};
