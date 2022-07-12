# utils

## Get the HOST application URL using `getHostAppUrl`

If you need to redirect a request to your app inside the user's admin you can use `getHostAppUrl`.

```ts
const redirectURL = getHostAppUrl(request);
res.redirect(redirectURL);
```

This utility relies on the host query param being a Base 64 encoded string. All requests from Shopify should include this param in the correct format.
