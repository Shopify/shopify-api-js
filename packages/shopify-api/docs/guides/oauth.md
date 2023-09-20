# Performing OAuth

After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/docs/apps/auth/oauth).

To perform OAuth, you will need to create two endpoints in your app:

1. Start the process by calling [shopify.auth.begin](../reference/auth/begin.md) to redirect the merchant to Shopify, to ask for permission to install the app.
1. Return the merchant to your app once they approve the app installation, by calling [shopify.auth.callback](../reference/auth/callback.md) to set up a session with an API access token.

Once you complete the OAuth process, you'll be able to call [shopify.session.getCurrentId](../reference/session/getCurrentId.md) to fetch your session, and create API clients.

> **Note**: private apps are unable to perform OAuth, because they don't require an access token to interact with API.

## Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the scopes that were requested from the merchant at the time.

When an app's scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

```ts
const session: Session; // Loaded from one of the methods above

if (!shopify.config.scopes.equals(session.scope)) {
  // Scopes have changed, the app should redirect the merchant to OAuth
}
```

This is useful if you have a middleware or pre-request check in your app to ensure that the session is still valid.

[Back to guide index](../../README.md#guides)
