# Using REST resources

To call the Admin REST API, you can use the [REST client](../reference/clients/Rest.md) to send manually crafted requests to Shopify.

The Admin API has a lot of endpoints, and the differences between them can be subtle.
To make it easier to interact with the API, this library provides resource classes, which map these endpoints to OO code and can make API queries feel more natural.

> **Note**: we provide auto-generated resources for all **_stable_** API versions, so your app must include the appropriate set (see [mounting REST resources](#mounting-rest-resources) below), matching your `apiVersion` configuration. The library will throw an error if the versions don't match.

Below is an example of how REST resources can make it easier to fetch the first product and update it:

<div>With a plain REST client:

```ts
// App must provide response types
interface ProductResponse {
  product: {
    id: number;
    title: string;
    // ...
  };
}

const sessionId = await shopify.session.getCurrentId({
  rawRequest: req,
  rawResponse: res,
});

// use sessionId to retrieve session from app's session storage
// getSessionFromStorage() must be provided by application
const session = await getSessionFromStorage(sessionId);

const client = new shopify.clients.Rest({
  domain: session.shop,
  accessToken: session.accessToken,
});

// The following line sends a HTTP GET request to this constructed URL:
// https://${session.shop}/admin/api/${shopify.config.api_version}/products.json?limit=1
const response = await client.get<ProductResponse>({
  path: 'products',
  query: {limit: 1},
});

// Apps needs to dig into the response body to find the object
response.body.product.title = 'A new title';

// The following sends a HTTP PUT request to this constructed URL...
// https://${session.shop}/admin/api/${shopify.config.api_version}/products/${response.body.product.id}.json
// ... with this body
// {"product":{"id":response.body.product.id,"title":"A new title"}}
await client.put({
  path: `products/${response.body.product.id}`,
  data: response.body.product,
});
```

</div><div>With REST resources:

```ts
const sessionId = await shopify.session.getCurrentId({
  rawRequest: req,
  rawResponse: res,
});

// use sessionId to retrieve session from app's session storage
// getSessionFromStorage() must be provided by application
const session = await getSessionFromStorage(sessionId);

// Has type Product[], an OO representation of API products
const products = await shopify.rest.Product.all({session, limit: 1});

products[0].title = 'A new title';
await products[0].save();
```

</div>

The resource classes provide representations of all endpoints for the API resource they cover. A few examples:

1. `GET /products.json` maps to `Product.all()`
1. `POST /products.json` maps to `product.save()` (as an instance method)
1. `GET /products/count.json` maps to `Product.count()`

Please visit our [REST API reference documentation](https://shopify.dev/api/admin-rest) for detailed instructions on how to call each of the endpoints.

## Mounting REST resources

The library doesn't include all available resources automatically to make loading it more efficient, since there are hundreds of resource classes.
To use REST resources, you can import the desired version and mount it onto your `shopify` object when creating it:

```ts
import {shopifyApi} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';

const shopify = shopifyApi({
  ...,
  apiVersion: ApiVersion.July22,
  restResources,
});
```

This will automatically load all REST resources onto `shopify.rest`, as per the example above.
From this point, you can start using the resources to interact with the API.

[Back to guide index](../../README.md#features)
