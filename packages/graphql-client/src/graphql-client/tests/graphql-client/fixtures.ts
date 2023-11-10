import { createGraphQLClient } from "../../graphql-client";
import { ClientOptions, LogContentTypes } from "../../types";

export const globalFetchMock = JSON.stringify({ data: {} });

export const config = {
  url: "http://test-store.myshopify.com/api/2023-10/graphql.json",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": "public-token",
  },
};

export function getValidClient({
  retries,
  logger,
}: {
  retries?: number;
  logger?: (logContent: LogContentTypes) => void;
} = {}) {
  const updatedConfig: ClientOptions = { ...config };

  if (typeof retries === "number") {
    updatedConfig.retries = retries;
  }

  if (logger !== undefined) {
    updatedConfig.logger = logger;
  }

  return createGraphQLClient(updatedConfig);
}

export const operation = `
query {
  shop {
    name
  }
}
`;

export const variables = {};
