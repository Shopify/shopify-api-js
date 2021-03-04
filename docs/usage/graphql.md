# Make a GraphQL API call

Once OAuth is complete, we can use the library's `GraphqlClient` to make requests to the GraphQL Admin API in a similar way. To do that, create an instance of `GraphqlClient` using the current shop URL and session `accessToken` in your app's endpoint.

The `GraphQLClient`'s main method is `query`, which accepts a `GraphQLParams` object as its argument. `GraphQLParams` only requires the `data` parameter, but also optionally accepts `query`, `extraHeaders`, and `tries`:

| Parameter      | Type                                | Notes                                                                                 | Required? | Default Value |
| -------------- | ----------------------------------- | ------------------------------------------------------------------------------------- | :-------: | :-----------: |
| `data`         | `Record<string, unknown> \| string` | Takes in either the query as a string, and an object containing a query and variables |   True    |     none      |
| `query`        | `Record<string, string \| number>`  | An optional query object to be appended to the request                                |   False   |     none      |
| `extraHeaders` | `Record<string, string \| number>`  | Any additional headers you want to send with your request                             |   False   |     none      |
| `tries`        | `number`                            | The maximum number of times to retry the request _(must be >= 0)_                     |   False   |      `1`      |

```ts
const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
const client = new Shopify.Clients.Graphql(session.shop, session.accessToken); // GraphQLClient accepts the same arguments as RestClient
const products = await client.query({
  // use client.query and pass your query as `data`
  data: `{
      products (first: 10) {
        edges {
          node {
            id
            title
            bodyHtml
          }
        }
      }
    }`,
});
// do something with the returned data
```

[Back to guide index](../index.md)
