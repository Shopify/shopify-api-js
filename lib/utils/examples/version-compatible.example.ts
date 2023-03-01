const shopify = shopifyApi({
  apiVersion: ApiVersion.July22,
});

if (shopify.utils.versionCompatible(ApiVersion.January22)) {
  // true in this example, as ApiVersion.July22 is newer than ApiVersion.January22
}
