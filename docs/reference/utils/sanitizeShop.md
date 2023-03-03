# shopify.utils.sanitizeShop

This method makes user inputs safer by ensuring that a given shop value is a properly formatted Shopify shop domain.

> **Note**: if you're using custom shop domains for testing, you can use the `customShopDomains` setting to add allowed domains.

## Example

```ts
const shop = shopify.utils.sanitizeShop(req.query.shop, true);
```

## Parameters

### shop

`string` | :exclamation: required

The incoming shop value.

### throwOnInvalid

`boolean` | Defaults to `false`

If `true`, throws an error when the shop is invalid.

## Return

`string | null`

The `shop` value if it is a properly formatted Shopify shop domain, otherwise `null`.

[Back to shopify.utils](./README.md)
