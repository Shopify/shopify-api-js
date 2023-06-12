<<<<<<< HEAD
# shopify.auth.begin

Begins the OAuth process by redirecting the merchant to the Shopify Authentication screen, where they will be asked to approve the required app scopes.

## Examples

### Node.js

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

### Cloudflare workers

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

=======
# auth.begin

Begins the OAuth process with Shopify, preparing a request to authenticate the merchant and ask their permission for the scopes the app will need.

## Example

```ts
const response = await shopify.auth.begin({
  shop: 'my-shop-address.myshopify.com',
  callbackPath: '/auth/callback',
  isOnline: false,
  rawRequest: req,
  rawResponse: res,
});
```

>>>>>>> af919a3c (Add OAuth reference docs pages)
## Parameters

### shop

<<<<<<< HEAD
`string` | :exclamation: required
=======
`string` | :exclamation: **required**
>>>>>>> af919a3c (Add OAuth reference docs pages)

A Shopify domain name in the form `{exampleshop}.myshopify.com`.

### callbackPath

<<<<<<< HEAD
`string` | :exclamation: required
=======
`string` | :exclamation: **required**
>>>>>>> af919a3c (Add OAuth reference docs pages)

The path to the callback endpoint, with a leading `/`. This URL must be allowed in the Partners dashboard, or using the CLI to run your app.

### isOnline

<<<<<<< HEAD
`bool` | :exclamation: required

`true` if the session is online and `false` otherwise. Learn more about [OAuth access modes](https://shopify.dev/docs/apps/auth/oauth/access-modes).

### rawRequest

`AdapterRequest` | :exclamation: required
=======
`bool` | :exclamation: **required**

`true` if the session is online and `false` otherwise. Learn more about [OAuth access modes](https://shopify.dev/apps/auth/oauth/access-modes).

### rawRequest

`AdapterRequest` | :exclamation: **required**
>>>>>>> af919a3c (Add OAuth reference docs pages)

The HTTP Request object used by your runtime.

### rawResponse

<<<<<<< HEAD
`AdapterResponse` | :exclamation: required for Node.js

The HTTP Response object used by your runtime. Required for Node.js.

## Return

### Node.js

`Promise<void>`

This method triggers a response to the given request automatically.

### Cloudflare workers

`Promise<Response>`

The response to be returned from the request handler.

[Back to shopify.auth](./README.md)
=======
`AdapterResponse` | :exclamation: **required** _for Node.js runtimes only_

The HTTP Response object used by your runtime.

## Return

`Promise<AdapterResponse>` (`undefined | Response`)

Returns a promise that resolves to an adapter response:

- For Node.js environments, it will automatically send the response and return `undefined`.
- For worker environments, it will return a `Response` object.

[Back to index](./README.md)
>>>>>>> af919a3c (Add OAuth reference docs pages)
