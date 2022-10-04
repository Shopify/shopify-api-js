# auth.getEmbeddedAppUrl

Builds a URL that returns the user to their current Shopify surface (Admin, mobile app, etc.) based on the current request the app is handling.
This is safe to use with any requests sent by Shopify.

## Example

```ts
const redirectUrl = await shopify.auth.getEmbeddedAppUrl({
  rawRequest: req,
  rawResponse: res,
});
```

## Parameters

### rawRequest

`AdapterRequest` | :exclamation: **required**

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse` | :exclamation: **required** _for Node.js runtimes only_

The HTTP Response object used by your runtime.

## Return

`Promise<string>`

A promise that resolves to a URL that points to the appropriate Shopify surface.

[Back to index](./README.md)
