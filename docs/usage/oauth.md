# Performing OAuth

After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
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

| Parameter     | Type              |      Required?       | Default Value | Notes                                                                |
| ------------- | ----------------- | :------------------: | :-----------: | -------------------------------------------------------------------- |
| `rawRequest`  | `AdapterRequest`  |         Yes          |       -       | The HTTP Request object used by your runtime.                        |
| `rawResponse` | `AdapterResponse` | _Depends on runtime_ |       -       | The HTTP Response object used by your runtime. Required for Node.js. |

It will return an object containing:

| Property  | Type             | Notes                                                                                                                                                                              |
| --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `session` | `Session`        | The new Shopify session, containing the API access token.                                                                                                                          |
| `headers` | `AdapterHeaders` | The HTTP headers to include in the response. In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above. Returns `undefined` for Node.js. |

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

## Auth-related utility methods

### Get the application URL for embedded apps using `getEmbeddedAppUrl`

If you need to redirect a request to your embedded app URL you can use `getEmbeddedAppUrl`

```ts
const redirectURL = shopify.auth.getEmbeddedAppUrl({
  rawRequest: req,
  rawResponse: res,
});
res.redirect(redirectURL);
```

Using this utility ensures that embedded app URL is properly constructed and brings the merchant to the right place. It is more reliable than using the shop param.

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.

### Safely compare two strings, string arrays, number arrays, or simple JS objects with `safeCompare`

`safeCompare` takes a pair of arguments of any of the following types and returns true if they are identical, both in term of type and content.

```ts
string
{[key: string]: string}
string[]
number[]
```

```ts
const stringArray1 = ['alice', 'bob', 'charlie'];
const stringArray2 = ['alice', 'bob', 'charlie'];

const stringArrayResult = shopify.auth.safeCompare(stringArray1, stringArray2); // true

const array1 = ['one fish', 'two fish'];
const array2 = ['red fish', 'blue fish'];
const arrayResult = shopify.auth.safeCompare(array1, array2); // false

const arg1 = 'hello';
const arg2 = ['world'];

const argResult = shopify.auth.safeCompare(arg1, arg2); // throws SafeCompareError due to argument type mismatch
```

### Generate a cryptographically random string of digits with `nonce`

`nonce` generates a string of 15 characters that are cryptographically random, suitable for short-lived values in cookies to aid validation of requests/responses.

```ts
const state = shopify.auth.nonce();
```

[Back to guide index](../../README.md#features)
