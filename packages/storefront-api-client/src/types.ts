import {
  ApiClient,
  Headers,
  CustomFetchApi,
  ApiClientLogger,
  ApiClientLogContentTypes,
} from "@shopify/graphql-client";

export type StorefrontApiClientLogContentTypes = ApiClientLogContentTypes;

export type StorefrontApiClientConfig = {
  storeDomain: string;
  apiVersion: string;
  headers: Headers;
  apiUrl: string;
  retries?: number;
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

export type StorefrontApiClient = ApiClient<
  Readonly<StorefrontApiClientConfig>
>;
