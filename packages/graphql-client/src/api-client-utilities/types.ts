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
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly retries?: number;
}

export interface ApiClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  customHeaders?: Headers;
  retries?: number;
}

export type ApiClientRequestParams = [
  operation: string,
  options?: ApiClientRequestOptions
];

export interface ApiClient<TClientConfig extends ApiClientConfig> {
  readonly config: TClientConfig;
  getHeaders: (customHeaders?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: ApiClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: ApiClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
