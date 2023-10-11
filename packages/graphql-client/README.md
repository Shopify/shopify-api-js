# GraphQL Client

The GraphQL Client is a generic GraphQL client that can be used directly to interact with a GraphQL API. Client users are expected to provide the full API URL and necessary headers.

## Initialization

```typescript
import {createGraphQLClient} from '@shopify/graphql-client';

const client = createGraphQLClient({
  url: 'http://your-shop-name.myshopify.com/api/2023-10/graphql.json',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'public-token',
  },
});
```

### `createGraphQLClient()` parameters

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| url      | `string`                 | The Storefront API URL             |
| headers  | `Record<string, string>` | Headers to be included in requests |

## Client properties

| Property      | Type                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config        | `ClientConfig`                                                                                                                                | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| fetch         | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<Response>`                                          | Fetches data from the GraphQL API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns the network response.                                                                                                                                                                                                         |
| request       | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<`[ClientResponse\<TData\>](#ClientResponsetdata)`>` | Fetches data from the GraphQL API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns a [normalized response object](#clientresponsetdata).                                            |

## `RequestOptions` properties

| Name       | Type                  | Description                                                      |
| ---------- | --------------------- | ---------------------------------------------------------------- |
| variables? | `Record<string, any>` | Variable values needed in the graphQL operation                  |
| url?       | `string`              | Althernative request API URL                                     |
| headers?   | `Headers`             | Additional and/or replacement headers to be used in the request. |

## `ClientResponse<TData>`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `TData \| any`        | Data returned from the GraphQL API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                             |
| error?      | `ResponseError`       | Error object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `Record<string, any>` | Additional information on the GraphQL response data and context. It can include the `context` object that contains the localization context information used to generate the returned API response. |


## Usage examples

### Query for a product

```typescript
const productQuery = `
  query ProductQuery($handle: String) {
    product(handle: $handle) {
      id
      title
      handle
    }
  }
`;

const {data, error, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
});
```

### Add custom headers to API request

```typescript
const productQuery = `
  query ProductQuery($handle: String) {
    product(handle: $handle) {
      id
      title
      handle
    }
  }
`;

const {data, error, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
  headers: {
    'Shopify-Storefront-Id': 'shop-id',
  },
});
```

### Use an updated API URL in API request

```typescript
const productQuery = `
  query ProductQuery($handle: String) {
    product(handle: $handle) {
      id
      title
      handle
    }
  }
`;

const {data, error, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
  url: 'http://your-shop-name.myshopify.com/api/unstable/graphql.json',
});
```

### Provide GQL query type to `client.request()`

```typescript
import {print} from 'graphql/language';

// GQL operation types are usually auto generated during the application build
import {CollectionQuery} from 'types/appTypes';
import collectionQuery from './collectionQuery.graphql';

const {data, error, extensions} = await client.request<CollectionQuery>(
  print(collectionQuery),
  {
    variables: {
      handle: 'sample-collection',
    },
  }
);
```

### Using `client.fetch()` to get API data

```typescript
const shopQuery = `
  query shop {
    shop {
      name
      id
    }
  }
`;

const response = await client.fetch(shopQuery);

if (response.ok) {
  const {errors, data, extensions} = await response.json();
}
```
