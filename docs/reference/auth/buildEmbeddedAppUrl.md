<<<<<<< HEAD
# shopify.auth.buildEmbeddedAppUrl

Constructs the redirection URL for [getEmbeddedAppUrl](./getEmbeddedAppUrl.md) based on the given `host`.

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.
=======
# auth.buildEmbeddedAppUrl

Constructs a URL that points to the Shopify surface for the given `host` query argument.
>>>>>>> af919a3c (Add OAuth reference docs pages)

## Example

```ts
<<<<<<< HEAD
app.get('/redirect/endpoint', (req, res) => {
  const redirectURL = shopify.auth.buildEmbeddedAppUrl(req.query.host);

  res.redirect(redirectURL);
});
=======
const redirectUrl = shopify.auth.buildEmbeddedAppUrl(req.query.host);
>>>>>>> af919a3c (Add OAuth reference docs pages)
```

## Parameters

### host

<<<<<<< HEAD
`string` | :exclamation: required

The `host` parameter from the Shopify request.
=======
`string`

The `host` query argument from the request.
>>>>>>> af919a3c (Add OAuth reference docs pages)

## Return

`string`

<<<<<<< HEAD
The appropriate Shopify address to redirect to.

[Back to shopify.auth](./README.md)
=======
A URL pointing to the appropriate address for the given host.

[Back to index](./README.md)
>>>>>>> af919a3c (Add OAuth reference docs pages)
