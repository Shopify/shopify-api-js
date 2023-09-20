# `@shopify/shopify-api`

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for the backends of TypeScript/JavaScript [Shopify](https://www.shopify.com) apps to access the [Shopify Admin API](https://shopify.dev/docs/api/admin), by making it easier to perform the following actions:

- Creating [online](https://shopify.dev/docs/apps/auth/oauth/access-modes#online-access) or [offline](https://shopify.dev/docs/apps/auth/oauth/access-modes#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/api/admin/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/api/admin/graphql/reference)
- Register/process webhooks

Once your app has access to the Admin API, you can also access the [Shopify Storefront API](https://shopify.dev/docs/api/storefront) to run GraphQL queries using the `unauthenticated_*` access scopes.

This library can be used in any application that runs on one of the supported runtimes. It doesn't rely on any specific framework, so you can include it alongside your preferred stack and only use the features that you need to build your app.

**Note**: this package will enable your app's backend to work with Shopify APIs, but you'll need to use [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge) in your frontend if you're planning on embedding your app into the Shopify Admin.

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
</div><div>Generic runtimes that implement the <a href="https://developer.mozilla.org/en-US/docs/Web/API">Web API</a>

```ts
import '@shopify/shopify-api/adapters/web-api';
```

</div>

Next, configure the library - you'll need some values in advance:

- Your app's API key from [Partners dashboard](https://www.shopify.com/partners)
- Your app's API secret from Partners dashboard
- The [scopes](https://shopify.dev/docs/api/usage/access-scopes) you need for your app

Call `shopifyApi` ([see reference](./docs/reference/shopifyApi.md)) to create your library object before setting up your app itself:

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
See the [reference documentation](./docs/reference/README.md) for details on all the methods provided by this package.

See the specific documentation in the [Guides section](#guides) for high-level instructions on how to get API access tokens and use them to query the APIs.

As a general rule, apps will want to interact with the Admin API to fetch / submit data to Shopify.
To do that, apps will need to:

1. Create an Admin API access token by going through [the OAuth flow](docs/guides/oauth.md).
1. Set up its own endpoints to:
   1. [Fetch the current session](docs/guides/oauth.md#using-sessions) created in the OAuth process.
   1. Create a [REST](docs/reference/clients/Rest.md) or [GraphQL](docs/reference/clients/Graphql.md) API client.
   1. Use the client to query the appropriate [Admin API](https://shopify.dev/api/admin).

## Guides

- [Performing OAuth](docs/guides/oauth.md)
- [Storing sessions](docs/guides/session-storage.md)
- [Setting up webhooks](docs/guides/webhooks.md)
- [Using REST resources](docs/guides/rest-resources.md)
- [Configuring Billing](docs/guides/billing.md)
- [Adding custom runtimes](docs/guides/runtimes.md)
- [Customizing logging configuration](docs/guides/logger.md)
- [Setting up a custom store app](docs/guides/custom-store-app.md)

## Migrating to v6

Before v6, this library only worked on Node.js runtimes. It now supports multiple runtimes through the use of adapters, more of which can be added over time.
If an adapter for the runtime you wish to use doesn't exist, you can create your own adapter by implementing some key functions, or contribute a PR to this repository.

In addition to updating the library to work on different runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
If you're upgrading an existing app on v5 or earlier, please see [the migration guide for v6](docs/migrating-to-v6.md).
