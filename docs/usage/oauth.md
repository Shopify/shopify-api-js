# Performing OAuth

After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/apps/auth/oauth).

To perform OAuth, you will need to create two endpoints in your app:

1. [Start the process](#start-endpoint) by directing the merchant to Shopify to ask for permission to install the app.
1. [Return the merchant to your app](#callback-endpoint) once they approve the app installation, to set up a session with an API access token.

Once you complete the OAuth process, you'll be able to [use the session it creates](#using-sessions) to create API clients.

**Note**: private apps are unable to perform OAuth, because they don't require an access token to interact with API.

## Using sessions

Once you set up both of the above endpoints, you can navigate to `<hostname>/auth` in your browser to begin OAuth, replacing `<hostname>` with either the tunnel url (e.g. ngrok, Cloudflare, etc.), or `localhost`, or the url to the running instance on a cloud platform, depending on how you are running your application. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, for instance [the REST Admin API client](./rest.md).

### Loading a session while handling a request

To load a session while handling a request, you can use `shopify.session.getCurrentId` to obtain the session id to then load the session to authenticate a request:

```ts
app.get('/fetch-some-data', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  // Build a client and make requests with session.accessToken
  // See the REST, GraphQL, or Storefront API documentation for more information
});
```

**Note**: this method will rely on cookies for non-embedded apps, and the `Authorization` HTTP header for embedded apps using [App Bridge session tokens](https://shopify.dev/apps/auth/oauth/session-tokens), making all apps safe to use in modern browsers that block 3rd party cookies.

For embedded apps, `shopify.session.getCurrentId` will only be able to find a session id if you use `authenticatedFetch` from the `@shopify/app-bridge-utils` client-side package. This function behaves like a [normal `fetch` call](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but ensures the appropriate headers are set.

Learn more about [making authenticated requests](https://shopify.dev/apps/auth/oauth/session-tokens/getting-started#step-2-authenticate-your-requests) using App Bridge.

### Loading a session for a background job

If your app needs to access the API while not handling a direct request, for example in a background job, you can use `shopify.session.getOfflineId` to generate an offline session id for the given shop that can then be used to load an offline access token for your script.

**Note 1**: this method **_does not_** perform any validation on the `shop` parameter. You should **_never_** read the shop from user inputs or URLs.

**Note 2**: obtaining and storing an offline session is performed by going through the OAuth process described above, i.e., using the [start endpoint](#start-endpoint) with the `isOnline` parameter set to `false` when calling `shopify.auth.begin()`.

```ts
const offlineSessionId = await shopify.session.getOfflineId({
  shop: '{exampleshop}.myshopify.com',
});

// use sessionId to retrieve session from app's session storage
// getSessionFromStorage() must be provided by application
const session = await getSessionFromStorage(offlineSessionId);
```

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

[Back to guide index](../../README.md#features)
