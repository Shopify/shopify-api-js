import {
  ApiClient,
  CustomFetchApi,
  ApiClientLogger,
  ApiClientLogContentTypes,
  ApiClientConfig,
} from "@shopify/graphql-client";

export type StorefrontApiClientLogContentTypes = ApiClientLogContentTypes;

export type StorefrontApiClientConfig = ApiClientConfig & {
  clientName?: string;
} & (
    | {
        publicAccessToken?: never;
        privateAccessToken: string;
      }
    | {
        publicAccessToken: string;
        privateAccessToken?: never;
      }
  );

export type StorefrontApiClientOptions = Omit<
  StorefrontApiClientConfig,
  "headers" | "apiUrl"
> & {
  customFetchApi?: CustomFetchApi;
  logger?: ApiClientLogger<StorefrontApiClientLogContentTypes>;
};

export type StorefrontApiClient = ApiClient<StorefrontApiClientConfig>;
