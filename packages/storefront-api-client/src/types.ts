import {
  Headers,
  ApiClient,
  ApiClientLogContentTypes,
} from "@shopify/graphql-client";

export type StorefrontApiClientLogContentTypes = ApiClientLogContentTypes;

export interface StorefrontApiClientConfig {
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly publicAccessToken: string | null;
  readonly privateAccessToken: string | null;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly clientName?: string;
  readonly retries?: number;
}

export type StorefrontApiClient = ApiClient<StorefrontApiClientConfig>;
