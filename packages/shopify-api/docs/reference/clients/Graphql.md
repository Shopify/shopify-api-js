# shopify.clients.Graphql

Instances of this class can make requests to the Shopify Admin GraphQL API.

> **Note**: You can use the [Shopify Admin API GraphiQL explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api) to help build your queries.

## Constructor

### Example

```ts
// Requests to /my-endpoint must be made with authenticatedFetch from App Bridge for embedded apps
app.get('/my-endpoint', async () => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  const client = new shopify.clients.Graphql({
    session,
    apiVersion: ApiVersion.January23,
  });
});
```

### Parameters

Receives an object containing:

#### session

`Session` | :exclamation: required

The Shopify Session containing an access token to the API.

#### apiVersion

`ApiVersion`

This will override the default API version.
Any requests made by this client will reach this version instead.

## Request

Sends a request to the Admin API.

### Examples

#### Using a query string

```ts
const response = await client.request(
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
console.log(response.data, response.extensions);
```

#### Using variables

```ts
const response = await client.request(
  `query GetProducts($first: Int!) {
    products (first: $first) {
      edges {
        node {
          id
          title
          descriptionHtml
        }
      }
    }
  }`,
  {
    variables: {
      first: 10,
    },
  },
);
console.log(response.data, response.extensions);
```

> **Note**: If using TypeScript, you can pass in a type argument for the response body:

```ts
// If using TypeScript, you can type the response body
interface MyResponseBodyType {
  data: {
    //...
  };
}

const response = await client.request<MyResponseBodyType>(/* ... */);

// response.body will be of type MyResponseBodyType
console.log(response.body.data);
```

> **Note**: If there are any errors in the response, `request` will throw a `GraphqlQueryError` which includes details from the API response:

```ts
import {GraphqlQueryError} from '@shopify/shopify-api';

try {
  const products = await client.request(/* ... */);

  // No errors, proceed with logic
} catch (error) {
  if (error instanceof GraphqlQueryError) {
    // look at error.response for details returned from API,
    // specifically, error.response.errors[0].message
    // Also, error.headers contains the headers of the response received from Shopify
  } else {
    // handle other errors
  }
}
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

The [`data` component](https://shopify.dev/docs/api/admin/getting-started#graphql-admin-api) of the response.

#### Extensions

`any`

The [`extensions` component](https://shopify.dev/docs/api/admin-graphql#rate_limits) of the response.

[Back to shopify.clients](./README.md)
