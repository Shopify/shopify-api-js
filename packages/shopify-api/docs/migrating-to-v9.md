# Migrating to v9

This document covers the changes apps will need to make to be able to upgrade to v9 of this package.

In this major version, our focus has been to integrate the `@shopify/shopify-api` package with our new GraphQL API clients, also contained in this repository.

> [!NOTE]
> This change is only breaking for apps that have created a custom runtime adapter that calls `setAbstractFetchFunc`.
> All our existing adapters were already updated accordingly.

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Migrating to v9](#migrating-to-v9)
  - [Changes to runtime adapters](#changes-to-runtime-adapters)

---

## Changes to runtime adapters

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
import {AbstractFetchFunc, setAbstractFetchFunc} from '@shopify/shopify-api/runtime';

const convertFetch: AbstractFetchFunc = (url, init) => {
  // Make the actual request

  return new Response(/* ... */);
}

setAbstractFetchFunc(convertFetch);
```
