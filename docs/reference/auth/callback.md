# shopify.auth.callback

Process Shopify's callback request after the user approves the app installation.
Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `shopify.auth.begin`.

Your app must then call `shopify.auth.callback` to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers your app with which your app must respond.

## Example

### Node.js

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

### Cloudflare workers

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

## Parameters

### rawRequest

`AdapterRequest`| :exclamation: required

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse`| :exclamation: required for Node.js

The HTTP Response object used by your runtime.

## Return

Returns an object containing:

### session

`Session`

The new Shopify session, containing the API access token.

### headers

`AdapterHeaders`

The HTTP headers to include in the response.
In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above.
Returns `undefined` for Node.js.

[Back to shopify.auth](./README.md)
