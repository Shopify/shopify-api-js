# Make a GraphQL API call

Once OAuth is complete, we can use the library's `GraphqlClient` to make requests to the GraphQL Admin API in a similar way. To do that, create an instance of `GraphqlClient` using the current shop URL and session `accessToken` in your app's endpoint.

The `GraphQLClient`'s main method is `query`, which accepts a `GraphQLParams` object as its argument. `GraphQLParams` only requires the `data` parameter, but also optionally accepts `query`, `extraHeaders`, and `tries`:

| Parameter      | Type                                | Required? | Default Value | Notes                                                                                |
| -------------- | ----------------------------------- | :-------: | :-----------: | ------------------------------------------------------------------------------------ |
| `data`         | `Record<string, unknown> \| string` |   True    |     none      | Takes in either the query as a string, or an object containing a query and variables |
| `query`        | `Record<string, string \| number>`  |   False   |     none      | An optional query object to be appended to the request                               |
| `extraHeaders` | `Record<string, string \| number>`  |   False   |     none      | Any additional headers you want to send with your request                            |
| `tries`        | `number`                            |   False   |      `1`      | The maximum number of times to retry the request _(must be >= 0)_                    |

```ts
// Example expected type for the response body
interface MyResponseBodyType {
  data: { ... }
}

// Load the current session to get the `accessToken`
const session = await Shopify.Utils.loadCurrentSession(req, res);
// GraphQLClient takes in the shop url and the accessToken for that shop.
const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
// Use client.query and pass your query as `data`.
const products = await client.query<MyResponseBodyType>({
  data: `{
      products (first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
          }
        }
      }
    }`,
});

// products.body will be of type MyResponseBodyType
products.body.data...
```

To make use of GraphQL variables, your `data` should contain `query` and `variables` properties.

```ts
const products = await client.query({
  data: {
    query: `query GetProducts($first: Int!) {
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
    variables: {
      first: 10,
    },
  },
});
```

Note that the call to `query` should be wrapped in a `try/catch` block. If the GraphQL API returns any errors, it will throw `ShopifyErrors.GraphqlQueryError` and provides the response from the API in the `response` attribute.

```ts
let products;
try {
  products = await client.query({
    data: `{
        products (first: 10) {
          edges {
            node {
              id
              title
              descriptionHtml
            }
          }
        }
      }`,
  });
} catch (error) {
  if (error instanceof ShopifyErrors.GraphqlQueryError) {
    // look at error.response for details returned from API,
    // specifically, error.response.errors[0].message
  } else {
    // handle other errors
  }
}

// assuming no errors, do something with the returned data...
```

[Back to guide index](../README.md)
