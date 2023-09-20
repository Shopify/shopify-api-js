import type {
  AbstractFetchFunc,
  AbstractConvertRequestFunc,
  AbstractConvertIncomingResponseFunc,
  AbstractConvertResponseFunc,
  NormalizedResponse,
  AbstractConvertHeadersFunc,
} from './types';

export * from './cookies';
export * from './headers';
export * from './utils';

export * from './types';

export function isOK(resp: NormalizedResponse) {
  // https://fetch.spec.whatwg.org/#ok-status
  return resp.statusCode >= 200 && resp.statusCode <= 299;
}

// We ignore mutable export linting errors because we explicitly want these abstract functions to be overwritten.

// eslint-disable-next-line import/no-mutable-exports
export let abstractFetch: AbstractFetchFunc = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractFetch' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractFetchFunc(func: AbstractFetchFunc) {
  abstractFetch = func;
}

// eslint-disable-next-line import/no-mutable-exports
export let abstractConvertRequest: AbstractConvertRequestFunc = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractConvertRequest' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractConvertRequestFunc(
  func: AbstractConvertRequestFunc,
) {
  abstractConvertRequest = func;
}

// By default we just return an empty NormalizedResponse because not all adapters will need to convert an incoming response
// eslint-disable-next-line import/no-mutable-exports
export let abstractConvertIncomingResponse: AbstractConvertIncomingResponseFunc =
  () => Promise.resolve({} as NormalizedResponse);
export function setAbstractConvertIncomingResponseFunc(
  func: AbstractConvertIncomingResponseFunc,
) {
  abstractConvertIncomingResponse = func;
}

// eslint-disable-next-line import/no-mutable-exports
export let abstractConvertResponse: AbstractConvertResponseFunc = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractConvertResponse' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractConvertResponseFunc(
  func: AbstractConvertResponseFunc,
) {
  abstractConvertResponse = func;
}

// eslint-disable-next-line import/no-mutable-exports
export let abstractConvertHeaders: AbstractConvertHeadersFunc = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractConvertHeaders' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractConvertHeadersFunc(
  func: AbstractConvertHeadersFunc,
) {
  abstractConvertHeaders = func;
}
