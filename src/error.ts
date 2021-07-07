class ShopifyError extends Error {
  constructor(...args: any) {
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
class PrivateAppError extends ShopifyError {}

class HttpRequestError extends ShopifyError {}
class HttpMaxRetriesError extends ShopifyError {}
class HttpResponseError extends ShopifyError {
  public constructor(
    message: string,
    readonly code: number,
    readonly statusText: string,
  ) {
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
class CookieNotFound extends ShopifyError {}
class InvalidSession extends ShopifyError {}

class InvalidWebhookError extends ShopifyError {}
class SessionStorageError extends ShopifyError {}

class MissingRequiredArgument extends ShopifyError {}
class UnsupportedClientType extends ShopifyError {}

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
  CookieNotFound,
  InvalidSession,
  InvalidWebhookError,
  MissingRequiredArgument,
  UnsupportedClientType,
  SessionStorageError,
  PrivateAppError,
};
