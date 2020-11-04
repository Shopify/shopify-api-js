class ShopifyError extends Error {}

class InvalidHmacError extends ShopifyError {}

class SafeCompareError extends ShopifyError {}

export { ShopifyError, InvalidHmacError, SafeCompareError };
