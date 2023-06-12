export interface Headers {
  [key: string]: string | string[];
}

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
  rawRequest: AdapterRequest;
  rawResponse?: AdapterResponse;
}

export type AbstractFetchFunc = (
  req: NormalizedRequest,
) => Promise<NormalizedResponse>;

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
