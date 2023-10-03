# shopify.utils.validateHmac

Shopify requests include an `hmac` query argument (or, in the case of app proxy requests, a `signature` query argument). This method validates those requests to ensure that the `hmac` value was signed by Shopify and not spoofed.

## Example

For OAuth requests:

```ts
const isValid = await shopify.utils.validateHmac(req.query);
```

For App Proxy requests:

```ts
const isValid = await shopify.utils.validateHmac(req.query, {
  signator: 'appProxy',
});
```

## Parameters

### query

`{[key: string]: any}` | :exclamation: required

The request query arguments.

## Return

`boolean`

Whether the `hmac`/`signature` value in the query is valid.

[Back to shopify.utils](./README.md)
