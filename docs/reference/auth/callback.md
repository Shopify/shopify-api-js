<<<<<<< HEAD
# shopify.auth.callback

Process Shopify's callback request after the user approves the app installation.
Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `shopify.auth.begin`.

Your app must then call `shopify.auth.callback` to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers to your app with which your app must respond.

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
=======
# auth.callback

Completes the OAuth process with Shopify.

If successful, it will save a new `Session` object using your configured `sessionStorage`, that contains an access token, that the app can use to interact with Shopify APIs.

> **Note**: this method sets HTTP headers to update the OAuth cookies.
> For worker runtimes, you'll need to add the headers to your response.

## Example

<div>Node.js

```ts
// The library will automatically set the appropriate HTTP headers in Node.js runtimes
const {session, headers} = await shopify.auth.callback({
  isOnline: false,
  rawRequest: req,
  rawResponse: res,
});

res.redirect('/my-apps-entry-page');
```

</div><div>Worker

```ts
const {session, headers} = await shopify.auth.callback<Headers>({
  isOnline: false,
  rawRequest: request,
});

// The callback returns some HTTP headers, but you can redirect to any route here
return new Response('', {
  status: 302,
  // Headers are of type [string, string][]
  headers: [...headers, ['Location', '/my-apps-entry-page']],
});
```

</div>

## Parameters

### isOnline

`bool` | :exclamation: required

`true` if the session is online and `false` otherwise. Must match the value from `auth.begin`.

### rawRequest

`AdapterRequest` | :exclamation: required
>>>>>>> af919a3c (Add OAuth reference docs pages)

The HTTP Request object used by your runtime.

### rawResponse

<<<<<<< HEAD
`AdapterResponse`| :exclamation: required for Node.js

The HTTP Response object used by your runtime.

## Return

Returns an object containing:
=======
`AdapterResponse` | :exclamation: required _for Node.js runtimes only_

The HTTP Response object used by your runtime. Required for Node.js.

## Return

`Promise<CallbackResponse>`

Returns a promise that resolves to an object containing a session and the necessary response HTTP headers.
>>>>>>> af919a3c (Add OAuth reference docs pages)

### session

`Session`

The new Shopify session, containing the API access token.

### headers

<<<<<<< HEAD
`AdapterHeaders`

The HTTP headers to include in the response.
In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above.
Returns `undefined` for Node.js.

[Back to shopify.auth](./README.md)
=======
`AdapterHeaders` (`[string, string[]][] | undefined`)

The HTTP headers to include in the response. In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above. Returns `undefined` for Node.js because they're automatically set.

[Back to index](./README.md)
>>>>>>> af919a3c (Add OAuth reference docs pages)
