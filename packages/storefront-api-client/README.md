# Storefront API Client

The Storefront API Client manages the API's authentication information and provides various methods that enables devs to interacts with the API.

## Initialization

### Public access token client initialization

```typescript
import {createStorefrontApiClient} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'http://your-shop-name.myshopify.com',
  apiVersion: '2023-10',
  publicAccessToken: 'your-storefront-public-access-token',
});
```

### Create a server enabled client using a private access token and a custom Fetch API

> [!WARNING]
> Private Storefront API delegate access tokens should only be used in server-to-server implementations and not within a browser environment.

In order to use the client within a server, a server enabled JS Fetch API will need to be provided to the client at initialization.

```typescript
import {createStorefrontApiClient, CustomFetchApi} from '@shopify/storefront-api-client';
import {fetch as nodeFetch} from 'node-fetch';

const client = createStorefrontApiClient({
  storeDomain: 'http://your-shop-name.myshopify.com',
  apiVersion: '2023-10',
  privateAccessToken: 'your-storefront-private-access-token',
  customFetchApi: nodeFetch,
});
```

### `createStorefrontApiClient()` parameters

| Property            | Type             | Description                                                                                                                                                                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storeDomain         | `string`         | The domain of the store. It can be the Shopify `myshopify.com` domain or a custom store domain.                                                                                                                                                      |
| apiVersion          | `string`         | The requested Storefront API version                                                                                                                                                                                                                 |
| publicAccessToken?  | `string`         | Storefront API public access token. Either `publicAccessToken` or `privateAccessToken` must be provided at initialization.                                                                                                                           |
| privateAccessToken? | `string`         | Storefront API private access token. Either `publicAccessToken` or `privateAccessToken` must be provided at initialization. <br />**Important:** Storefront API private delegate access tokens should only be used in a `server-to-server` implementation. |
| clientName?         | `string`         | Name of the client |
| retries?  | `number` | The number of HTTP request retries if the request was abandoned or the server responded with a `Too Many Requests (429)` or `Service Unavailable (503)` response. Default value is `0`. Maximum value is `3`. |
| customFetchAPI?  | `(url: string, init?: {method?: string, headers?: HeaderInit, body?: string}) => Promise<Response>` | A replacement `fetch` function that will be used in all client network requests. By default, the client uses `window.fetch()`. |
| logger?  | `(logContent: `[UnsupportedApiVersionLog](#unsupportedapiversionlog) ` \| `[HTTPResponseLog](#httpresponselog)`\|`[HTTPRetryLog](#httpretrylog)`) => void` | A logger function that accepts [log content objects](#log-content-types). This logger will be called in certain conditions with contextual information.  |


## Client properties

| Property      | Type                                                                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config        | [StorefrontApiClientConfig](#storefrontapiclientconfig-properties)                                                                                                                                                             | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| getHeaders    | `(customHeaders?: {[key: string]: string}) => {[key: string]: string}`                                                                                                       | Returns Storefront API specific headers needed to interact with the API. If `customHeaders` is provided, the custom headers will be included in the returned headers object.                                                                                                                                                                                               |
| getApiUrl     | `(apiVersion?: string) => string`                                                                                                                                          | Returns the shop specific API url. If an API version is provided, the returned URL will include the provided version, else the URL will include the API version set at client initialization.                                                                                                                                                                              |
| fetch         | `<TData>(operation: string, options?: `[ApiClientRequestOptions](#apiclientrequestoptions-properties)`) => Promise<Response>`                                          | Fetches data from Storefront API using the provided GQL `operation` string and [ApiClientRequestOptions](#apiclientrequestoptions-properties) object and returns the network response.                                                                                                                                                                                 |
| request       | `<TData>(operation: string, options?: `[ApiClientRequestOptions](#apiclientrequestoptions-properties)`) => Promise<`[ClientResponse\<TData\>](#ClientResponsetdata)`>` | Requests data from Storefront API using the provided GQL `operation` string and [ApiClientRequestOptions](#apiclientrequestoptions-properties) object and returns a normalized response object.                                                                                                                                                                        |


## `StorefrontApiClientConfig` properties

| Name           | Type                     | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| storeDomain     | `string`    | The secure store domain      |
| apiVersion    | `string`                 | The Storefront API version to use in the API request |
| publicAccessToken | `string \| never` | The provided public access token. If `privateAccessToken` was provided, `publicAccessToken` will not be available. |
| privateAccessToken | `string \| never` | The provided private access token. If `publicAccessToken` was provided, `privateAccessToken` will not be available. |
| headers | `{[key: string]: string}` | The headers generated by the client during initialization |
| apiUrl | `string` | The API URL generated from the provided store domain and api version |
| clientName? | `string` | The provided client name |
| retries? | `number` | The number of retries the client will attempt when the API responds with a `Too Many Requests (429)` or `Service Unavailable (503)` response |


## `ApiClientRequestOptions` properties

| Name           | Type                     | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| variables?     | `Record<string, any>`    | Variable values needed in the graphQL operation      |
| apiVersion?    | `string`                 | The Storefront API version to use in the API request |
| customHeaders? | `Record<string, string>` | Customized headers to be included in the API request |
| retries?   | `number`             | Alternative number of retries for the request. Retries only occur for requests that were abandoned or if the server responds with a `Too Many Request (429)` or `Service Unavailable (503)` response. Minimum value is `0` and maximum value is `3`.|

## `ClientResponse<TData>`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `TData \| any`        | Data returned from the Storefront API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                             |
| errors?      | [ResponseErrors](#responseerrors)       | Errors object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `{[key: string]: any}` | Additional information on the GraphQL response data and context. It can include the `context` object that contains the context settings used to generate the returned API response. |

## `ResponseErrors`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| networkStatusCode?       | `number`        | HTTP response status code                                                             |
| message?      | `string`       | The provided error message                                                       |
| graphQLErrors? | `any[]` | The GraphQL API errors returned by the server |

### Client `request()` response examples

<details>
  <summary>Successful response</summary>

### API response

```json
{
  "data": {
    "product": {
      "id": "gid://shopify/Product/12345678912",
      "title": "Sample product # 1"
    }
  },
  "extensions": {
    "context": {
      "country": "US",
      "language": "EN"
    }
  }
}
```

</details>

<details>
  <summary>Error responses</summary>

### Network error

```json
{
  "errors": {
    "networkStatusCode": 401,
    "message": ""
  }
}
```

### Storefront API graphQL error

```json
{
  "errors": {
    "networkStatusCode": 200,
    "message": "An error occurred while fetching from the API. Review the `graphQLErrors` object for details.",
    "graphQLErrors": [
      {
        "message": "Field 'testField' doesn't exist on type 'Product'",
        "locations": [
          {
            "line": 17,
            "column": 3
          }
        ],
        "path": ["fragment ProductFragment", "testField"],
        "extensions": {
          "code": "undefinedField",
          "typeName": "Product",
          "fieldName": "testField"
        }
      }
    ]
  }
}
```

</details>

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

### Create a localized cart

```typescript
const cartCreateMutation = `
  mutation ($input: CartInput!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      userErrors {
        message
        code
        field
      }
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

const {data, errors, extensions} = await client.request(cartCreateMutation, {
  variables: {
    input: {},
    country: 'JP',
    language: 'JA',
  },
});
```

### Query for shop information

```typescript
const shopQuery = `
  query shop {
    shop {
      name
      id
    }
  }
`;

const {data, errors, extensions} = await client.request(shopQuery);
```

### Dynamically set the Storefront API version per request

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
  apiVersion: '2023-07',
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

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    handle: 'sample-product',
  },
  customHeaders: {
    'Shopify-Storefront-Id': 'shop-id',
  },
});
```

### Dynamically set the number of retries per request

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
  retries: 2,
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

## Log Content Types

### `UnsupportedApiVersionLog`

This log content is sent to the logger whenever an unsupported API version is provided to the client.

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| type      | `LogType['UNSUPPORTED_API_VERSION']`                 | The type of log content. Is always set to `UNSUPPORTED_API_VERSION`            |
| content  | `{apiVersion: string, supportedApiVersions: string[]}` | Contextual info including the provided API version and the list of currently supported API versions. |

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
