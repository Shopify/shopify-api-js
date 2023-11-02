---
"@shopify/graphql-client": minor
---

Updated types, functions and parameter names to consistently use `Api` and renamed the `ResponseErrors.error` field to `ResponseErrors.errors`. Also updated the client's `request()` to return both the `errors` and `data` if the API response returns partial data and error info.
