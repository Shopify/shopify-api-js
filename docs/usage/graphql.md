# Make a GraphQL API call

Once OAuth is complete, we can use the library's `GraphqlClient` to make requests to the GraphQL Admin API in a similar way. To do that, create an instance of `GraphqlClient` using the current shop URL and session `accessToken` in your app's endpoint.

```ts
<<<<<<< HEAD
  const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
  const client = new Shopify.Clients.Graphql.GraphqlClient(session.shop, session.accessToken); // GraphQLClient accepts the same arguments as RestClient
  const products = await client.query({ // use client.query and pass your query as `data`
    data: `{
=======
// Load the current session to get the `accessToken`
const session = await Shopify.Utils.loadCurrentSession(req);
// GraphQLClient takes in the shop url and the accessToken for that shop.
const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
// Use client.query and pass your query as `data`
const products = await client.query({
  data: `{
>>>>>>> origin/isomorphic/main
      products (first: 10) {
        edges {
          node {
            id
            title
            bodyHtml
          }
        }
      }
    }`
  });
  // do something with the returned data
```

[Back to guide index](../index.md)
