declare class ShopifyError extends Error {
    constructor(...args: any);
}
declare class InvalidHmacError extends ShopifyError {
}
declare class InvalidShopError extends ShopifyError {
}
declare class InvalidJwtError extends ShopifyError {
}
declare class MissingJwtTokenError extends ShopifyError {
}
declare class SafeCompareError extends ShopifyError {
}
declare class UninitializedContextError extends ShopifyError {
}
declare class PrivateAppError extends ShopifyError {
}
declare class HttpRequestError extends ShopifyError {
}
declare class HttpMaxRetriesError extends ShopifyError {
}
declare class HttpResponseError extends ShopifyError {
    readonly code: number;
    readonly statusText: string;
    constructor(message: string, code: number, statusText: string);
}
declare class HttpRetriableError extends ShopifyError {
}
declare class HttpInternalError extends HttpRetriableError {
}
declare class HttpThrottlingError extends HttpRetriableError {
    readonly retryAfter?: number | undefined;
    constructor(message: string, retryAfter?: number | undefined);
}
declare class InvalidOAuthError extends ShopifyError {
}
declare class SessionNotFound extends ShopifyError {
}
declare class CookieNotFound extends ShopifyError {
}
declare class InvalidSession extends ShopifyError {
}
declare class InvalidWebhookError extends ShopifyError {
}
declare class SessionStorageError extends ShopifyError {
}
declare class MissingRequiredArgument extends ShopifyError {
}
declare class UnsupportedClientType extends ShopifyError {
}
export { ShopifyError, InvalidHmacError, InvalidShopError, InvalidJwtError, MissingJwtTokenError, SafeCompareError, HttpRequestError, HttpMaxRetriesError, HttpResponseError, HttpRetriableError, HttpInternalError, HttpThrottlingError, UninitializedContextError, InvalidOAuthError, SessionNotFound, CookieNotFound, InvalidSession, InvalidWebhookError, MissingRequiredArgument, UnsupportedClientType, SessionStorageError, PrivateAppError, };
//# sourceMappingURL=error.d.ts.map