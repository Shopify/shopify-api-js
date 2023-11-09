import {
  LogContentTypes,
  LogContent,
  Logger as BaseLogger,
  Headers,
  OperationVariables,
  ClientResponse,
  GraphQLClient,
} from "../graphql-client/types";

export interface UnsupportedApiVersionLog extends LogContent {
  type: "UNSUPPORTED_API_VERSION";
  content: {
    apiVersion: string;
    supportedApiVersions: string[];
  };
}

export type ApiClientLogContentTypes =
  | LogContentTypes
  | UnsupportedApiVersionLog;

export type ApiClientLogger<TLogContentTypes = ApiClientLogContentTypes> =
  BaseLogger<TLogContentTypes>;

export interface ApiClientConfig {
  storeDomain: string;
  apiVersion: string;
  headers: Headers;
  apiUrl: string;
  retries?: number;
}

export interface ApiClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  headers?: Headers;
  retries?: number;
}

export type ApiClientRequestParams = [
  operation: string,
  options?: ApiClientRequestOptions
];

export interface ApiClient<
  TClientConfig extends ApiClientConfig = ApiClientConfig
> {
  readonly config: Readonly<TClientConfig>;
  getHeaders: (headers?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: ApiClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: ApiClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
