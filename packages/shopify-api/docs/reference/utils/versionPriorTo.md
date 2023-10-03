# shopify.utils.versionPriorTo

This method determines if the given version is older than the configured `apiVersion` for the `shopifyApi` object.
Its main use is when you want to tweak behaviour depending on your current API version, though apps won't typically need this kind of check.

## Example

```ts
const shopify = shopifyApi({
  apiVersion: ApiVersion.July23,
});

if (shopify.utils.versionPriorTo(ApiVersion.July23)) {
  // false in this example, as both versions are July23
}
if (shopify.utils.versionPriorTo(ApiVersion.October23)) {
  // true in this example, as ApiVersion.October23 is newer than ApiVersion.July23, i.e. the configured version is older
  // than the reference one
}
```

## Parameters

### apiVersion

`ApiVersion` | :exclamation: required

The API version to check against.

## Return

`boolean`

Whether the reference version is older than the configured version.

[Back to shopify.utils](./README.md)
