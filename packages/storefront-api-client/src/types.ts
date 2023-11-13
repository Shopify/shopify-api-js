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

export interface StorefrontQueries {
  [key: string]: { variables: any; return: any };
}
export interface StorefrontMutations {
  [key: string]: { variables: any; return: any };
}
export type StorefrontOperations = StorefrontQueries & StorefrontMutations;

export type StorefrontApiClient = ApiClient<
  StorefrontApiClientConfig,
  StorefrontOperations
>;
