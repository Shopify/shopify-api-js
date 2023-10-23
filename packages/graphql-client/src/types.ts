export type CustomFetchAPI = (
  url: string,
  init?: {
    method?: string;
    headers?: HeadersInit;
    body?: string;
  }
) => Promise<Response>;

export interface OperationVariables {
  [key: string]: any;
}

export interface Headers {
  [key: string]: string;
}

export interface ResponseError {
  networkStatusCode?: number;
  message?: string;
  graphQLErrors?: any[];
}

export interface GQLExtensions {
  [key: string]: any;
}

export interface ClientResponse<TData = unknown> {
  data?: TData;
  error?: ResponseError;
  extensions?: GQLExtensions;
}

export interface ClientOptions {
  headers: Headers;
  url: string;
  fetchAPI?: CustomFetchAPI;
  retries?: number;
}

export interface ClientConfig {
  readonly headers: Headers;
  readonly url: string;
  readonly retries: number;
}

export interface RequestOptions {
  variables?: OperationVariables;
  url?: string;
  headers?: Headers;
  retries?: number;
}

export type RequestParams = [operation: string, options?: RequestOptions];

export interface GraphQLClient {
  readonly config: ClientConfig;
  fetch: (...props: RequestParams) => Promise<Response>;
  request: <TData = unknown>(
    ...props: RequestParams
  ) => Promise<ClientResponse<TData>>;
}
