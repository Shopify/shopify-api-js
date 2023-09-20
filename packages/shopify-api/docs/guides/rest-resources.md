# Using REST resources

To call the Admin REST API, you can use the [REST client](../reference/clients/Rest.md) to send manually crafted requests to Shopify.

The Admin API has a lot of endpoints, and the differences between them can be subtle.
To make it easier to interact with the API, this library provides resource classes, which map these endpoints to OO code and can make API queries feel more natural.

> **Note**: we provide auto-generated resources for all **_stable_** API versions.
> If your app is using `unstable` or a Release Candidate, you can still import REST resources (see [mounting REST resources](#mounting-rest-resources) below) for other versions, but we'll log a warning to remind you to update when you're ready.

## Resource Methods

| Resource Method | Description | Admin API endpoint | Return |
| --------------- | ----------- | ------------------ | ------ |
| `find` | Fetch a single resource by its ID | `GET /admin/api/{version}/{resource_name}/{resource_id}.json` | A single resource |
| `all` | Fetch all resources of a given type | `GET /admin/api/{version}/{resource_name}.json` | [An array of resources](#all-return-value) |
| `count` | Fetch the number of resources of a given type | `GET /admin/api/{version}/{resource_name}/count.json` | Integer |
| `save` | If the primary key for the resource **is not set**, a new resource will be created in Shopify | `POST /admin/api/{version}/{resource_name}.json` | void Promise (If option update: true is passed, the resource will be updated with the returned data.) |
| `save` | If the primary key for a resource **is set** the resource in Shopify will be updated  | `PUT /admin/api/{version}/{resource_name}/{resource_id}.json` | Promise void (If option update: true is passed, the resource will be updated with the returned data.) |
| `delete` | Delete an existing resource | `DELETE /admin/api/{version}/{resource_name}/{resource_id}.json` | void Promise |

Some resources will have additional methods to help with common interactions, such as the [orders method on the customer resource](https://shopify.dev/docs/api/admin-rest/2023-07/resources/customer#get-customers-customer-id-orders). Review the [REST API reference](https://shopify.dev/docs/api/admin-rest) documentation for more information.

### All Return Value
The all method will return an array of resources, along with the response headers and pagination information.

```
FindAllResponse<T = Base> {
    data: T[];
    headers: Headers;
    pageInfo?: PageInfo;
}
```

Please visit our [REST API reference documentation](https://shopify.dev/docs/api/admin-rest) for detailed instructions on how to call each of the endpoints.

## Example Usage

Below is an example of how REST resources can make it easier to fetch the first product and update it:

### Update a Resource

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

const client = new shopify.clients.Rest({session});

// The following line sends a HTTP GET request to this constructed URL:
// https://${session.shop}/admin/api/${shopify.config.api_version}/products/7504536535062.json
const response = await client.get<ProductResponse>({
  path: 'products/7504536535062',
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

// get a single product via its product id
const product = await shopify.rest.Product.find({session, id: '7504536535062'});

product.title = 'A new title';

// After promise resolves, the product will be updated with the returned data
await product.save({
  update: true,
});
```

</div>

### Create a resource

```ts

const product = new shopify.rest.Product({session: session});
product.title = "Burton Custom Freestyle 151";
product.body_html = "<strong>Good snowboard!</strong>";
product.vendor = "Burton";
product.product_type = "Snowboard";
product.status = "draft";

// After promise resolves, product will be updated with the returned data
await product.save({
  update: true,
});
```

### Get a resource

```ts
// Session is built by the OAuth process

const product = await shopify.rest.Product.find({
  session: session,
  id: 632910392,
});

console.log(product);
```

### Get all resources

```ts
// Session is built by the OAuth process

const products = await shopify.rest.Product.all({
  session: session,
});

// The list of products
console.log(products.data);

// The pagination information
console.log(products.pageInfo);

// The response headers
console.log(products.headers);

```

## Mounting REST resources

The library doesn't include all available resources automatically to make loading it more efficient, since there are hundreds of resource classes.
To use REST resources, you can import the desired version and mount it onto your `shopify` object when creating it:

```ts
import {shopifyApi} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-10';

const shopify = shopifyApi({
  ...,
  apiVersion: ApiVersion.October22,
  restResources,
});
```

This will automatically load all REST resources onto `shopify.rest`, as per the example above.
From this point, you can start using the resources to interact with the API.

## Paginated requests

Shopify's REST API supports [cursor-based pagination](https://shopify.dev/docs/api/usage/pagination-rest), to limit the amount of data sent to an app on a single request.

Each request will return the information required for an app to request the previous / next set of items.
For REST resources, calls to the `all` method will return the information necessary to make those requests in the `pageInfo` property.

Here is an example for fetching more than one set of products from the API:

```ts
let pageInfo;
do {
  const response = await shopify.rest.Product.all({
    ...pageInfo?.nextPage?.query,
    session,
    limit: 10,
  });

  const pageProducts = response.data;
  // ... use pageProducts

  pageInfo = response.pageInfo;
} while (pageInfo?.nextPage);
```

[Back to guide index](../../README.md#guides)
