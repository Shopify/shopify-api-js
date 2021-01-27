# Create a Client using `withSession`

This library provides a utility method `withSession` that you can use to create either a REST or GraphQL client, with
either the current active online session, or a specific offline session. The method will return both the requested
client, and the session with which that client will be authenticated.

This method accepts a `withSessionParams` object as its argument, which accepts options for the fields: `clientType`,
`isOnline`, `req`, `res`, and `shop`.

- `clientType` must be either of `rest` or `graphql`.
- If `isOnline` is `true`,
  you must also pass in the `req`, and `res` options to receive the current **online** `Session` information.
- If `isOnline` is
  `false`, you must pass in the `shop` option to request that shops **offline** `Session` information.

To use this method to create a GraphQL client with the current online session, you can run the following code inside any
authenticated route where you can access the `request` and `response` objects:

```ts
// create a `withSessionParams` object with the necessary information to pass to `withSession`
const clientWithSessionParams: withSessionParams = {
  clientType: 'graphql',
  isOnline: true,
  req: request,
  res: response,
};

const {client, session} = await Shopify.Utils.withSession(clientWithSessionParams);

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

You can also use this method to create a REST client with an offline session, in which case you need only need to know
the shop you would like to access:

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

_Important Note: You can create any combination of REST or GraphQL clients with either an online or offline session,_
_these are just two example combinations. You could also create REST for an online session, or GraphQL for an offline_
_session_
