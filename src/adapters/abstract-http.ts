export interface Headers {
  [key: string]: string;
}

export interface Request {
  method: string;
  url: string;
  headers: Headers;
  body?: string;
}

export interface Response {
  statusCode: number;
  statusText: string;
  headers?: Headers;
  body?: string;
}

export type AbstractFetchFunc = (req: Request) => Promise<Response>;
// The mutable export is the whole key to the adapter architecture.
// eslint-disable-next-line import/no-mutable-exports
export let abstractFetch: AbstractFetchFunc;
export function setAbstractFetchFunc(func: AbstractFetchFunc) {
  abstractFetch = func;
}

export function isOK(resp: Response) {
  // https://fetch.spec.whatwg.org/#ok-status
  return resp.statusCode >= 200 && resp.statusCode <= 299;
}

export function getHeader(
  headers: Headers | undefined,
  needle_: string,
): string | undefined {
  if (!headers) return;
  const needle = needle_.toLowerCase();
  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === needle,
  )?.[1];
}
