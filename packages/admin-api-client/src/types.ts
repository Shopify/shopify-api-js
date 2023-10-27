import {
  OperationVariables,
  Headers,
  ClientResponse,
  GraphQLClient,
} from "@shopify/graphql-client";

export interface AdminAPIClientConfig {
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly accessToken: string;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly clientName?: string;
  readonly retries?: number;
}

export interface AdminAPIClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  customHeaders?: Headers;
  retries?: number;
}

export type AdminAPIClientRequestParams = [
  operation: string,
  options?: AdminAPIClientRequestOptions
];

export interface AdminAPIClient {
  readonly config: AdminAPIClientConfig;
  getHeaders: (customHeaders?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: AdminAPIClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: AdminAPIClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
