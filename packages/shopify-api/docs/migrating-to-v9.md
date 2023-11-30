# Migrating to v9

This document covers the changes apps will need to make to be able to upgrade to v9 of this package.

In this major version, our focus has been to integrate the `@shopify/shopify-api` package with our new GraphQL API clients, also contained in this repository.

The new clients provide the same level of functionality as the current ones, plus some other advantages:
- You can combine them with the `@shopify/api-codegen-preset` package to automatically add types for the variables and return objects
- Better support for the Storefront API
- An API that is closer to common GraphQL clients (e.g. Apollo) to make them feel more familiar:
    ```ts
    const client = shopify.clients.admin.graphql({ ... });
    const response: Response = await client.fetch(
      `query { ... }`,
      { variables: { ... } }
    );
    ```
- The new clients can return either the raw `Response` or a parsed response, as before
- Support for more API clients in the future

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Migrating to v9](#migrating-to-v9)
  - [Changes to runtime adapters](#changes-to-runtime-adapters)
  - [Using the new clients](#using-the-new-clients)
    - [GraphQL](#graphql)
    - [GraphQL proxy](#graphql-proxy)
    - [REST](#rest)

---

## Changes to runtime adapters

To better integrate with the new clients' ability to return the [Web API fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) response, our adapters were slightly changed: the `setAbstractFetchFunc` will now match the `fetch` API.

That means that instead of accepting a `NormalizedRequest` and returning a `NormalizedResponse`, it'll accept the `url` and `RequestInit` params, and return a `Response`.

This change enables us to return the raw `Response` object which might be more familiar to developers, and it makes creating new runtime adapters easier because you can pass in a `fetch` implementation directly, if one is available, bringing us closer to the community standard.

> [!NOTE]
> If you're not using a custom runtime adapter in your app, you don't have to worry about this change.
> The new version already includes updates for all adapters exported from this package.

Before:

```ts
import {setAbstractFetchFunc} from '@shopify/shopify-api/runtime';

export async function nodeFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  const resp = await fetch(url, {method, headers: flatHeaders(headers), body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}

setAbstractFetchFunc(nodeFetch);
```

After:

```ts
import fetch from 'node-fetch';
import {setAbstractFetchFunc} from '@shopify/shopify-api/runtime';

setAbstractFetchFunc(fetch);
```

or, if a `fetch` implementation isn't available:

```ts
import {AbstractFetchFunc, setAbstractFetchFunc} from '@shopify/shopify-api/runtime';

const convertFetch: AbstractFetchFunc = (url, init) => {
  // Make the actual request

  return new Response(/* ... */);
}

setAbstractFetchFunc(convertFetch);
```

## Using the new clients

While not a breaking change yet, we're deprecating the previous clients and replacing them with the new ones.

You can opt in to the new clients before the next major release by enabling the `unstable_newApiClients` future flag when calling `shopifyApi`:

```ts
const shopify = shopifyApi({
  // ...
  future: {
    unstable_newApiClients: true,
  },
});
```

### GraphQL

For your GraphQL calls, you'll be able to use either a `fetch` or a `request` function to return different levels of abstraction.

Before:

```ts
const client = new shopify.clients.Graphql({session});
const response = await client.query({
  data: {
    query: QUERY,
    variables: {/* ... */},
  },
});
console.log(response.body, response.headers);
```

After, using `fetch` to return a `Response` object:

```ts
const client = shopify.clients.admin.graphql({session});
const response = client.fetch(QUERY);
const body = await response.json();

console.log(body, response.headers);
```

or using `request` to return the parsed response:

```ts
const client = shopify.clients.admin.graphql({session});
const response = client.request(QUERY);

console.log(response.data, response.errors, response.extensions);
```

> [!NOTE]
> The `request` function returns a similar response to the previous iteration of `query`, but it no longer returns the response headers it received.
> That also applies to `GraphqlResponseError`s thrown when the response contains an `errors` field.

### GraphQL proxy

When using the future flag, the GraphQL proxy will no longer return a `RequestReturn`, but the same shape as `client.request` above.

### REST

For your REST calls, the client is essentially unchanged, but the `path` option is now a separate attribute to simplify GET calls, and make the API more consistent with GraphQL.

Before:

```ts
const client = new shopify.clients.Rest({session});
const response = await client.post({
  path: 'products',
  data: {
    myData: { /* ... */ }
  },
});
console.log(response.body, response.headers);
```
After:

```ts
const client = shopify.clients.admin.rest({session});
const response = await client.post(
  'products',
  {
    data: {
      myData: { /* ... */ }
    },
  }
);

console.log(response.body, response.headers);
```
