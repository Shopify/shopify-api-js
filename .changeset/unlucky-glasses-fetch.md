---
'@shopify/shopify-api': patch
---

validateHmac will now check for a `hmac` or a `signature` query argument. Fixes #776
