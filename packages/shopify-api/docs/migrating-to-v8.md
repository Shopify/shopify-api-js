# Migrating to v8

This document covers the changes apps will need to make to be able to upgrade to v8 of this package.

The main reason for this release was to remove support for Node 14 so we can continue to evolve this package, but we also took this opportunity to remove some deprecated features.

## Table of contents

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Removing Node 14 support](#removing-node-14-support)
- [Storefront client API](#storefront-client-api)
- [Updates to the `Shopify` type](#updates-to-the-shopify-type)
- [Removing deprecated code](#removing-deprecated-code)

---

## Removing Node 14 support

We are removing support for Node 14 because:

- Node 14 has not been actively supported by Node since October 2021
- Node 14 has [reached its EOL](https://endoflife.date/nodejs) in February 2023
- Over 98% of Shopify apps are running on newer versions.

This means that over 98% of developers won't need to make any changes to their app to upgrade to this new version.
The remaining 2% should simply need to update their version of Node, and we don't anticipate there being an issues.

If you're running on Node 14, you'll need to upgrade to at least Node 16 before you can upgrade this package.

## Storefront client API

The Storefront API client used to accept the `domain` and `storefrontAccessToken` fields in its parameters, which worked under the assumption that the client would be using a [public Storefront API access token](https://shopify.dev/docs/api/usage/authentication#access-tokens-for-the-storefront-api).

This package integrates an app's backend with Shopify, and in that scenario, apps shouldn't use public tokens as rate limiting would be prohibitive.

Since this package now supports private tokens properly, we're deprecating the `domain` and `storefrontAccessToken` fields when creating a Storefront client, in favour of using the same `session` other clients use.
Support for `session` is a recent addition to this package, but we felt it's better to deprecate the old usage soon since it's not scalable and will potentially to lead to issues.

<details>
<summary>See an example</summary>

Before:

```ts
app.get('/my-endpoint', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  const adminApiClient = new shopify.clients.Rest({session});
  const storefrontTokenResponse = await adminApiClient.post({
    path: 'storefront_access_tokens',
    data: {
      storefront_access_token: {
        title: 'This is my test access token',
      },
    },
  });

  const storefrontAccessToken =
    storefrontTokenResponse.body.storefront_access_token.access_token;

  // For simplicity, this example creates a token every time it's called, but that is not ideal.
  // You can fetch existing Storefront access tokens using the Admin API client.
  const storefrontClient = new shopify.clients.Storefront({
    domain: session.shop,
    storefrontAccessToken,
    apiVersion: ApiVersion.January23,
  });
});
```

After:

```ts
app.get('/my-endpoint', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by the application
  const session = await getSessionFromStorage(sessionId);

  const client = new shopify.clients.Storefront({
    session,
    apiVersion: ApiVersion.January23,
  });
});
```

</details>

> **Note**:
> Going forward, changes like this will use future flags to allow for a longer grace period. We thank community members for your patience while we improve our tooling!

## Updates to the `Shopify` type

In previous versions, the `Shopify` type returned by `shopifyApi` only took into account the actual value of the `restResources` property.
The `shopifyApi` function now returns the actual type it received in the `config` object, which makes types more reliables for apps.

To achieve that, we changed the `Shopify` type to also receive the config as a generic type, and infer the `restResources` from the config.

Most apps shouldn't need to make any changes because the `shopifyApi` function did this automatically both in previous versions and v8.
If an app needed to explicitly use the `Shopify` type anywhere and set the resources generic, it'll need to pass in the `ConfigParams` type as the first generic.

<details>
<summary>See an example</summary>

Before:

```ts
import {restResources} from '@shopify/shopify-api/rest/admin/2023-10';

const myVariable: Shopify<typeof restResources>;
```

After:

```ts
import {
  restResources,
  ConfigParams,
} from '@shopify/shopify-api/rest/admin/2023-10';

const myVariable: Shopify<ConfigParams, typeof restResources>;
```

</details>

---

## Removing deprecated code

- As per Shopify's [API release schedule](https://shopify.dev/docs/api/usage/versioning#release-schedule), we support the last 4 versions of the API.
  To match the API, this library no longer supports versions `2022-04` and `2022-07`.
  If you need to upgrade your app's API version, please use the new version when calling the `shopifyApi` function:

  ```ts
  import {ApiVersion, shopifyApi} from '@shopify/shopify-api';

  const shopify = shopifyApi({
    // ...
    apiVersion: ApiVersion.October23,
  });
  ```

- Removed support for the `privateMetafieldNamespaces` field in webhooks. See [the documentation](https://shopify.dev/docs/apps/custom-data/metafields/migrate-private-metafields) for more information.
- When calling `shopifyApi`, the `adminApiAccessToken` setting is now mandatory when `isCustomStoreApp` is true. This planned deprecation has been logging an error since v7.1.0 (released in May 2023). Now it will throw an error.
- Removed deprecated v5 types.
