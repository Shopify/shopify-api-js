# Migrating to v8

This document covers the changes apps will need to make to be able to upgrade to v8 of this package.

The main reason for this release was to remove support for Node 14 so we can continue to evolve this package, but we also took this opportunity to remove some deprecated features.

## Table of contents

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Removing Node 14 support](#removing-node-14-support)
- [Storefront client API](#storefront-client-api)
- [Removing deprecated code](#removing-deprecated-code)

---

## Removing Node 14 support

Since dependencies we use in this package have started to use features and code syntax not available on Node 14, we needed to remove support for it so that we can continue to evolve our features.

In general, the majority of developers should be running Node 16 or newer already, which means they won't need to make any changes.

If you're running on Node 14, you'll need to upgrade to at least Node 16 before you can upgrade this package.

## Storefront client API

The Storefront API client used to accept the `domain` and `storefrontAccessToken` fields in its parameters, which worked under the assumption that the client would be using a [public Storefront API access token](https://shopify.dev/docs/api/usage/authentication#access-tokens-for-the-storefront-api).

This package integrates an app's backend with Shopify, and in that scenario, apps shouldn't use public tokens as rate limiting would be prohibitive.

Since this package now supports private tokens properly, we're deprecating the `domain` and `storefrontAccessToken` fields when creating a Storefront client, in favour of using the same `session` other clients use.
Support for `session` is a recent addition to this package, but we felt it's better to deprecate the old usage soon since it's not scalable and will potentially to lead to issues.

> **Note**:
> Going forward, changes like this will use future flags to allow for a longer grace period. We thank community members for your patience while we improve our tooling!

---

## Removing deprecated code

- As per Shopify's [API release schedule](https://shopify.dev/docs/api/usage/versioning#release-schedule), we support the last 4 versions of the API.
  To match the API, this library no longer supports versions `2022-04` and `2022-07`.
- Removed support for the `privateMetafieldNamespaces` field in webhooks. See [the documentation](https://shopify.dev/docs/apps/custom-data/metafields/migrate-private-metafields) for more information.
- When calling `shopifyApi`, the `adminApiAccessToken` setting is now mandatory when `isCustomStoreApp` is true.
- Removed deprecated v5 types.
