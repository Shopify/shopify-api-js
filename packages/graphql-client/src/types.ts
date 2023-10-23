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

export type LogType = "HTTP-Response" | "HTTP-Retry";

export interface LogContent {
  type: LogType;
  content: any;
}

export interface HTTPResponseLog extends LogContent {
  type: "HTTP-Response";
  content: {
    requestParams: Parameters<CustomFetchAPI>;
    response: Response;
  };
}

export interface HTTPRetryLog extends LogContent {
  type: "HTTP-Retry";
  content: {
    requestParams: Parameters<CustomFetchAPI>;
    lastResponse?: Response;
    retryAttempt: number;
    maxRetries: number;
  };
}

export type LogContentTypes = HTTPResponseLog | HTTPRetryLog;

export interface ClientOptions {
  headers: Headers;
  url: string;
  fetchAPI?: CustomFetchAPI;
  retries?: number;
  logger?: (logContent: LogContentTypes) => void;
}

export interface ClientConfig {
  readonly headers: ClientOptions["headers"];
  readonly url: ClientOptions["url"];
  readonly retries: ClientOptions["retries"];
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
