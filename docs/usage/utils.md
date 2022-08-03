# utils

## Get the application URL for embedded apps using `getEmbeddedAppUrl`

If you need to redirect a request to your embedded app URL you can use `getEmbeddedAppUrl`

```ts
const redirectURL = Shopify.Utils.getEmbeddedAppUrl(request);
res.redirect(redirectURL);
```

Using this utility ensures that embedded app URL is properly constructed and brings the merchant to the right place. It is more reliable than using the shop param.

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.

## Sanitize a Shopify shop domain and host address

When receiving input from users, like in URL query arguments, you should always make sure to sanitize that data.
To make it easier to do that, this library provides the following methods:

```ts
const shop = Shopify.Utils.sanitizeShop(req.query.shop, true);
const host = Shopify.Utils.sanitizeHost(req.query.host, true);
```

Both of these return the string itself if it's valid, or `null` otherwise.
You can also optionally set the method to throw an exception if the validation fails.
If you're using custom shop domains for testing, you can add them to the `Shopify.Context.CUSTOM_SHOP_DOMAINS` setting.
