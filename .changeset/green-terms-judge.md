---
'@shopify/shopify-api': major
---

⚠️ [Breaking] Add `adminApiAccessToken` parameter to `config` for when `isCustomStoreApp` is `true`, which is then used for API access. `apiSecretKey` must now be set to the custom store app's API secret key, which is used to validate the HMAC of webhook events received from Shopify for a custom store app.  Fixes #772, #800

See [setting up a custom store app](https://github.com/shopify/shopify-api-js/blob/main/docs/guides/custom-store-app.md) for more details.
