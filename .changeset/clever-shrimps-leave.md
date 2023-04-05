---
'@shopify/shopify-api': major
---

⚠️ [Breaking] Return pagination info as part of .all() requests in REST resources, and remove the `[PREV|NEXT]_PAGE_INFO` static, thread unsafe attributes.
Instead of returning a plain array of objects, it will now return an object containing that array, as well as the response headers and pagination info.

This enables apps to use locally-scoped pagination info, which makes it possible to use pagination in a thread-safe way.

You'll need to make 2 changes to use this version:

1. Where you accessed resources from the response, you'll now access the `data` property.
1. Where you accessed pagination data from the static variables, you'll now retrieve it from the response.

```ts
const response = await shopify.rest.Product.all({
  /* ... */
});

// BEFORE
const products: Product[] = response;
const nextPageInfo = shopify.rest.Product.NEXT_PAGE_INFO;

// AFTER
const products: Product[] = response.data;
const nextPageInfo = response.pageInfo?.nextPage;
const responseHeaders = response.headers;
```
