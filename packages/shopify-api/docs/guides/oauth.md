# Performing OAuth

##### Table of contents
- [Supported types of OAuth Flow](#supported-types-of-oauth)
- [Token Exchange](#token-exchange)
  - [Remix App](#remix-app)
  - [Non-Remix App](#non-remix-app)
  - [Detecting scope changes](#detecting-scope-changes)
- [Authorization Code Grant Flow](#authorization-code-grant-flow)
  - [Detecting scope changes](#detecting-scope-changes-1)
- [After OAuth](#after-oauth)

----------------------------------------------------------------------------------
After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/docs/apps/auth/oauth).

## Supported types of OAuth
> [!TIP]
> If you are building an embedded app, we **strongly** recommend using [Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation)
with [token exchange](#token-exchange) instead of the authorization code grant flow.

1. [Token Exchange](#token-exchange)
    - Recommended for embedded apps
    - Doesn't require redirects, which makes it faster and prevents flickering when loading the app
    - Access scope changes are handled by Shopify if you use [Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation)
2. [Authorization Code Grant Flow](#authorization-code-grant-flow)
    - Suitable for non-embedded apps
    - Installations, and access scope changes are managed by the app

## Token Exchange
OAuth process by exchanging the current user's [session token](https://shopify.dev/docs/apps/auth/session-tokens) for an
[access token](https://shopify-dev-staging2.shopifycloud.com/docs/apps/auth/access-token-types/online.md) to make
authenticated Shopify API queries.

This can replace authorization code grant flow completely if you also take advantage of [Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation).

Learn more about:
  - [How token exchange works](https://shopify.dev/docs/apps/auth/get-access-tokens/token-exchange)
  - [Using Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation)
  - [Configuring access scopes through the Shopify CLI](https://shopify.dev/docs/apps/tools/cli/configuration)

###### Remix App
See ["new embedded app authorization Strategy"](https://shopify.dev/docs/api/shopify-app-remix#embedded-auth-strategy) to enable this feature.

###### Non-remix App
1. Ensure your access scopes are available on Shopify:
  - [configured through the Shopify CLI](https://shopify.dev/docs/apps/tools/cli/configuration) or
  - install your app through the [authorization code grant flow](#authorization-code-grant-flow) (not recommended)

2. Start the token acquisition process by calling [shopify.auth.tokenExchange](../reference/auth/tokenExchange.md) to exchange user session token to access token.
3. Use the exchanged session token to make authenticated API queries, see [After OAuth](#after-oauth)

#### Detecting scope changes

##### Shopify managed installation
If your access scopes are [configured through the Shopify CLI](https://shopify.dev/docs/apps/tools/cli/configuration), scope changes will be handled by Shopify automatically.
Learn more about [Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation).
Using token exchange will ensure that the access token retrieved will always have the latest access scopes granted by the user.

##### Not using Shopify managed installation - not recommended
If you don't have access scopes configured through the Shopify CLI, you can still use token exchange to exchange the current user's session token for access token.

> [!WARNING]
> This is not recommended because you'll have to manage both OAuth flows.

1. Use [authorization code grant flow](#authorization-code-grant-flow) to handle app installation so your app's access scopes will be 
available in Shopify.
2. Once the app is installed for the user, you can use token exchange to exchange that user's session token to retrieve access token to refresh an expired token.
   - Using token exchange will ensure you don't have to handle redirects through the [authorization code grant flow](#authorization-code-grant-flow) on subsequent authorization calls,
   except when your requested access scopes changes.

## Authorization Code Grant Flow
> [!NOTE]
> If you are building an embedded app, we **strongly** recommend using [Shopify managed installation](https://shopify.dev/docs/apps/auth/installation#shopify-managed-installation)
with [token exchange](#token-exchange) instead of the authorization code grant flow.

To perform [authorization code grant flow](https://shopify.dev/docs/apps/auth/get-access-tokens/authorization-code-grant), you will need to create two endpoints in your app:

1. Start the process by calling [shopify.auth.begin](../reference/auth/begin.md) to redirect the merchant to Shopify, to ask for permission to install the app.
1. Return the merchant to your app once they approve the app installation, by calling [shopify.auth.callback](../reference/auth/callback.md) to set up a session with an API access token.

#### Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the access scopes that were requested from the merchant at the time.

When an app's access scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

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
