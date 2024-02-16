import {
  LogContentTypes,
  LogContent,
  Logger as BaseLogger,
  Headers,
  ClientResponse,
  FetchResponseBody,
  ClientStreamIterator,
} from "../graphql-client/types";

import {
  AllOperations,
  OperationVariables,
  ResponseWithType,
  ReturnData,
} from "./operation-types";

export {
  AllOperations,
  InputMaybe,
  OperationVariables,
  ReturnData,
  ResponseWithType,
} from "./operation-types";

export interface UnsupportedApiVersionLog extends LogContent {
  type: "Unsupported_Api_Version";
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

export type ApiClientRequestOptions<
  Operation extends keyof Operations = string,
  Operations extends AllOperations = AllOperations,
> = {
  apiVersion?: string;
  headers?: Headers;
  retries?: number;
} & (Operation extends keyof Operations
  ? OperationVariables<Operation, Operations>
  : { variables?: Record<string, any> });

export type ApiClientRequestParams<
  Operation extends keyof Operations,
  Operations extends AllOperations,
> = [
  operation: Operation,
  options?: ApiClientRequestOptions<Operation, Operations>,
];

export type ApiClientFetch<Operations extends AllOperations = AllOperations> = <
  Operation extends keyof Operations = string,
>(
  ...params: ApiClientRequestParams<Operation, Operations>
) => Promise<
  ResponseWithType<FetchResponseBody<ReturnData<Operation, Operations>>>
>;

export type ApiClientRequest<Operations extends AllOperations = AllOperations> =
  <TData = undefined, Operation extends keyof Operations = string>(
    ...params: ApiClientRequestParams<Operation, Operations>
  ) => Promise<
    ClientResponse<
      TData extends undefined ? ReturnData<Operation, Operations> : TData
    >
  >;

export type ApiClientRequestStream<
  Operations extends AllOperations = AllOperations,
> = <TData = undefined, Operation extends keyof Operations = string>(
  ...params: ApiClientRequestParams<Operation, Operations>
) => Promise<
  ClientStreamIterator<
    TData extends undefined ? ReturnData<Operation, Operations> : TData
  >
>;

export interface ApiClient<
  TClientConfig extends ApiClientConfig = ApiClientConfig,
  Operations extends AllOperations = AllOperations,
> {
  readonly config: Readonly<TClientConfig>;
  getHeaders: (headers?: Headers) => Headers;
  getApiUrl: (apiVersion?: string) => string;
  fetch: ApiClientFetch<Operations>;
  request: ApiClientRequest<Operations>;
}
