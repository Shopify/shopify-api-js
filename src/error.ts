export class ShopifyError extends Error {
  constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidHmacError extends ShopifyError {}
export class InvalidShopError extends ShopifyError {}
export class InvalidJwtError extends ShopifyError {}
export class MissingJwtTokenError extends ShopifyError {}

export class SafeCompareError extends ShopifyError {}
export class UninitializedContextError extends ShopifyError {}
export class PrivateAppError extends ShopifyError {}

export class HttpRequestError extends ShopifyError {}
export class HttpMaxRetriesError extends ShopifyError {}

interface HttpResponseErrorParams {
  message: string;
  code: number;
  statusText: string;
  body?: string | {[key: string]: unknown};
  headers?: {[key: string]: unknown};
}
export class HttpResponseError extends ShopifyError {
  readonly code: number;
  readonly statusText: string;
  readonly body?: string | {[key: string]: unknown};
  readonly headers?: {[key: string]: unknown};

  public constructor({
    message,
    code,
    statusText,
    body,
    headers,
  }: HttpResponseErrorParams) {
    super(message);
    this.code = code;
    this.statusText = statusText;
    this.body = body;
    this.headers = headers;
  }
}
export class HttpRetriableError extends HttpResponseError {}
export class HttpInternalError extends HttpRetriableError {}

interface HttpThrottlingErrorParams extends HttpResponseErrorParams {
  retryAfter?: number;
}
export class HttpThrottlingError extends HttpRetriableError {
  readonly retryAfter?: number;

  public constructor({retryAfter, ...params}: HttpThrottlingErrorParams) {
    super(params);
    this.retryAfter = retryAfter;
  }
}

export class RestResourceError extends ShopifyError {}
export class RestResourceRequestError extends HttpResponseError {}

export class InvalidOAuthError extends ShopifyError {}
export class SessionNotFound extends ShopifyError {}
export class CookieNotFound extends ShopifyError {}
export class InvalidSession extends ShopifyError {}

export class InvalidWebhookError extends ShopifyError {}
export class SessionStorageError extends ShopifyError {}

export class MissingRequiredArgument extends ShopifyError {}
export class UnsupportedClientType extends ShopifyError {}
