<<<<<<< HEAD
# shopify.auth.getEmbeddedAppUrl

If you need to redirect a request to your embedded app URL you can use `getEmbeddedAppUrl`.

Using this method ensures that the embedded app URL is properly constructed and brings the merchant to the right place. It is more reliable than using the shop param.

This method relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.
=======
# auth.getEmbeddedAppUrl

Builds a URL that returns the user to their current Shopify surface (Admin, mobile app, etc.) based on the current request the app is handling.
This is safe to use with any requests sent by Shopify.
>>>>>>> af919a3c (Add OAuth reference docs pages)

## Example

```ts
<<<<<<< HEAD
app.get('/redirect/endpoint', async (req, res) => {
  const redirectURL = await shopify.auth.getEmbeddedAppUrl({
    rawRequest: req,
    rawResponse: res,
  });

  res.redirect(redirectURL);
=======
const redirectUrl = await shopify.auth.getEmbeddedAppUrl({
  rawRequest: req,
  rawResponse: res,
>>>>>>> af919a3c (Add OAuth reference docs pages)
});
```

## Parameters

### rawRequest

<<<<<<< HEAD
`AdapterRequest`| :exclamation: required
=======
`AdapterRequest` | :exclamation: **required**
>>>>>>> af919a3c (Add OAuth reference docs pages)

The HTTP Request object used by your runtime.

### rawResponse

<<<<<<< HEAD
`AdapterResponse`| :exclamation: required for Node.js
=======
`AdapterResponse` | :exclamation: **required** _for Node.js runtimes only_
>>>>>>> af919a3c (Add OAuth reference docs pages)

The HTTP Response object used by your runtime.

## Return

`Promise<string>`

<<<<<<< HEAD
The appropriate Shopify address to redirect to.

[Back to shopify.auth](./README.md)
=======
A promise that resolves to a URL that points to the appropriate Shopify surface.

[Back to index](./README.md)
>>>>>>> af919a3c (Add OAuth reference docs pages)
