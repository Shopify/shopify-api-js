# @shopify/graphql-client

## 0.3.0

### Minor Changes

- bb634937: Added a new `logging` functionality to the client. This feature enables client consumers to log `request/response` and `retry attempt` info if a logger function is provided at initialization. Also, the `retry` error messages were updated for clarity.

## 0.2.0

### Minor Changes

- efc66ead: Added a new `retries` feature to the `graphql-client`. This feature allows client consumers to set the number of HTTP request retries when the API request is abandoned or the API server returns a `429` or `503` response.
- 77be46bb: Added a new `graphql-client` package. This client is a generic GQL client that provides basic functionalities to interact with Shopify's GraphQL APIs.
