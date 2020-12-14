class ShopifyError extends Error {
  constructor(...args: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */ /*  eslint-disable-line @typescript-eslint/explicit-module-boundary-types */
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class InvalidHmacError extends ShopifyError {}
class InvalidShopError extends ShopifyError {}
class InvalidJwtError extends ShopifyError {}
class MissingJwtTokenError extends ShopifyError {}

class SafeCompareError extends ShopifyError {}
class UninitializedContextError extends ShopifyError {}

class HttpRequestError extends ShopifyError {}
class HttpMaxRetriesError extends ShopifyError {}
class HttpResponseError extends ShopifyError {
  public constructor(message: string, readonly code: number, readonly statusText: string) {
    super(message);
  }
}
class HttpRetriableError extends ShopifyError {}
class HttpInternalError extends HttpRetriableError {}
class HttpThrottlingError extends HttpRetriableError {
  public constructor(message: string, readonly retryAfter?: number) {
    super(message);
  }
}

class InvalidOAuthError extends ShopifyError {}
class SessionNotFound extends ShopifyError {}

class InvalidWebhookError extends ShopifyError {}

export {
  ShopifyError,
  InvalidHmacError,
  InvalidShopError,
  InvalidJwtError,
  MissingJwtTokenError,
  SafeCompareError,
  HttpRequestError,
  HttpMaxRetriesError,
  HttpResponseError,
  HttpRetriableError,
  HttpInternalError,
  HttpThrottlingError,
  UninitializedContextError,
  InvalidOAuthError,
  SessionNotFound,
  InvalidWebhookError,
};
