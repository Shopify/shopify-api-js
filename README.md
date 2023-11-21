# `@shopify/shopify-api-js`

This mono-repo is a collection of Shopify's JavaScript API client libraries and utilities.

## Frameworks

### [`@shopify/shopify-api`](./packages/shopify-api)

A library supporting Shopify apps to access Shopify's APIs, by making it easier to perform the following actions:

- Creating online or offline access tokens for the Admin API via OAuth
- Making requests to the Admin API (REST or GraphQL) and Storefront API (GraphQL).
- Register/process webhooks

For use on the server.

## API Clients

### [`@shopify/storefront-api-client`](./packages/storefront-api-client)

A library to interact with Shopify's GraphQL Storefront API. For use on the client or server.

### [`@shopify/admin-api-client`](./packages/admin-api-client)

A library to interact with Shopify's GraphQL Admin API. For use on the server.

### [`@shopify/graphql-client`](./packages/graphql-client)

A client to interact with any of Shopify's GraphQL APIs.

## Utilities

### [`@shopify/api-codegen-preset`](./packages/api-codegen-preset)

Enables JavaScript / TypeScript apps to use a `#graphql` tag to parse queries with [graphql-codegen](https://the-guild.dev/graphql/codegen).
