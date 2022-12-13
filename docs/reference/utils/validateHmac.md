# shopify.utils.validateHmac

Shopify requests include an `hmac` query argument. This method validates those requests to ensure that the `hmac` value was signed by Shopify and not spoofed.

## Example

```ts
const isValid = await shopify.utils.validateHmac(req.query);
```

## Parameters

### query

`{[key: string]: any}` | :exclamation: required

The request query arguments.

## Return

`boolean`

Whether the `hmac` value in the query is valid.
