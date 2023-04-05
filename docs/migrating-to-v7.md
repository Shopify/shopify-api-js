# Migrating to v7

First of all, don't worry - this is nowhere near as big a change as v6!

Thanks to all the feedback we got from the community, we made some changes to the library to remove friction introduced with v6.
There were no major refactors in this version, but the library's public API changed in some places.

## Table of contents

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Thread-safe REST resource pagination](#thread-safe-rest-resource-pagination)
- [Synchronous logger calls](#synchronous-logger-calls)
- [`shopify.webhook.addHandlers` is no longer `async`](#shopifywebhookaddhandlers-is-no-longer-async)
- [Removing deprecated code](#removing-deprecated-code)

---

## Thread-safe REST resource pagination

The library now returns pagination info as part of `.all()` requests in REST resources, and no longer uses the `[PREV|NEXT]_PAGE_INFO` static, thread unsafe attributes.
Instead of returning a plain array of objects, it will now return an object containing that array (in a `data` property), as well as the response headers and pagination info.

This enables apps to use locally-scoped pagination info, which makes it possible to use pagination in a thread-safe way.

If your app is using REST resources, you'll need to make two changes to use this version:

1. Where you accessed resources from the response, you'll now access the `data` property.
1. Where you accessed pagination data from the static variables, you'll now retrieve it from the response.

Example:

```ts
const response = await shopify.rest.Product.all({
  // ...
});

// BEFORE, e.g., v6
const products: Product[] = response;
const nextPageInfo = shopify.rest.Product.NEXT_PAGE_INFO;

// AFTER, e.g., v7
const products: Product[] = response.data;
const nextPageInfo = response.pageInfo?.nextPage;
const responseHeaders = response.headers;
```

Please see [the REST resources guide](../docs/guides/rest-resources.md#paginated-requests) for more information.

---

## Synchronous logger calls

With the introduction of the logger in v6, apps can use their own log functions.
To support that, we originally made the `logger` calls `async`, so that apps can create custom methods that call into databases or external services for logging.

That had the unintended side effect of forcing functions that used logging to also be `async`, which isn't ideal.
To address that, the `shopify.logger` functions will no longer return Promises.

If your app is directly calling the logger, you'll no longer need to `await` those calls.
If you're implementing your own logger, you'll need to handle the promise in your function.

Example:

```ts
// BEFORE
const shopify = shopifyApi({
  // ...
  logger: {
    log: async (severity, message) => {
      try {
        await MyService.log();

        // After external call
      } catch {
        // Handle error
      }
    },
  },
});
await shopify.logger.info('My message');

// AFTER
const shopify = shopifyApi({
  // ...
  logger: {
    log: (severity, message) => {
      MyService.log()
        .then(() => {
          // After external call
        })
        .catch(() => {
          // Handle error
        });
    },
  },
});
shopify.logger.info('My message');
```

---

## `shopify.webhook.addHandlers` is no longer `async`

One of the side effects of the loggers being `async` was that `addHandlers` had to also be `async`.
With the updated logger, you'll no longer need to `await` those calls.

Example:

```ts
// BEFORE
await shopify.webhooks.addHandlers({
  // ...
});

// AFTER
shopify.webhooks.addHandlers({
  // ...
});
```

---

## Removing deprecated code

- As per Shopify's [API release schedule](https://shopify.dev/docs/api/usage/versioning#release-schedule), we support the last 4 versions of the API.
  To match the API, this library no longer supports versions `2022-04` and `2022-07`.
- The `isPrivateApp` param from `shopifyApi()` was removed in favour of `isCustomStoreApp`.
- The `isOnline` param from `shopify.auth.callback()` was removed, because it's now handled automatically.
