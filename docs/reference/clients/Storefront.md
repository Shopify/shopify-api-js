# shopify.clients.Storefront

Instances of this class can make requests to the Shopify Storefront API.

> **Note**: ⚠️ This API limits request rates based on the IP address that calls it, which will be your server's address for all requests made by the library. The API uses a leaky bucket algorithm, with a default bucket size of 60 seconds of request processing time (minimum 0.5s per request), with a leak rate of 1/s. Learn more about [rate limits](https://shopify.dev/api/usage/rate-limits).

## Requirements

You can create Storefront API access tokens for both **private apps** and **sales channels**, but you **must use offline access tokens** for sales channels. Please read [our documentation](https://shopify.dev/docs/storefront-api/getting-started) to learn more about Storefront Access Tokens.

If you are building a private app, you can set a default Storefront Access Token for all `Storefront` client instances by setting the `config.privateAppStorefrontAccessToken` property when calling [`shopifyApi`](../shopifyApi.md).

## Constructor

### Example

Below is a (simplified) example of how you may create a token and construct a client.
See the [REST](https://shopify.dev/api/admin-rest/2022-07/resources/storefrontaccesstoken) or [GraphQL](https://shopify.dev/api/admin-graphql/2022-07/mutations/storefrontAccessTokenCreate) Admin API references for more information.

Once you've created your access token, you can query the Storefront API based on the `unauthenticated_*` scopes your app requests.
See the [API reference documentation](https://shopify.dev/api/storefront) for detailed instructions on each component.

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

  const adminApiClient = new shopify.clients.Rest({session});
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
  // You can fetch existing Storefront access tokens using the Admin API client.
  const storefrontClient = new shopify.clients.Storefront({
    domain: session.shop,
    storefrontAccessToken,
  });
});
```

### Parameters

Receives an object containing:

#### domain

`string` | :exclamation: required

The shop domain for the request.

#### storefrontAccessToken

`string` | :exclamation: required

The access token created using one of the Admin APIs.

## Query

Sends a request to the Storefront API.

### Examples

```ts
const products = await storefrontClient.query({
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

### Parameters

#### data

`{[key: string]: unknown} | string` | :exclamation: required

Either a string, or an object with a `query` and `variables`.

#### query

`{[key: string]: string | number}`

An optional query argument object to append to the request URL.

#### extraHeaders

`{[key: string]: string | number}`

Add custom headers to the request.

#### tries

`number` | Defaults to `1`, _must be >= 0_

The maximum number of times to retry the request.

### Return

`Promise<RequestResponse>`

Returns an object containing:

#### Headers

`{[key: string]: string | string[]}`

The HTTP headers in the response from Shopify.

#### Body

`any`

The HTTP body in the response from Shopify.
