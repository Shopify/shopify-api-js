# shopify.auth.buildEmbeddedAppUrl

Constructs the redirection URL for [getEmbeddedAppUrl](./getEmbeddedAppUrl.md) based on the given `host`.

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.

## Example

```ts
app.get('/redirect/endpoint', (req, res) => {
  const redirectURL = shopify.auth.buildEmbeddedAppUrl(req.query.host);

  res.redirect(redirectURL);
});
```

## Parameters

### host

`string` | :exclamation: required

The `host` parameter from the Shopify request.

## Return

`string`

The appropriate Shopify address to redirect to.

[Back to shopify.auth](./README.md)
