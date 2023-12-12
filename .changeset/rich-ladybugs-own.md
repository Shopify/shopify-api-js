---
"@shopify/shopify-api": major
---

> [!NOTE]
> This change only affects apps that are using custom runtime adapters.
> If you're using a default adapter from this package, you don't need to make this change.

Changed `setAbstractFetchFunc` to accept a `fetch` API instead of one based on `NormalizedRequest` and `NormalizedResponse`.

With this change, we can return a `Response` object for requests with the upcoming clients, which can help make the interface for requests more familiar to users.

For more information and examples, see the [migration guide to v9](https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/docs/migrating-to-v9.md#changes-to-runtime-adapters).
