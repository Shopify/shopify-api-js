---
"@shopify/graphql-client": minor
---

Added a new `retries` feature to the `graphql-client`. This feature allows client consumers to set the number of HTTP request retries when the API request is abandoned or the API server returns a `429` or `503` response.
