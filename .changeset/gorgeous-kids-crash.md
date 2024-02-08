---
"@shopify/shopify-api": minor
---

Update lineItemBilling future flag to v10. Current users of `unstable_lineItemBilling` will need to update to `v10_lineItemBilling` to continue using this feature.

```ts
const shopify = shopifyApi({
  // ...
future: {
  v10_lineItemBilling: true,
});
```
