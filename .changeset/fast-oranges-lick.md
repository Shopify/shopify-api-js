---
'@shopify/shopify-api': major
---

⚠️ [Breaking] Removing deprecated code:

- The `isPrivateApp` param from `shopifyApi()` was removed in favour of `isCustomStoreApp`.
- The `isOnline` param from `shopify.auth.callback()` was removed, because it's now handled automatically.
