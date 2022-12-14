# shopify.auth.getEmbeddedAppUrl

If you need to redirect a request to your embedded app URL you can use `getEmbeddedAppUrl`.

Using this method ensures that the embedded app URL is properly constructed and brings the merchant to the right place. It is more reliable than using the shop param.

This method relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.

## Example

```ts
app.get('/redirect/endpoint', async (req, res) => {
  const redirectURL = await shopify.auth.getEmbeddedAppUrl({
    rawRequest: req,
    rawResponse: res,
  });

  res.redirect(redirectURL);
});
```

## Parameters

### rawRequest

`AdapterRequest`| :exclamation: required

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse`| :exclamation: required for Node.js

The HTTP Response object used by your runtime.

## Return

`Promise<string>`

The appropriate Shopify address to redirect to.

[Back to shopify.auth](./README.md)
