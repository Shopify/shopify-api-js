---
'@shopify/shopify-api': patch
---

[Custom store apps only] Add new `adminApiAccessToken` parameter to `config` for when `isCustomStoreApp` is `true`. If set, it will be used for API access. `apiSecretKey` should now be set to the custom store app's API secret key, which is used to validate the HMAC of webhook events received from Shopify for a custom store app.  Fixes #772, #800

For apps that don't receive HTTP webhook events from Shopify, no change is required yet - `apiSecretKey` will be used for client authentication as the fallback option.

Starting with the next major release

- `adminApiAccessToken` will be mandatory for custom store apps and must be set to the Admin API access token
- `apiSecretKey` will not be used for client authentication but must be set for HMAC validation of HTTP webhook events

See [setting up a custom store app](https://github.com/shopify/shopify-api-js/blob/main/docs/guides/custom-store-app.md) for more details.
