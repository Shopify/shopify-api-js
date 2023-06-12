# auth.buildEmbeddedAppUrl

Constructs a URL that points to the Shopify surface for the given `host` query argument.

## Example

```ts
const redirectUrl = shopify.auth.buildEmbeddedAppUrl(req.query.host);
```

## Parameters

### host

`string`

The `host` query argument from the request.

## Return

`string`

A URL pointing to the appropriate address for the given host.

[Back to index](./README.md)
