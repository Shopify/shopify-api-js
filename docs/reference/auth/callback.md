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

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse` | :exclamation: required _for Node.js runtimes only_

The HTTP Response object used by your runtime. Required for Node.js.

## Return

`Promise<CallbackResponse>`

Returns a promise that resolves to an object containing a session and the necessary response HTTP headers.

### session

`Session`

The new Shopify session, containing the API access token.

### headers

`AdapterHeaders` (`[string, string[]][] | undefined`)

The HTTP headers to include in the response. In TypeScript, you can pass in a type to get a typed object back - see the Cloudflare example above. Returns `undefined` for Node.js because they're automatically set.

[Back to index](./README.md)
