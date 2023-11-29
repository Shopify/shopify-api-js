# shopify.clients.admin.graphql

> [!NOTE]
> If you're not using the `unstable_newApiClients` future flag, your app will use the [legacy client](./legacy_Graphql.md).

This function creates an instance of client from [`@shopify/admin-api-client`](https://github.com/Shopify/shopify-api-js/tree/main/packages/admin-api-client), which you can use to `fetch` or `request` data.

## Example

```ts
const client = shopify.clients.admin.graphql({session});
const response = await client.fetch(`#graphql
  query {
    shop {
      name
    }
  }`
);

console.log(await response.json());
```

## Parameters

### session

`Session` | :exclamation: required

The session containing the access token for the current request.

### apiVersion

`ApiVersion`

An override API version to query against.
Defaults to the global one set in the `shopifyApi` configuration.

### retries

`number`

The default number of retries for all requests made with this client.

## Return type

`AdminApiClient`

### fetch

Makes a request to the Admin API and returns the raw `Response` object.

#### Examples

```ts
const client = shopify.clients.admin.graphql({session});
const response = await client.fetch(
  `#graphql
  query firstProducts {
    products (first: $first) {
      edges {
        node {
          id
          title
          descriptionHtml
        }
      }
    }
  }`,
  {
    variables: {
      first: 10,
    }
  }
);

console.log(await response.json());
```

### request

Makes a request to the Admin API and returns a parsed response.

#### Examples

```ts
const client = shopify.clients.admin.graphql({session});
const response = await client.request(
  `#graphql
  query firstProducts {
    products (first: $first) {
      edges {
        node {
          id
          title
          descriptionHtml
        }
      }
    }
  }`,
  {
    variables: {
      first: 10,
    }
  }
);

console.log(response.data, response.errors);
```
