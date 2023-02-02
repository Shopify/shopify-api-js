# shopify.session.customAppSession

Builds a session instance that can be used in a [store-specific custom app](../../guides/custom-store-app.md).

It is the equivalent of calling the following:

```ts
const session = new Session({
  id: '',
  shop: `${sanitizeShop(config)(shop, true)}`,
  state: '',
  isOnline: false,
});
```

> **Note** This method performs validation on the `shop` parameter and will throw an error if the `shop` is not valid.

[Back to shopify.session](./README.md)
