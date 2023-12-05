# GraphQL Client

The GraphQL Client can be used to interact with any Shopify's GraphQL APIs. Client users are expected to provide the full API URL and necessary headers.


## Getting Started

To install this package, you can run this in your terminal:

```typescript
npm install @shopify/graphql-client
```

## Client initialization

```typescript
import {createGraphQLClient} from '@shopify/graphql-client';

const client = createGraphQLClient({
  url: 'http://your-shop-name.myshopify.com/api/2023-10/graphql.json',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'public-token',
  },
  retries: 1
});
```

### `createGraphQLClient()` parameters

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| url      | `string`                 | The GraphQL API URL             |
| headers  | `{[key: string]: string}` | Headers to be included in requests |
| retries?  | `number` | The number of HTTP request retries if the request was abandoned or the server responded with a `Too Many Requests (429)` or `Service Unavailable (503)` response. Default value is `0`. Maximum value is `3`. |
| fetchApi?  | `(url: string, init?: {method?: string, headers?: HeaderInit, body?: string}) => Promise<Response>` | A replacement `fetch` function that will be used in all client network requests. By default, the client uses `window.fetch()`. |
| logger?  | `(logContent: `[HTTPResponseLog](#httpresponselog)`\|`[HTTPRetryLog](#httpretrylog)`) => void` | A logger function that accepts [log content objects](#log-content-types). This logger will be called in certain conditions with contextual information.  |

## Client properties

| Property      | Type                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config        | `{url: string, headers: {[key: string]: string}, retries: number}`                                                                                                                                | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| fetch         | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<Response>`                                          | Fetches data from the GraphQL API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns the network response                                                                                                                                                                                                         |
| request       | `<TData>(operation: string, options?: `[RequestOptions](#requestoptions-properties)`) => Promise<`[ClientResponse\<TData\>](#ClientResponsetdata)`>` | Fetches data from the GraphQL API using the provided GQL operation string and [RequestOptions](#requestoptions-properties) object and returns a [normalized response object](#clientresponsetdata)                                            |

## `RequestOptions` properties

| Name       | Type                  | Description                                                      |
| ---------- | --------------------- | ---------------------------------------------------------------- |
| variables? | `OperationVariables` | Variable values needed in the graphQL operation                  |
| url?       | `string`              | Alternative request API URL                                     |
| headers?   | `{[key: string]: string}`             | Additional and/or replacement headers to be used in the request |
| retries?   | `number`             | Alternative number of retries for the request. Retries only occur for requests that were abandoned or if the server responds with a `Too Many Request (429)` or `Service Unavailable (503)` response. Minimum value is `0` and maximum value is `3`.|

## `ClientResponse<TData>`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `TData \| any`        | Data returned from the GraphQL API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                             |
| errors?      | [ResponseErrors](#responseerrors)       | Errors object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `{[key: string]: any}` | Additional information on the GraphQL response data and context. It can include the `context` object that contains the context settings used to generate the returned API response. |

## `ResponseErrors`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| networkStatusCode?       | `number`        | HTTP response status code                                                             |
| message?      | `string`       | The provided error message                                                       |
| graphQLErrors? | `any[]` | The GraphQL API errors returned by the server |
| response? | `Response` | The raw response object from the network fetch call |


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

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
});
```

### Add additional custom headers to the API request

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

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
  headers: {
    'Shopify-Storefront-Id': 'shop-id',
  },
});
```

### Use an updated API URL in the API request

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

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
  url: 'http://your-shop-name.myshopify.com/api/unstable/graphql.json',
});
```

### Set a custom retries value in the API request

```typescript
const shopQuery = `
  query ShopQuery {
    shop {
      name
      id
    }
  }
`;

// Will retry the HTTP request to the server 2 times if the requests were abandoned or the server responded with a 429 or 503 error
const {data, errors, extensions} = await client.request(shopQuery, {
  retries: 2,
});
```

### Provide GQL query type to `client.request()`

```typescript
import {print} from 'graphql/language';

// GQL operation types are usually auto generated during the application build
import {CollectionQuery} from 'types/appTypes';
import collectionQuery from './collectionQuery.graphql';

const {data, errors, extensions} = await client.request<CollectionQuery>(
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

## Log Content Types

### `HTTPResponseLog`

This log content is sent to the logger whenever a HTTP response is received by the client.

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| type      | `LogType['HTTP-Response']`                 | The type of log content. Is always set to `HTTP-Response`            |
| content  | `{`[requestParams](#requestparams)`: [url, init?], response: Response}` | Contextual data regarding the request and received response |

### `HTTPRetryLog`

This log content is sent to the logger whenever the client attempts to retry HTTP requests.

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| type      | `LogType['HTTP-Retry']`                 | The type of log content. Is always set to `HTTP-Retry`            |
| content  | `{`[requestParams](#requestparams)`: [url, init?], lastResponse?: Response, retryAttempt: number, maxRetries: number}` | Contextual data regarding the upcoming retry attempt. <br /><br/>`requestParams`: [parameters](#requestparams) used in the request<br/>`lastResponse`: previous response <br/> `retryAttempt`: the current retry attempt count <br/> `maxRetries`: the maximum number of retries  |

### `RequestParams`

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| url      | `string`                 | Requested URL            |
| init?  | `{method?: string, headers?: HeaderInit, body?: string}` | The request information  |
