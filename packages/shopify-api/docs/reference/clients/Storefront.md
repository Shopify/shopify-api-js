# shopify.clients.Storefront

Instances of this class can make requests to the Shopify Storefront API.

> **Note**: ⚠️ This API limits request rates based on the IP address that calls it. This API uses a leaky bucket algorithm, with a default bucket size of 60 seconds of request processing time (minimum 0.5s per request), with a leak rate of 1/s. Learn more about [rate limits](https://shopify.dev/docs/api/usage/rate-limits).

## Requirements

You can authenticate with the Storefront API using either [public or private access tokens](https://shopify.dev/docs/api/storefront#authentication). This package always runs on an app's backend, so you should prefer private access tokens when making requests to the API.

If you are building a private app, you can set a default Storefront Access Token for all `Storefront` client instances by setting the `config.privateAppStorefrontAccessToken` property when calling [`shopifyApi`](../shopifyApi.md).

## Constructor

### Example

Below is an example of how you may construct this client, using the same `Session` object as the [Admin API client](./Graphql.md).

To query this API, your app will need to set the appropriate `unauthenticated_*` scopes when going through OAuth.
See the [API reference documentation](https://shopify.dev/docs/api/storefront) for detailed instructions on each component.

```ts
app.get('/my-endpoint', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by the application
  const session = await getSessionFromStorage(sessionId);

  const client = new shopify.clients.Storefront({
    session,
    apiVersion: ApiVersion.January23,
  });
});
```

### Parameters

Receives an object containing:

#### session

`Session` | :exclamation: required for non-Custom store apps

The session for the request.

#### apiVersion

`ApiVersion`

This will override the default API version.
Any requests made by this client will reach this version instead.

## Request

Sends a request to the Storefront API.

### Examples

```ts
const products = await storefrontClient.request(
  `{
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
);

// do something with the returned data
```

### Parameters

#### operation

`string` | :exclamation: required

The query or mutation string.

#### options.variables

`{[key: string]: any}`

The variables for the operation.

#### options.headers

`{[key: string]: string | number}`

Add custom headers to the request.

#### options.retries

`number` | _Must be between_ `0 and 3`

The maximum number of times to retry the request.

### Return

`Promise<ClientResponse>`

Returns an object containing:

#### Data

`any`

The `data` component of the response.

#### Extensions

`any`

The `extensions` component of the response.

[Back to shopify.clients](./README.md)
