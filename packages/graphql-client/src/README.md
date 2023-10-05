# GraphQL Client

The GraphQL Client is a generic GraphQL client that can be used directly to interact with Storefront API. Client users are expected to provide the full API URL and necessary headers.

## Initialization

```typescript
import {createGraphQLClient} from '@shopify/storefront-api-client';

const client = createGraphQLClient({
  url: 'http://your-shop-name.myshopify.com/api/2023-04/graphql.json',
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
| config        | `GraphQLClientConfig`                                                                                                                                | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| fetch         | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<Response>`                                          | Fetches data from Storefront API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns the network response.                                                                                                                                                                                                         |
| request       | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<`[ClientResponse\<TData\>](#ClientResponsetdata)`>` | Fetches data from Storefront API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns a [normalized response object](#clientresponsetdata). <br /> This function cannot process GQL operations that will result in the server to return streamed, multipart responses.                                              |
| requestStream | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise <ClientStreamResponseIterator<TData>>`              | A function designed to fetch GQL operations that includes the `@defer` directive and will result in the Storefront API to streamed, multipart responses to the client. The function returns an async iterator and the iterator will return [normalized multipart response objects](#clientstreamresponseiteratorobjecttdata) as data becomes available through the stream. |

## `RequestOptions` properties

| Name       | Type                  | Description                                                      |
| ---------- | --------------------- | ---------------------------------------------------------------- |
| variables? | `Record<string, any>` | Variable values needed in the graphQL operation                  |
| url?       | `string`              | Althernative request API URL                                     |
| headers?   | `Headers`             | Additional and/or replacement headers to be used in the request. |

## `ClientResponse<TData>`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `TData \| any`        | Data returned from the Storefront API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                             |
| error?      | `ResponseError`       | Error object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `Record<string, any>` | Additional information on the GraphQL response data and context. It can include the `context` object that contains the localization context information used to generate the returned API response. |

## `ClientStreamResponseIteratorObject<TData>`

| Name        | Type                    | Description                                                                                                                                                                                         |
| ----------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `Partial<TData> \| any` | Currently available data returned from the Storefront API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                         |
| error?      | `ResponseError`         | Error object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `Record<string, any>`   | Additional information on the GraphQL response data and context. It can include the `context` object that contains the localization context information used to generate the returned API response. |
| hasNext     | `boolean`               | Flag to indicate whether the response stream has more incoming data                                                                                                                                 |

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

### Query for a product using the `@defer` directive

```typescript
const productQuery = `
  query ProductQuery($handle: String) {
    product(handle: $handle) {
      id
      handle
      ... @defer(label: "deferredFields") {
        title
        description
      }
    }
  }
`;

const responseStream = await client.requestStream(productQuery, {
  variables: {handle: 'sample-product'},
});

// await available data from the async iterator
for await (const response of responseStream) {
  const {data, error, extensions, hasNext} = response;
}
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

### Provide GQL query type to `client.request()` and `client.requestStream()`

```typescript
import {print} from 'graphql/language';

// GQL operation types are usually auto generated during the application build
import {CollectionQuery, CollectionDeferredQuery} from 'types/appTypes';
import collectionQuery from './collectionQuery.graphql';
import collectionDeferredQuery from './collectionDeferredQuery.graphql';

const {data, error, extensions} = await client.request<CollectionQuery>(
  print(collectionQuery),
  {
    variables: {
      handle: 'sample-collection',
    },
  }
);

const responseStream = await client.requestStream<CollectionDeferredQuery>(
  print(collectionDeferredQuery),
  {
    variables: {handle: 'sample-collection'},
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
