# shopify.utils.sanitizeHost

This method makes user inputs safer by ensuring that they're proper `host` query arguments from Shopify requests.

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

`boolean`

Whether the host is valid.
