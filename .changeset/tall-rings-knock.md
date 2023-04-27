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
