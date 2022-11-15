# utils

## Sanitize a Shopify shop domain and host address

When receiving input from users, like in URL query arguments, you should always make sure to sanitize that data.
To make it easier to do that, this library provides the following methods:

```ts
const shop = shopify.utils.sanitizeShop(req.query.shop, true);
const host = shopify.utils.sanitizeHost(req.query.host, true);
```

Both of these return the string itself if it's valid, or `null` otherwise.
You can also optionally set the method to throw an exception if the validation fails.
If you're using custom shop domains for testing, you can add them to the `config.customShopDomains` setting.

## Check if a query string from Shopify is valid with `validateHmac`

For query strings received from Shopify that are expected to contain a hash-based message authentication code (HMAC) parameter, the `validateHmac` method can be used to perform that validation to determine the query string's integrity.

```ts
const isValid = await shopify.utils.validateHmac(req.query);
```

## Check API version compatibility with `versionCompatible`

If you need to determine if API version used in the library configuration is equal or newer than a given API version (to programmatically determine if certain versioned Shopify API capabilities are available, for example), the `shopify.utils.versionCompatible()` method can be used.

```ts
const shopify = shopifyApi({
  apiVersion: ApiVersion.July22,
  ...
});

if (shopify.utils.versionCompatible(ApiVersion.January22)) {
  // true in this example, as ApiVersion.July22 is newer than ApiVersion.January22
  ...
}
```

[Back to guide index](../../README.md#features)
