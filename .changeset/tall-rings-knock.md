---
'@shopify/shopify-api': minor
---

Added Subscription cancel capabilities for App Billing. Fixes #771

Usage:

```js
const canceledSubscription = await shopify.billing.cancel({
  session,
  subscriptionId,
})
```

See [Billing Guide](https://github.com/shopify/shopify-api-js/blob/main/docs/guides/billing.md) for more details.
