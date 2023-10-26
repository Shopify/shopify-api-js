import {
  OperationVariables,
  Headers,
  ClientResponse,
  GraphQLClient,
} from "@shopify/graphql-client";

export interface SFAPIClientConfig {
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly publicAccessToken: string | null;
  readonly privateAccessToken: string | null;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly clientName?: string;
  readonly retries?: number;
}

export interface SFAPIClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  customHeaders?: Headers;
  retries?: number;
}

export type SFAPIClientRequestParams = [
  operation: string,
  options?: SFAPIClientRequestOptions
];

export interface StorefrontAPIClient {
  readonly config: SFAPIClientConfig;
  getHeaders: (customHeaders?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: SFAPIClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: SFAPIClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
