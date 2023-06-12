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

## Parameters

### shop

`string` | :exclamation: **required**

A Shopify domain name in the form `{exampleshop}.myshopify.com`.

### callbackPath

`string` | :exclamation: **required**

The path to the callback endpoint, with a leading `/`. This URL must be allowed in the Partners dashboard, or using the CLI to run your app.

### isOnline

`bool` | :exclamation: **required**

`true` if the session is online and `false` otherwise. Learn more about [OAuth access modes](https://shopify.dev/apps/auth/oauth/access-modes).

### rawRequest

`AdapterRequest` | :exclamation: **required**

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse` | :exclamation: **required** _for Node.js runtimes only_

The HTTP Response object used by your runtime.

## Return

`Promise<AdapterResponse>` (`undefined | Response`)

Returns a promise that resolves to an adapter response:

- For Node.js environments, it will automatically send the response and return `undefined`.
- For worker environments, it will return a `Response` object.

[Back to index](./README.md)
