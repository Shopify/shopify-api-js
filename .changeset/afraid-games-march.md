---
'@shopify/shopify-api': minor
---

Stop sending the privateMetafieldNamespaces field in webhook queries to avoid the API duplication warning, and added a new shopify.utils.versionPriorTo method to help with cases like this one where apps will need to stop doing something that was deprecated.
