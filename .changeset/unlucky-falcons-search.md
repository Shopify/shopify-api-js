---
'@shopify/shopify-api': patch
---

Adds check for Google's Crawler in the authorization functions to prevent CookieNotFound error loops. Fixes #686
