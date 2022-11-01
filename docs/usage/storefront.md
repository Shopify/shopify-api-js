# GraphQL Storefront API client

The library also allows you to send GraphQL requests to the [Shopify Storefront API](https://shopify.dev/docs/storefront-api). To do that, you can use `shopify.clients.Storefront` with the current shop URL and a storefront-specific `accessToken`.

⚠️ This API limits request rates based on the IP address that calls it, which will be your server's address for all requests made by the library. The API uses a leaky bucket algorithm, with a default bucket size of 60 seconds of request processing time (minimum 0.5s per request), with a leak rate of 1/s. Learn more about [rate limits](https://shopify.dev/api/usage/rate-limits).

## Requirements

You can create Storefront API access tokens for both **private apps** and **sales channels**, but you **must use offline access tokens** for sales channels. Please read [our documentation](https://shopify.dev/docs/storefront-api/getting-started) to learn more about Storefront Access Tokens.

If you are building a private app, you can set a default Storefront Access Token for all `Storefront` client instances by setting the `config.privateAppStorefrontAccessToken` property.

## Creating and using tokens

The `Storefront` client extends the `Graphql` client, so it supports the same parameters. Please refer to the [Graphql client documentation](graphql.md) for details.

Below is a (simplified) example of how you may create a token (see [REST](https://shopify.dev/api/admin-rest/2022-07/resources/storefrontaccesstoken) or [GraphQL](https://shopify.dev/api/admin-graphql/2022-07/mutations/storefrontAccessTokenCreate) Admin API reference) and make a request:

```ts
app.get('/my-endpoint', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  // Create a new storefront access token using the REST Admin API (you can also use the GraphQL API)
  const adminApiClient = new shopify.clients.Rest({
    domain: session.shop,
    accessToken: session.accessToken,
  });
  const storefrontTokenResponse = await adminApiClient.post({
    path: 'storefront_access_tokens',
    data: {
      storefront_access_token: {
        title: 'This is my test access token',
      },
    },
  });

  const storefrontAccessToken =
    storefrontTokenResponse.body.storefront_access_token.access_token;

  // For simplicity, this example creates a token every time it's called, but that is not ideal.
  // You can fetch existing Storefront access tokens using the Admin API clients.
  const storefrontClient = new shopify.clients.Storefront({
    domain: session.shop,
    accessToken: storefrontAccessToken,
  });

  const products = await client.query({
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

  // do something with the returned data
});
```

Once you've created your access token, you can query the Storefront API based on the `unauthenticated_*` scopes your app requests.
See the [API reference documentation](https://shopify.dev/api/storefront) for detailed instructions on each component.

[Back to guide index](../../README.md#features)
