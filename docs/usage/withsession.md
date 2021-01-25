# Create a Client using `withSession`

This library provides a utility method `withSession` that we can use to create either a REST or GraphQL client, with
either the current active online session, or a specific offline session. The method will return both the requested
client, and the session with which that client will be authenticated.

This method accepts a `withSessionParams` object as its argument, which accepts options for the fields: `clientType`,
`isOnline`, `req`, `res`, and `shop`. `clientType` must be either of `rest` or `graphql`. If `isOnline` is `true`,
you must also pass in the `req`, and `res` options, and if `isOnline` is `false`, you must pass in the `shop` option.

To use this method to create a GraphQL client with the current online session, we can run the following code inside any
authenticated route where we can access to the `request` and `response` objects:

```ts
// we pass in a `withSessionParams` object to `withSession` with the necessary information
const clientWithSessionParams: withSessionParams = {
  clientType: 'graphql',
  isOnline: true,
  req: request,
  res: response,
};

const {client, session} = await Shopify.Utils.withSession(clientWithSessionParams);

// now we can make requests to the API using this client:
const shopName = await client.query({
  data: `{
      shop {
        name
      }
    }`,
});

// we can also introspect on the returned Session, if we need to
const currentSessionUser = session.onlineAccessInfo.associated_user;
```

We can also use this method to create a REST client with an offline session, in which case we need only need to know
the shop we would like to access:

```ts
const clientWithSessionParams: withSessionParams = {
  clientType: 'rest',
  isOnline: false,
  shop: SOME_SHOP_URL,
};

const {client, session} = await Shopify.Utils.withSession(clientWithSessionParams);

const products = await client.get({path: 'products'});

const currentSessionScope = session.scope;
```
