# Migrating to v9

This document covers the changes apps will need to make to be able to upgrade to v9 of this package.

In this major version, our focus has been to integrate the `@shopify/shopify-api` package with our new GraphQL API clients, also contained in this repository.

The new clients provide the same level of functionality as the current ones, plus some other advantages:

- You can combine them with the `@shopify/api-codegen-preset` package to automatically add types for the variables and return objects
- Better support for the Storefront API
- We've refactored the `query` method API so that it's closer to common GraphQL clients (e.g. Apollo) to make them feel more familiar:
  ```ts
  const client = new shopify.clients.Graphql({session});
  const response: Response = await client.request(
    `query { ... }`,
    { variables: { ... } }
  );
  ```
  > [!NOTE]
  > The previous method API still works, but you'll get deprecation notices until we release v10.
  > We encourage using the new format because of the typing improvements we made.
- Support for more API clients in the future

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Migrating to v9](#migrating-to-v9)
  - [Updated `gdprTopics` export](#updated-gdprtopics-export)
  - [Changes to runtime adapters](#changes-to-runtime-adapters)
  - [Using the new clients](#using-the-new-clients)

---

## Updated `gdprTopics` export

We rephrased "GDPR" to "Privacy" to account for other privacy regulations with data subject requests, which affects the `gdprTopics` export.

You can fix this by changing your `import` statements:

Before:

```ts
import {gdprTopics} from '@shopify/shopify-api';
```

After:

```ts
import {privacyTopics} from '@shopify/shopify-api';
```

## Changes to runtime adapters

> [!NOTE]
> This change is only breaking for apps that have created a custom runtime adapter that calls `setAbstractFetchFunc`.
> All our existing adapters were already updated accordingly.

To better integrate with the new clients' ability to return the [Web API fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) response, our adapters were slightly changed: the `setAbstractFetchFunc` will now match the `fetch` API.

That means that instead of accepting a `NormalizedRequest` and returning a `NormalizedResponse`, it'll accept the `url` and `RequestInit` params, and return a `Response`.

This change enables us to return the raw `Response` object which might be more familiar to developers, and it makes creating new runtime adapters easier because you can pass in a `fetch` implementation directly, if one is available, bringing us closer to the community standard.

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
import {
  AbstractFetchFunc,
  setAbstractFetchFunc,
} from '@shopify/shopify-api/runtime';

const convertFetch: AbstractFetchFunc = (url, init) => {
  // Make the actual request

  return new Response(/* ... */);
};

setAbstractFetchFunc(convertFetch);
```

## Using the new clients

With the introduction of the new clients, we've deprecated the `query` method in favor of `request`.

One of the main improvements we made in the new clients is the ability to type GraphQL operations using TypeScript types.
To start using types in your app, you can follow the [GraphQL types guide](./guides/graphql-types.md).

`request` takes in the query / mutation as the first argument, and the following options:

| Old option          | New option  | Notes                                                                                  |
| ------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `data.query`        | _N/A_       | The operation is the first argument now.                                               |
| `data.variables`    | `variables` | Variables are their own option now.                                                    |
| `data.extraHeaders` | `headers`   | Same option, renamed.                                                                  |
| `data.tries`        | `retries`   | Same purpose, but we felt `retries` is clearer. Subtract `1` from your previous value. |

The return type is also slightly different: instead of returning `body`, it returns the direct output of the underlying client, which are the two fields within `body`.

> [!NOTE]
>
> `query` will still work until the next major version, and log a deprecation for now.

Before:

```ts
const client = new shopify.clients.Graphql({session});
const response = await client.query({
  data: {
    query: QUERY,
    variables: {first: 1},
  },
  extraHeaders: {myHeader: '1'},
  tries: 1,
});
console.log(response.body.data, response.body.extensions);
```

After:

```ts
const client = new shopify.clients.Graphql({session});
const response = await client.request(QUERY, {
  variables: {first: 1},
  headers: {myHeader: '1'},
  retries: 2,
});
console.log(response.data, response.extensions);
```
