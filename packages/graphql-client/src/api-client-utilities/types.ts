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

export type APIClientLogContentTypes =
  | LogContentTypes
  | UnsupportedApiVersionLog;

export type APIClientLogger<TLogContentTypes = APIClientLogContentTypes> =
  BaseLogger<TLogContentTypes>;

export interface APIClientConfig {
  readonly storeDomain: string;
  readonly apiVersion: string;
  readonly headers: Headers;
  readonly apiUrl: string;
  readonly retries?: number;
}

export interface APIClientRequestOptions {
  variables?: OperationVariables;
  apiVersion?: string;
  customHeaders?: Headers;
  retries?: number;
}

export type APIClientRequestParams = [
  operation: string,
  options?: APIClientRequestOptions
];

export interface APIClient<TClientConfig extends APIClientConfig> {
  readonly config: TClientConfig;
  getHeaders: (customHeaders?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: (
    ...props: APIClientRequestParams
  ) => ReturnType<GraphQLClient["fetch"]>;
  request: <TData = unknown>(
    ...props: APIClientRequestParams
  ) => Promise<ClientResponse<TData>>;
}
