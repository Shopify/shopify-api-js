import {
  ApiClient,
  CustomFetchApi,
  ApiClientLogger,
  ApiClientLogContentTypes,
  ApiClientConfig,
  ApiClientRequestStream,
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
  [key: number | symbol]: never;
}
export interface StorefrontMutations {
  [key: string]: { variables: any; return: any };
  [key: number | symbol]: never;
}
export type StorefrontOperations = StorefrontQueries & StorefrontMutations;

export type StorefrontApiClient = ApiClient<
  StorefrontApiClientConfig,
  StorefrontOperations
> & {
  requestStream: ApiClientRequestStream<StorefrontOperations>;
};
