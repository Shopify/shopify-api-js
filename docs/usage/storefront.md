# Make a Storefront API call

The library also allows you to send GraphQL requests to the [Shopify Storefront API](https://shopify.dev/docs/storefront-api). To do that, you can use the `StorefrontClient` using the current shop URL and an `accessToken`.

You can obtain Storefront API access tokens for both private apps and sales channels. Please read [our documentation](https://shopify.dev/docs/storefront-api/getting-started) to learn more about Storefront Access Tokens. For example, public apps can create new Storefront Access Tokens by running the following code **with an offline Admin API session**:

```ts
const adminApiClient = new Shopify.Clients.Rest(
  session.shop,
  session.accessToken,
);
const storefrontTokenResponse = await adminApiClient.post({
  path: 'storefront_access_tokens',
  type: DataType.JSON,
  data: {
    storefront_access_token: {
      title: 'This is my test access token',
    },
  },
});

const storefrontAccessToken =
  storefrontTokenResponse.body['storefront_access_token']['access_token'];
```

If you are building a private app, you can set a default Storefront Access Token for all `StorefrontClient` instances by setting the `Shopify.Context.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN` property.

The `StorefrontClient` extends the `GraphqlClient`, so it supports the same parameters. Please refer to the [GraphqlClient documentation](graphql.md) for details.

Below is an example of how you may query the Storefront API:

```ts
// Load the access token as per instructions above
const storefrontAccessToken: string;
// Load the current session
const session = await Shopify.Utils.loadCurrentSession(req, res);
// StorefrontClient takes in the shop url and the Storefront Access Token for that shop.
const client = new Shopify.Clients.Storefront(
  session.shop,
  storefrontAccessToken,
);
// Use client.query and pass your query as `data`
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
```

[Back to guide index](../README.md)
