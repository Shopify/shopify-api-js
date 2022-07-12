# utils

## Get the application URL for embedded apps using `getEmbeddedAppUrl`

If you need to redirect a request to your embedded app URL you can use `getEmbeddedAppUrl`

```ts
const redirectURL = getEmbeddedAppUrl(request);
res.redirect(redirectURL);
```

Using this utility ensures that embedded app URL is properly constructed and brings the merchant to the right place.  It is more reliable than using the shop param.

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.
