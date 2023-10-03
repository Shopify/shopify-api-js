# shopify.clients.graphqlProxy

This method forwards a request from the app's client side to the Shopify Admin GraphQL API, and returns the response headers and body from Shopify.

> **Note**: `graphqlProxy` only accepts online session tokens; using an offline token will fail to proxy the data.
## Example

```ts
app.post('/graphql/proxy', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  const response = await shopify.clients.graphqlProxy({
    session,
    rawBody: req.rawBody, // From my app
  });

  res.send(response.body);
});
```

## Parameters

This method takes in an object containing:

### session

`Session` | :exclamation: required

The Shopify session containing an Admin API access token.

### rawBody

`string` | :exclamation: required

The raw request body with the query to be forwarded to Shopify.

## Return

This method returns the request response from the Graphql client's [`query`](./Graphql.md#query) method.

[Back to shopify.clients](./README.md)
