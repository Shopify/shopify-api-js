# Performing OAuth

Once you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/apps/auth/oauth).

To perform OAuth, you will need to create two endpoints in your app:

1. [Start the process](#start-endpoint) by directing the merchant to Shopify to ask for permission to install the app.
1. [Return the merchant to your app](#callback-endpoint) once they approve the app installation, to set up a session with an API access token.

Once you complete the OAuth process, you'll be able to [use the session it creates](#using-sessions) to create API clients.

**Note**: private apps are unable to perform OAuth, because they don't require an access token to interact with API.

## Start endpoint

The route for starting the OAuth process (in this case `/auth`) will use the library's `shopify.auth.begin` method. The method will set up the process and respond by redirecting the user to the Shopify Authentication screen, where the merchant will have to accept the required app scopes.

Example `/auth` endpoint in an Express.js app:

```ts
app.get('/auth', async (req, res) => {
  // The library will automatically redirect the user
  await shopify.auth.begin({
    shop: shopify.utils.sanitizeShop(req.query.shop, true),
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
});
```

Example `/auth` endpoint in a Cloudflare Worker:

```ts
async function handleFetch(request: Request): Promise<Response> {
  const {searchParams} = new URL(request.url);

  // The library will return a Response object
  return shopify.auth.begin({
    shop: shopify.utils.sanitizeShop(searchParams.get('shop'), true),
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: request,
  });
}
```

This method takes an object with the following properties:

| Parameter      | Type              |      Required?       | Default Value | Notes                                                                                                                                           |
| -------------- | ----------------- | :------------------: | :-----------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `shop`         | `string`          |         Yes          |       -       | A Shopify domain name in the form `{exampleshop}.myshopify.com`.                                                                                |
| `callbackPath` | `string`          |         Yes          |       -       | The path to the callback endpoint, with a leading `/`. This URL must be allowed in the Partners dashboard, or using the CLI to run your app.    |
| `isOnline`     | `bool`            |         Yes          |       -       | `true` if the session is online and `false` otherwise. Learn more about [OAuth access modes](https://shopify.dev/apps/auth/oauth/access-modes). |
| `rawRequest`   | `AdapterRequest`  |         Yes          |       -       | The HTTP Request object used by your runtime.                                                                                                   |
| `rawResponse`  | `AdapterResponse` | _Depends on runtime_ |       -       | The HTTP Response object used by your runtime. Required for Node.js.                                                                            |

## Callback endpoint

Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `shopify.auth.begin`. Your app can then call `shopify.auth.callback` to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers your app should respond with.

Example `/auth/callback` endpoint in an Express.js app:

```ts
app.get('/auth/callback', async (req, res) => {
  // The library will automatically set the appropriate HTTP headers
  const callback = await shopify.auth.callback({
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });

  // You can now use callback.session to make API requests

  res.redirect('/my-apps-entry-page');
});
```

Example `/auth/callback` endpoint in a Cloudflare Worker:

```ts
async function handleFetch(request: Request): Promise<Response> {
  const callback = await shopify.auth.callback<Headers>({
    isOnline: false,
    rawRequest: request,
  });

  // You can now use callback.session to make API requests

  // The callback returns some HTTP headers, but you can redirect to any route here
  return new Response('', {
    status: 302,
    // Headers are of type [string, string][]
    headers: [...callback.headers, ['Location', '/my-apps-entry-page']],
  });
}
```

This method takes an object with the following properties:

| Parameter     | Type              |      Required?       | Default Value | Notes                                                                                          |
| ------------- | ----------------- | :------------------: | :-----------: | ---------------------------------------------------------------------------------------------- |
| `isOnline`    | `bool`            |         Yes          |       -       | `true` if the session is online and `false` otherwise. Must match the value from `auth.begin`. |
| `rawRequest`  | `AdapterRequest`  |         Yes          |       -       | The HTTP Request object used by your runtime.                                                  |
| `rawResponse` | `AdapterResponse` | _Depends on runtime_ |       -       | The HTTP Response object used by your runtime. Required for Node.js.                           |

It will save a new session using your configured `sessionStorage`, and return an object containing:

| Property  | Type             | Notes                                                                                                                                                                              |
| --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `session` | `Session`        | The new Shopify session, containing the API access token.                                                                                                                          |
| `headers` | `AdapterHeaders` | The HTTP headers to include in the response. In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above. Returns `undefined` for Node.js. |

## Using sessions

Once you set up both of the above endpoints, you can navigate to `{your ngrok address}/auth` in your browser to begin OAuth. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, for instance [the REST Admin API client](./rest.md).

### Loading a session while handling a request

To load a session while handling a request, you can use `shopify.session.getCurrent` to authenticate a request for both online and offline sessions:

```ts
app.get('/fetch-some-data', async (req, res) => {
  const session = await shopify.session.getCurrent({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // Build a client and make requests with session.accessToken
});
```

**Note**: this method will rely on cookies for non-embedded apps, and the `Authorization` HTTP header for embedded apps using [App Bridge session tokens](https://shopify.dev/apps/auth/oauth/session-tokens), making all apps safe to use in modern browsers that block 3rd party cookies.

For embedded apps, `shopify.session.getCurrent` will only be able to find a session if you use `authenticatedFetch` from the `@shopify/app-bridge-utils` client-side package. This function behaves like a [normal `fetch` call](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but ensures the appropriate headers are set.

Learn more about [making authenticated requests](https://shopify.dev/apps/auth/oauth/session-tokens/getting-started#step-2-authenticate-your-requests) using App Bridge.

### Loading a session for a background job

If your app needs to access the API while not handling a direct request, for example in a background job, you can use `shopify.session.getOffline` to load an offline access token for your script.

**Note**: this method **_does not_** perform any validation on the `shop` parameter. You should **_never_** read the shop from user inputs or URLs.

```ts
const session = await shopify.session.getOffline({
  shop: '{exampleshop}.myshopify.com',
});
```

## Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the scopes that were requested from the merchant at the time.

When an app's scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

```ts
const session: Session; // Loaded from one of the methods above

if (!config.scopes.equals(session.scope)) {
  // Scopes have changed, the app should redirect the merchant to OAuth
}
```

This is useful if you have a middleware or pre-request check in your app to ensure that the session is still valid.

[Back to guide index](../../README.md#features)
