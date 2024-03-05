import {AdapterResponse} from '../runtime/http/types';

export class ShopifyError extends Error {
  constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidHmacError extends ShopifyError {}
export class InvalidShopError extends ShopifyError {}
export class InvalidHostError extends ShopifyError {}
export class InvalidJwtError extends ShopifyError {}
export class MissingJwtTokenError extends ShopifyError {}
export class InvalidDeliveryMethodError extends ShopifyError {}

export class SafeCompareError extends ShopifyError {}
export class PrivateAppError extends ShopifyError {}

export class HttpRequestError extends ShopifyError {}
export class HttpMaxRetriesError extends ShopifyError {}

interface HttpResponseData {
  code: number;
  statusText: string;
  body?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}
interface HttpResponseErrorParams extends HttpResponseData {
  message: string;
}
export class HttpResponseError<
  ResponseType extends HttpResponseData = HttpResponseData,
> extends ShopifyError {
  readonly response: ResponseType;

  public constructor({
    message,
    code,
    statusText,
    body,
    headers,
  }: HttpResponseErrorParams) {
    super(message);
    this.response = {
      code,
      statusText,
      body,
      headers,
    } as ResponseType;
  }
}
export class HttpRetriableError<
  ResponseType extends HttpResponseData = HttpResponseData,
> extends HttpResponseError<ResponseType> {}
export class HttpInternalError extends HttpRetriableError {}

interface HttpThrottlingErrorData extends HttpResponseData {
  retryAfter?: number;
}
interface HttpThrottlingErrorParams extends HttpThrottlingErrorData {
  message: string;
}
export class HttpThrottlingError extends HttpRetriableError<HttpThrottlingErrorData> {
  public constructor({retryAfter, ...params}: HttpThrottlingErrorParams) {
    super(params);
    this.response.retryAfter = retryAfter;
  }
}

export class RestResourceError extends ShopifyError {}
export class GraphqlQueryError extends ShopifyError {
  readonly response: Record<string, unknown>;
  headers?: Record<string, unknown>;
  body?: Record<string, any>;

  public constructor({
    message,
    response,
    headers,
    body,
  }: {
    message: string;
    response: Record<string, unknown>;
    headers?: Record<string, unknown>;
    body?: Record<string, any>;
  }) {
    super(message);
    this.response = response;
    this.headers = headers;
    this.body = body;
  }
}

export class InvalidOAuthError extends ShopifyError {}
export class BotActivityDetected extends ShopifyError {}
export class CookieNotFound extends ShopifyError {}
export class InvalidSession extends ShopifyError {}

interface InvalidWebhookParams {
  message: string;
  response: AdapterResponse;
}
export class InvalidWebhookError extends ShopifyError {
  readonly response: AdapterResponse;

  public constructor({message, response}: InvalidWebhookParams) {
    super(message);
    this.response = response;
  }
}
export class MissingWebhookCallbackError extends InvalidWebhookError {}
export class SessionStorageError extends ShopifyError {}

export class MissingRequiredArgument extends ShopifyError {}
export class UnsupportedClientType extends ShopifyError {}

export class InvalidRequestError extends ShopifyError {}

export class BillingError extends ShopifyError {
  readonly errorData: any;

  public constructor({message, errorData}: {message: string; errorData: any}) {
    super(message);

    this.message = message;
    this.errorData = errorData;
  }
}
export class FeatureDeprecatedError extends ShopifyError {}
