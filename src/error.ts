class ShopifyError extends Error {}

class InvalidHmacError extends ShopifyError {}
class InvalidShopError extends ShopifyError {}
class InvalidJwtError extends ShopifyError {}

class SafeCompareError extends ShopifyError {}
class UninitializedContextError extends ShopifyError {}

class HttpRequestError extends ShopifyError {}
class HttpMaxRetriesError extends ShopifyError {}
class HttpResponseError extends ShopifyError {
  public constructor(
    message: string,
    readonly code: number,
    readonly statusText: string
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

const ShopifyErrors = {
  ShopifyError,
  InvalidHmacError,
  InvalidShopError,
  InvalidJwtError,
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
};

export default ShopifyErrors;
