import {
  OperationVariables,
  Headers,
  ClientResponse,
  GraphQLClient,
} from "@shopify/graphql-client";

export interface AdminApiClientConfig {
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly accessToken: string;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly userAgentPrefix?: string;
  readonly retries?: number;
}

export interface AdminApiClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  customHeaders?: Headers;
  retries?: number;
}

export type AdminApiClientRequestParams = [
  operation: string,
  options?: AdminApiClientRequestOptions
];

export interface AdminApiClient {
  readonly config: AdminApiClientConfig;
  getHeaders: (customHeaders?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: AdminApiClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: AdminApiClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
