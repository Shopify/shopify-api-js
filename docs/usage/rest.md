# Make a REST API call

Once OAuth is complete, we can use the library's `RestClient` to make an API call. To do that, you can create an instance of `RestClient` using the current shop URL and session `accessToken` to make requests to the Admin API.

## Methods

The `RestClient` offers the 4 core request methods: `get`, `delete`, `post`, and `put`, . These methods each take in an associated `<method>RequestParams` object as their argument, each with a set of required and optional parameters. The tables below outline these params objects.

### Get and Delete:

- The `get` method accepts a `GetRequestParams` object, which accepts the following parameters: `path`, `type`, `data`, `query`, `extraHeaders`, and `tries`.
- The `delete` method accepts a `DeleteRequestParams` object, **which has an identical strucuture to `GetRequestParams`**.

**`GetRequestParams` / `DeleteRequestParams`:**
| Parameter | Type | Required? | Default Value | Notes |
| -------------- | ----------------------------------- | :-------: | :-----------: | ---------------------------------------------------------------------------------------- |
| `path` | `string` | True | none | The requested API endpoint path. This can be one of two formats:<ul><li>The path starting after the `/admin/api/{version}/` prefix, such as `'products'`, which executes `/admin/api/{version}/products.json`</li><li>The full path, such as `/admin/oauth/access_scopes.json`</li></ul> |
| `data` | `Record<string, unknown> \| string` | False | none | The body of the request |
| `type` | `DataType` | False | none | The type of data being sent in the body of the request (`JSON`, `GraphQL`, `URLEncoded`) |
| `query` | `Record<string, string \| number>` | False | none | An optional query object to be appended to the request |
| `extraHeaders` | `Record<string, string \| number>` | False | none | Any additional headers you want to send with your request |
| `tries` | `number` | False | `1` | The maximum number of times to retry the request _(must be >= 0)_ |

### Post and Put:

- The `post` method accepts a `PostRequestParams` object, which differs from `get` in that both the `type` and `data` parameters are required, in addition to the `path`.
- The `put` method accepts a `PutRequestParams` object, **which has an identical structure to `PostRequestParams`**.

**`PostRequestParams` / `PutRequestParams`:**
| Parameter | Type | Required? | Default Value | Notes |
| -------------- | ----------------------------------- | :-------: | :-----------: | ---------------------------------------------------------------------------------------- |
| `path` | `string` | True | none | The requested API endpoint path. This can be one of two formats:<ul><li>The path starting after the `/admin/api/{version}/` prefix, such as `'products'`, which executes `/admin/api/{version}/products.json`</li><li>The full path, such as `/admin/oauth/access_scopes.json`</li></ul> |
| `data` | `Record<string, unknown> \| string` | True | none | The body of the request |
| `type` | `DataType` | True | none | The type of data being sent in the body of the request (`JSON`, `GraphQL`, `URLEncoded`) |
| `query` | `Record<string, string \| number>` | False | none | An optional query object to be appended to the request |
| `extraHeaders` | `Record<string, string \| number>` | False | none | Any additional headers you want to send with your request |
| `tries` | `number` | False | `1` | The maximum number of times to retry the request _(must be >= 0)_ |

## Usage Examples:

We can run the code below in any endpoint where we have access to the request and response objects, optionally typing the body of the response.

### Perform a `GET` request:

```ts
// Example expected type for the response body
interface MyResponseBodyType {
  products: { ... }
}

// Load the current session to get the `accessToken`.
const session = await Shopify.Utils.loadCurrentSession(req, res);
// Create a new client for the specified shop.
const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
// Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
const response = await client.get<MyResponseBodyType>({
  path: 'products',
});

// response.body will be of type MyResponseBodyType
response.body.products...
```

### Perform a `POST` request:

```ts
// Load the current session to get the `accessToken`.
const session = await Shopify.Utils.loadCurrentSession(req, res);
// Create a new client for the specified shop.
const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
// Build your post request body.
const body = {
  ...
};
// Use `client.post` to send your request to the specified Shopify REST API endpoint.
await client.post({
  path: 'products',
  data: body,
  type: DataType.JSON,
});
```

**Note**: For more information on the `products` endpoint, check out our API reference guide [using a REST client](https://shopify.dev/api/admin-rest/unstable/resources/product) or [using REST resources](https://shopify.dev/api/admin-rest/latest/resources/product).

## Using REST resources

The Admin API has a lot of endpoints, and the differences between them can be subtle.
To make it easier to interact with the API, this library provides resource classes, which map these endpoints to OO code, to make it more natural to work with the API.

Below is an example of how REST resources can make it easier to fetch the first product and update it:

<div>With a plain REST client

```ts
// App must provide response types
interface ProductResponse {
  product: {
    id: number;
    title: string;
    ...
  }
}

const session = await shopify.session.getCurrent({
  rawRequest: req,
  rawResponse: res,
});
const client = new shopify.clients.Rest({
  domain: session.shop,
  accessToken: session.accessToken,
});
const response = await client.get<ProductResponse>({path: 'products', query: {limit: 1}});

// Apps needs to dig into the response body to find the object
response.body.product.title = 'A new title';
await client.put({
  path: `products/${response.body.product.id}`,
  data: response.body.product,
});
```

</div><div>With REST resources

```ts
const session = await shopify.session.getCurrent({
  rawRequest: req,
  rawResponse: res,
});

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

### Mounting REST resources

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

**Note**: we provide auto-generated resources for all **_stable_** API versions, so your app must include the appropriate set, matching your `apiVersion` configuration. The library will throw an Error if the versions mismatch.

[Back to guide index](../../README.md#features)
