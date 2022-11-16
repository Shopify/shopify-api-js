# `@shopify/shopify-api`

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for the backends of TypeScript/JavaScript [Shopify](https://www.shopify.com) apps to access the [Shopify Admin API](https://shopify.dev/docs/admin-api), by making it easier to perform the following actions:

- Creating [online](https://shopify.dev/apps/auth#online-access) or [offline](https://shopify.dev/apps/auth#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/admin-api/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/admin-api/graphql/reference)
- Register/process webhooks

Once your app has access to the Admin API, you can also access the [Shopify Storefront API](https://shopify.dev/docs/storefront-api) to run GraphQL queries using the `unauthenticated_*` access scopes.

This library can be used in any application that runs on one of the supported runtimes. It doesn't rely on any specific framework, so you can include it alongside your preferred stack and only use the features that you need to build your app.

**Note**: this package will enable your app's backend to work with Shopify APIs, but you'll need to use [Shopify App Bridge](https://shopify.dev/apps/tools/app-bridge) in your frontend if you're planning on embedding your app into the Shopify Admin.

## Requirements

To follow these usage guides, you will need to:

- have a basic understanding of [TypeScript](https://www.typescriptlang.org/)
- have a Shopify Partner account and development store
- _OR_ have a test store where you can create a private app
- have a private or custom app already set up in your test store or partner account
- use [ngrok](https://ngrok.com), in order to create a secure tunnel to your app running on your localhost
- add the `ngrok` URL and the appropriate redirect for your OAuth callback route to your app settings
- have a JavaScript package manager such as [yarn](https://yarnpkg.com) installed

## Getting started

To install this package, you can run this on your terminal:

```bash
# You can use your preferred Node package manager
yarn add @shopify/shopify-api
```

**Note**: throughout these docs, we'll provide some examples of how this library may be used in an app using the [Express.js](https://expressjs.com/) framework for simplicity, but you can use it with any framework you prefer, as mentioned before.

The first thing you need to import is the adapter for your app's runtime. This will internally set up the library to use the right defaults and behaviours for the runtime.

<div>Node.js

```ts
import '@shopify/shopify-api/adapters/node';
```

</div><div>CloudFlare Worker

```ts
import '@shopify/shopify-api/adapters/cf-worker';
```

</div>

Next, configure the library - you'll need some values in advance:

- Your app's API key from [Partners dashboard](https://www.shopify.com/partners)
- Your app's API secret from Partners dashboard
- The [scopes](https://shopify.dev/api/usage/access-scopes) you need for your app

Call `shopifyApi` to create your library object before setting up your app itself:

```ts
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'ngrok-tunnel-address',
  ...
});

const app = express();
```

### Next steps

Once you configure your app, you can use this package to access the Shopify APIs.
See the specific documentation in the [Features section](#features) for instructions on how to get API access tokens and use them to query the APIs.

As a general rule, apps will want to interact with the Admin API to fetch / submit data to Shopify.
To do that, apps will need to:

1. Create an Admin API access token by going through [the OAuth flow](docs/usage/oauth.md).
1. Set up its own endpoints to:
   1. [Fetch the current session](docs/usage/oauth.md#using-sessions) created in the OAuth process.
   1. Create a [REST](docs/usage/rest.md) or [GraphQL](docs/usage/graphql.md) API client.
   1. Use the client to query the appropriate [Admin API](https://shopify.dev/api/admin).

### Configurations

These are all the configuration values `shopifyApi` supports.

| Value                           | Type                     | Required |        Default        | Description                                                                                                                                                                  |
| ------------------------------- | ------------------------ | :------: | :-------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey                          | `string`                 |   Yes    |           -           | API key from Partners Dashboard                                                                                                                                              |
| apiSecretKey                    | `string`                 |   Yes    |           -           | API secret from Partners Dashboard                                                                                                                                           |
| scopes                          | `string[] \| AuthScopes` |   Yes    |           -           | [App scopes](https://shopify.dev/api/usage/access-scopes)                                                                                                                    |
| hostName                        | `string`                 |   Yes    |           -           | App host name in the format `my-host-name.com`. Do **not** include the scheme or leading or trailing slashes                                                                 |
| hostScheme                      | `"https" \| "http"`      |    No    |       `"https"`       | The scheme for your app's public URL                                                                                                                                         |
| apiVersion                      | `ApiVersion`             |    No    | `LATEST_API_VERSION`  | API version your app will be querying. E.g. `ApiVersion.January20`                                                                                                           |
| isEmbeddedApp                   | `boolean`                |    No    |        `true`         | Whether your app will run within the Shopify Admin                                                                                                                           |
| isPrivateApp                    | `boolean`                |    No    |        `false`        | Whether you are building a private app for a store                                                                                                                           |
| userAgentPrefix                 | `string`                 |    No    |      `undefined`      | Any prefix you wish to include in the `User-Agent` for requests made by the library                                                                                          |
| privateAppStorefrontAccessToken | `string`                 |    No    |      `undefined`      | Fixed Storefront API access token for private apps                                                                                                                           |
| customShopDomains               | `(RegExp \| string)[]`   |    No    |      `undefined`      | Use this if you need to allow values other than `myshopify.com`                                                                                                              |
| billing                         | `BillingConfig`          |    No    |      `undefined`      | Billing configurations. [See documentation](docs/usage/billing.md) for full description                                                                                      |
| restResources                   | `ShopifyRestResources`   |    No    |           -           | Mounts the given REST resources onto the object. Must use the same version as `apiVersion`. Learn more about [using REST resources](docs/usage/rest.md#using-rest-resources) |
| logger                          | `{[key: string]: any}`   |    No    |           -           | Tweaks the behaviour of the package's internal logging to make it easier to debug applications                                                                               |
| &nbsp;&nbsp;logger.log          | `AsyncFunction`          |    No    | `() => Promise<void>` | Async callback function used for logging, which takes in a `LogSeverity` value and a formatted `message`. Defaults to using `console` calls matching the severity parameter  |
| &nbsp;&nbsp;logger.level        | `LogSeverity`            |    No    |  `LogSeverity.Info`   | Minimum severity for which to trigger the log function                                                                                                                       |
| &nbsp;&nbsp;logger.httpRequests | `boolean`                |    No    |        `false`        | Whether to log **ALL** HTTP requests made by the package. Only works if `level` is `Debug`                                                                                   |
| &nbsp;&nbsp;logger.timestamps   | `boolean`                |    No    |        `false`        | Whether to add the current timestamp to every log call                                                                                                                       |

## Features

- [OAuth](docs/usage/oauth.md)
  - [Start endpoint](docs/usage/oauth.md#start-endpoint)
  - [Callback endpoint](docs/usage/oauth.md#callback-endpoint)
  - [Using sessions](docs/usage/oauth.md#using-sessions)
  - [Detecting scope changes](docs/usage/oauth.md#detecting-scope-changes)
- [REST Admin API client](docs/usage/rest.md)
  - [Using REST resources](docs/usage/rest.md#using-rest-resources)
- [GraphQL Admin API client](docs/usage/graphql.md)
- [GraphqL Storefront API client](docs/usage/storefront.md)
- [Webhooks](docs/usage/webhooks.md)
  - [Register a Webhook](docs/usage/webhooks.md#register-a-webhook)
  - [Process a Webhook](docs/usage/webhooks.md#process-a-webhook)
- [Billing](docs/usage/billing.md)
- [Adding custom runtimes](docs/usage/runtimes.md)
- [Customizing logging configuration](docs/usage/logger.md)

## Migrating to v6

Before v6, this library only worked on Node.js runtimes. It now supports multiple runtimes through the use of adapters, more of which can be added over time.
If an adapter for the runtime you wish to use doesn't exist, you can create your own adapter by implementing some key functions, or contribute a PR to this repository.

In addition to updating the library to work on different runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
If you're upgrading an existing app on v5 or earlier, please see [the migration guide for v6](docs/migrating-to-v6.md).
