# `@shopify/shopify-api-js`

This mono-repo is a collection of Shopify's JavaScript API client libraries.

### [`@shopify/shopify-api`](./packages/shopify-api)

This library provides support for the backends of TypeScript/JavaScript Shopify apps to access the Shopify Admin API, by making it easier to perform the following actions:

- Creating online or offline access tokens for the Admin API via OAuth
- Making requests to the REST API
- Making requests to the GraphQL API
- Register/process webhooks

Once your app has access to the Admin API, you can also access the Shopify Storefront API to run GraphQL queries using the unauthenticated_* access scopes.

This library can be used in any application that runs on one of the supported runtimes. It doesn't rely on any specific framework, so you can include it alongside your preferred stack and only use the features that you need to build your app.
