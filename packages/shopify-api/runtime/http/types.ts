export type Headers = Record<string, string | string[]>;

export interface NormalizedRequest {
  method: string;
  url: string;
  headers: Headers;
  body?: string;
}

export interface NormalizedResponse {
  statusCode: number;
  statusText: string;
  headers?: Headers;
  body?: string;
}

export type AdapterRequest = any;
export type AdapterResponse = any;
export type AdapterHeaders = any;
export interface AdapterArgs {
  /**
   * The raw request, from the app's framework.
   */
  rawRequest: AdapterRequest;
  /**
   * The raw response, from the app's framework. Only applies to frameworks that expose an API similar to Node's HTTP
   * module.
   */
  rawResponse?: AdapterResponse;
}

export type AbstractFetchFunc = (
  ...params: Parameters<typeof fetch>
) => Promise<Response>;

export type AbstractConvertRequestFunc = (
  adapterArgs: AdapterArgs,
) => Promise<NormalizedRequest>;

export type AbstractConvertIncomingResponseFunc = (
  adapterArgs: AdapterArgs,
) => Promise<NormalizedResponse>;

export type AbstractConvertResponseFunc = (
  response: NormalizedResponse,
  adapterArgs: AdapterArgs,
) => Promise<AdapterResponse>;

export type AbstractConvertHeadersFunc = (
  headers: Headers,
  adapterArgs: AdapterArgs,
) => Promise<AdapterHeaders>;
