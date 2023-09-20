# shopify.utils.versionCompatible

This method determines if the given version is compatible (equal to or newer) with the configured `apiVersion` for the `shopifyApi` object.
Its main use is when you want to tweak behaviour depending on your current API version, though apps won't typically need this kind of check.

## Example

```ts
const shopify = shopifyApi({
  apiVersion: ApiVersion.July22,
});

if (shopify.utils.versionCompatible(ApiVersion.January22)) {
  // true in this example, as ApiVersion.July22 is newer than ApiVersion.January22
}
```

## Parameters

### apiVersion

`ApiVersion` | :exclamation: required

The API version to check against.

## Return

`boolean`

Whether the version is compatible.

[Back to shopify.utils](./README.md)
