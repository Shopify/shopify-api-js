# Create a Client using `withSession`

This library provides a utility method `withSession` that you can use to create either a REST or GraphQL client, with
either the current active online session, or a specific offline session. The method will return both the requested
client, and the session with which that client will be authenticated.

This method accepts a `withSessionParams` object as its argument, which accepts options for the fields: `clientType`,
`isOnline`, `req`, `res`, and `shop`.

| Parameter    | Type                   | Notes                                                                |
| ------------ | ---------------------- | -------------------------------------------------------------------- |
| `clientType` | string                 | must be either `graphql` or `rest`                                   |
| `isOnline`   | boolean                | optional parameters needed are based on the value of `isOnline`      |
| `req`        | `http.IncomingMessage` | required if `isOnline`                                               |
| `res`        | `http.ServerResponse`  | required if `isOnline`                                               |
| `shop`       | string                 | required if `!isOnline` and should be passed without protocol prefix |

## Code Usage Examples

The following are specific examples of GraphQL/online session, and REST/offline session, but any combination of `clientType` and `isOnline` is valid.

<details>
<summary>Example: GraphQL Client with online Session</summary>

```ts
// create a `WithSessionParams` object with the necessary information to pass to `withSession`
const clientWithSessionParams: WithSessionParams = {
  clientType: 'graphql',
  isOnline: true,
  req: request, // http.IncomingMessage object
  res: response, // http.ServerResponse object
};

const {client, session} = (await Shopify.Utils.withSession(
  clientWithSessionParams,
)) as GraphqlWithSession;

// now you can make requests to the API using this client:
const shopName = await client.query({
  data: `{
      shop {
        name
      }
    }`,
});

// you can also introspect on the returned Session, if you need to
const currentSessionUser = session.onlineAccessInfo.associated_user;
```

</details>

<details>
<summary>Example: REST Client with offline session</summary>

```ts
const clientWithSessionParams: WithSessionParams = {
  clientType: 'rest',
  isOnline: false,
  shop: SHOP, // Shopify store url, without protocol, ie: "{shop}.myshopify.com"
};

const {client, session} = (await Shopify.Utils.withSession(
  clientWithSessionParams,
)) as RestWithSession;

const products = await client.get({path: 'products'});

const currentSessionScope = session.scope;
```

</details>
