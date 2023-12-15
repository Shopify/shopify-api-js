import {
  CustomFetchApi,
  ApiClientLogger,
  ApiClientLogContentTypes,
  ApiClientConfig,
} from "@shopify/graphql-client";

export type AdminApiClientLogContentTypes = ApiClientLogContentTypes;

export type AdminApiClientConfig = ApiClientConfig & {
  accessToken: string;
  userAgentPrefix?: string;
};

export type AdminApiClientOptions = Omit<AdminApiClientConfig, "apiUrl"> & {
  customFetchApi?: CustomFetchApi;
  logger?: ApiClientLogger<AdminApiClientLogContentTypes>;
};
