# shopify.session.getCurrentId

Extracts the Shopify session id from the given request.

For embedded apps, `shopify.session.getCurrentId` will only be able to find a session id if you use `authenticatedFetch` from the `@shopify/app-bridge-utils` client-side package.
This function behaves like a [normal `fetch` call](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but ensures the appropriate headers are set.

Learn more about [making authenticated requests](https://shopify.dev/docs/apps/auth/oauth/session-tokens/getting-started#step-2-authenticate-your-requests) using App Bridge.

## Example

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

> **Note**: this method will rely on cookies for non-embedded apps, and the `Authorization` HTTP header for embedded apps using [App Bridge session tokens](https://shopify.dev/docs/apps/auth/oauth/session-tokens), making all apps safe to use in modern browsers that block 3rd party cookies.

## Parameters

Receives an object containing:

### isOnline

`boolean` | :exclamation: required

Whether to look for an offline or online session, depending on how the [`auth.begin`](../auth/begin.md) method was called.

### rawRequest

`AdapterRequest` | :exclamation: required

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse` | :exclamation: required for Node.js

The HTTP Response object used by your runtime. Required for Node.js.

## Return

`Promise<string | undefined>`

The session id for the request, or `undefined` if none was found.

[Back to shopify.session](./README.md)
