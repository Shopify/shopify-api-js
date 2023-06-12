# shopify.utils.sanitizeHost

This method makes user inputs safer by ensuring that the `host` query arguments from Shopify requests is valid.

## Example

```ts
const host = shopify.utils.sanitizeHost(req.query.host, true);
```

## Parameters

### host

`string` | :exclamation: required

The incoming host value.

### throwOnInvalid

`boolean` | Defaults to `false`

If `true`, throws an error when the host is invalid.

## Return

`string | null`

The `host` value if it is properly formatted, otherwise `null`.

[Back to shopify.utils](./README.md)
