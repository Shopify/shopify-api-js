import type {Headers} from './headers';

export * from './cookies';
export * from './headers';

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
  extra?: {[key: string]: any};
  continue?: boolean;
}

export type AbstractFetchFunc = (req: Request) => Promise<Response>;
// The mutable export is the whole key to the adapter architecture.
// eslint-disable-next-line import/no-mutable-exports
export let abstractFetch: AbstractFetchFunc;
export function setAbstractFetchFunc(func: AbstractFetchFunc) {
  abstractFetch = func;
}

export type AbstractConvertRequestFunc = (req: unknown) => Promise<Request>;
// eslint-disable-next-line import/no-mutable-exports
export let abstractConvertRequest: AbstractConvertRequestFunc;
export function setAbstractConvertRequestFunc(
  func: AbstractConvertRequestFunc,
) {
  abstractConvertRequest = func;
}

export function isOK(resp: Response) {
  // https://fetch.spec.whatwg.org/#ok-status
  return resp.statusCode >= 200 && resp.statusCode <= 299;
}
