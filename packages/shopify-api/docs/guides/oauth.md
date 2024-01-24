# Performing OAuth

##### Table of content
- [Supported types of OAuth Flow](#supported-types-of-oauth-flow)
- [Token Exchange Flow](#token-exchange-flow)
  - [Non-Remix App](#non-remix-app)
  - [Remix App](#remix-app)
  - [Detecting scope changes](#detecting-scope-changes)
- [Authorization Code Grant Flow](#authorization-code-grant-flow)
  - [Detecting scope changes](#detecting-scope-changes-1)
- [After OAuth](#after-oauth)

----------------------------------------------------------------------------------
> [!TIP]
> If you are building an embedded app and you have scopes specified on Shopify Partners. We **strongly** recommend using the [Token Exchange Flow](#token-exchange-flow) for OAuth.

After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/docs/apps/auth/oauth).

## Supported types of OAuth flow
1. [Token Exchange Flow](#token-exchange-flow)
    - Recommended for embedded apps that have scopes declared on Shopify Partners dashboard
    - Avoids redirect to your app to continue the OAuth flow
    - Scope changes are handled by Shopify
2. [Authorization Code Grant Flow](#authorization-code-grant-flow)
    - Suitable for non-embedded apps
    - Scope changes are managed by the app

## Token Exchange Flow
To learn more about:
  - [Token Exchange](ZL:TODO link to shopify.dev)
  - [Declaring scopes with CLI on Shopify Partners](ZL: TODO link to shopify.dev managed install)

###### Remix App
Newly created Remix apps from template after February 1st 2024 will have token exchange turned on by default.

1. Ensure your scopes are [declared on Shopify Partners through the Shopify CLI](ZL:TODO link to shopify.dev for managed install)
2. Turn on the future flag `unstable_newEmbeddedAuthStrategy` when configuring your Remix app

```ts
// my-app/app/shopify.server.ts
const shopify = shopifyApp({
  ...
  isEmbeddedApp: true,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  }
})

```

3. Enjoy no-redirect OAuth flow.

###### Non-remix App
1. Ensure your scopes are [declared on Shopify Partners through the Shopify CLI](ZL:TODO link to shopify.dev for managed install)
2. Turn on future flag `unstable_tokenExchange` when configuring shopifyApi

```ts
shopifyApi({
  ...
  isEmbeddedApp: true,
  future: {
    unstable_tokenExchange: true,
  },
})
```
3. Start the OAuth process by calling [shopify.auth.tokenExchange](../reference/auth/tokenExchange.md) to exchange user session token to access token.
4. Use the exchanged session token to make authenticated API queries, see [After OAuth](#after-oauth)

#### Detecting scope changes
If your scopes are declared on Shopify Partners, scope changes will be handled by Shopify automatically. See [ZL:TODO NAME THIS](ZL:TODO link to shopify.dev for managed install) 
for more details. Using token exchange will guarantee that the access token retrieved will always have the latest scopes.

## Authorization Code Grant Flow
> [!NOTE]
> If you have an embedded app, it's **highly** recommended you [declare your app scopes on Shopify Partners with the CLI](ZL:TODO link to shopify.dev for managed install), and use 
> Token Exchange.

To perform Authorization Code Grant Flow, you will need to create two endpoints in your app:

1. Start the process by calling [shopify.auth.begin](../reference/auth/begin.md) to redirect the merchant to Shopify, to ask for permission to install the app.
1. Return the merchant to your app once they approve the app installation, by calling [shopify.auth.callback](../reference/auth/callback.md) to set up a session with an API access token.

#### Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the scopes that were requested from the merchant at the time.

When an app's scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

```ts
const session: Session; // Loaded from one of the methods above

if (!shopify.config.scopes.equals(session.scope)) {
  // Scopes have changed, the app should redirect the merchant to OAuth
}
```

This is useful if you have a middleware or pre-request check in your app to ensure that the session is still valid.

## After OAuth

Once you complete the OAuth process, you'll be able to call [shopify.session.getCurrentId](../reference/session/getCurrentId.md) to fetch your session, and create API clients.

> **Note**: private apps are unable to perform OAuth, because they don't require an access token to interact with API.

[Back to guide index](../../README.md#guides)
