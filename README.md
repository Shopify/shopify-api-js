# `@shopify/shopify-api`

<!-- ![Build Status]() -->
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for TypeScript/JavaScript [Shopify](https://www.shopify.com) apps to access the [Shopify Admin API](https://shopify.dev/docs/admin-api), by making it easier to perform the following actions:

- Creating [online](https://shopify.dev/concepts/about-apis/authentication#online-access) or [offline](https://shopify.dev/concepts/about-apis/authentication#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/admin-api/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/admin-api/graphql/reference)
- Register/process webhooks

Once your app has access to the Admin API, you can also access the [Shopify Storefront API](https://shopify.dev/docs/storefront-api) to run GraphQL queries using the `unauthenticated_*` access scopes.

This library can be used in any application that has a Node.js backend, since it doesn't rely on any specific framework—you can include it alongside your preferred stack and only use the features that you need to build your app.

# Requirements

To follow these usage guides, you will need to:
- have a basic understanding of [Node.js](https://nodejs.org)
- have a Shopify Partner account and development store
- _OR_ have a test store where you can create a private app
- have a private or custom app already set up in your test store or partner account
- use [ngrok](https://ngrok.com), in order to create a secure tunnel to your app running on your localhost
- add the `ngrok` URL and the appropriate redirect for your OAuth callback route to your app settings
- have [yarn](https://yarnpkg.com) installed

<!-- Make sure this section is in sync with docs/README.md -->
# Getting started

You can follow our [getting started guide](docs/), which will provide instructions on how to create an app using plain Node.js code, or the [Express](https://expressjs.com/) framework. Both examples are written in Typescript.

- [Getting started](docs/getting_started.md)
  - [Install dependencies](docs/getting_started.md#install-dependencies)
  - [Set up base files](docs/getting_started.md#set-up-base-files)
  - [Set up environment](docs/getting_started.md#set-up-environment)
  - [Set up Context](docs/getting_started.md#set-up-context)
  - [Running your app](docs/getting_started.md#running-your-app)
- [Performing OAuth](docs/usage/oauth.md)
  - [Add a route to start OAuth](docs/usage/oauth.md#add-a-route-to-start-oauth)
  - [Add your OAuth callback route](docs/usage/oauth.md#add-your-oauth-callback-route)
  - [Fetching sessions](docs/usage/oauth.md#fetching-sessions)
  - [Detecting scope changes](docs/usage/oauth.md#detecting-scope-changes)
- [Make a REST API call](docs/usage/rest.md)
- [Make a GraphQL API call](docs/usage/graphql.md)
- [Make a Storefront API call](docs/usage/storefront.md)
- [Webhooks](docs/usage/webhooks.md)
  - [Register a Webhook](docs/usage/webhooks.md#register-a-webhook)
  - [Process a Webhook](docs/usage/webhooks.md#process-a-webhook)
- [Known issues and caveats](docs/issues.md)
  - [Notes on session handling](docs/issues.md#notes-on-session-handling)
