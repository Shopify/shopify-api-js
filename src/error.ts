class ShopifyError extends Error {}

class InvalidHmacError extends ShopifyError {}

class SafeCompareError extends ShopifyError {}

class HttpRequestError extends ShopifyError {}
class HttpRetriableError extends ShopifyError {}
class HttpInternalError extends HttpRetriableError {}
class HttpThrottlingError extends HttpRetriableError {}
class HttpResponseError extends ShopifyError {
  public constructor(message: string, readonly code: number) {
    super(message);
  }
}

const ShopifyErrors = {
  ShopifyError,
  InvalidHmacError,
  SafeCompareError,
  HttpRequestError,
  HttpRetriableError,
  HttpInternalError,
  HttpThrottlingError,
  HttpResponseError,
};

export default ShopifyErrors;
