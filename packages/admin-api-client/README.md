# Admin API Client

The Admin API Client library is for developers who want to interact with Shopify's GraphQL `Admin API`. The features of this library are designed to be lightweight and minimally opinionated.

## Getting Started

Install the package:

```
npm install @shopify/admin-api-client -s
```

Initialize the client:

```typescript
import {createAdminApiClient} from '@shopify/admin-api-client';

const client = createAdminApiClient({
  storeDomain: 'your-shop-name.myshopify.com',
  apiVersion: '2023-04',
  accessToken: 'your-admin-api-access-token',
});
```

Query for a product:

```typescript
const operation = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;

const {data, errors, extensions} = await client.request(operation, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
});
```

### `createAdminApiClient()` parameters

| Property            | Type             | Description                                                                                                                                                                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storeDomain         | `string`         | The `myshopify.com` domain |
| apiVersion          | `string`         | The requested Admin API version |
| accessToken         | `string`         | The Admin API access token |
| userAgentPrefix?    | `string`         | Any prefix you wish to include in the User-Agent for requests made by the library. |
| retries?            | `number`         | The number of HTTP request retries if the request was abandoned or the server responded with a `Too Many Requests (429)` or `Service Unavailable (503)` response. Default value is `0`. Maximum value is `3`. |
| customFetchAPI?     | `(url: string, init?: {method?: string, headers?: HeaderInit, body?: string}) => Promise<Response>` | A replacement `fetch` function that will be used in all client network requests. By default, the client uses `window.fetch()`. |
| logger?             | `(logContent:`[`UnsupportedApiVersionLog`](#unsupportedapiversionlog) ` \| `[`HTTPResponseLog`](#httpresponselog)`\|`[`HTTPRetryLog`](#httpretrylog)`) => void` | A logger function that accepts [log content objects](#log-content-types). This logger will be called in certain conditions with contextual information. |

## Client properties

| Property      | Type                                                                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config        | [`AdminApiClientConfig`](#adminapiclientconfig-properties)                                                                                                                                                             | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| getHeaders    | `(headers?: {[key: string]: string}) => {[key: string]: string`                                                                                                       | Returns Admin API specific headers needed to interact with the API. If additional `headers` are provided, the custom headers will be included in the returned headers object.                                                                                                                                                                                               |
| getApiUrl     | `(apiVersion?: string) => string`                                                                                                                                          | Returns the shop specific API url. If an API version is provided, the returned URL will include the provided version, else the URL will include the API version set at client initialization.                                                                                                                                                                              |
| fetch         | `(operation: string, options?:`[`AdminAPIClientRequestOptions`](#adminapiclientrequestoptions-properties)`) => Promise<Response>`                                          | Fetches data from Admin API using the provided GQL `operation` string and [`AdminAPIClientRequestOptions`](#adminapiclientrequestoptions-properties) object and returns the network response.                                                                                                                                                                                 |
| request       | `<TData>(operation: string, options?:`[`AdminAPIClientRequestOptions`](#adminapiclientrequestoptions-properties)`) => Promise<`[`ClientResponse<TData>`](#clientresponsetdata)`>` | Requests data from Admin API using the provided GQL `operation` string and [`AdminAPIClientRequestOptions`](#adminapiclientrequestoptions-properties) object and returns a normalized response object.                                                                                                                                                                        |

## `AdminApiClientConfig` properties

| Name           | Type                     | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| storeDomain     | `string`    | The `myshopify.com` domain      |
| apiVersion    | `string`                 | The Admin API version to use in the API request |
| accessToken | `string` | The provided public access token. If `privateAccessToken` was provided, `publicAccessToken` will not be available. |
| headers | `{[key: string]: string}` | The headers generated by the client during initialization |
| apiUrl | `string` | The API URL generated from the provided store domain and api version |
| retries? | `number` | The number of retries the client will attempt when the API responds with a `Too Many Requests (429)` or `Service Unavailable (503)` response |

## `ApiClientRequestOptions` properties

| Name           | Type                     | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| variables?     | `{[key: string]: any}`    | Variable values needed in the graphQL operation      |
| apiVersion?    | `string`                 | The Admin API version to use in the API request      |
| headers?       | `{[key: string]: string}`| Customized headers to be included in the API request |
| retries?       | `number`                 | Alternative number of retries for the request. Retries only occur for requests that were abandoned or if the server responds with a `Too Many Request (429)` or `Service Unavailable (503)` response. Minimum value is `0` and maximum value is `3`. |

## `ClientResponse<TData>`

| Name        | Type                      | Description                                                                                                                                                                                         |
| ----------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `Partial<TData> \| any`            | Data returned from the Admin API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                                  |
| errors?     | [`ResponseErrors`](#responseerrors) | Error object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `{[key: string]: any}`    | Additional information on the GraphQL response data and context. It can include the `context` object that contains the localization context information used to generate the returned API response. |

## `ResponseErrors`

| Name        | Type                  | Description                                                                                                                                                                                         |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| networkStatusCode?       | `number`        | HTTP response status code                                                             |
| message?      | `string`       | The provided error message                                                       |
| graphQLErrors? | `any[]` | The GraphQL API errors returned by the server |
| response? | `Response` | The raw response object from the network fetch call |

### Client `request()` response examples

<details>
  <summary>Successful response</summary>

### API response

```json
{
  "data": {
    "product": {
      "id": "gid://shopify/Product/7608002183224",
      "title": "Aera",
      "handle": "aera-helmet"
    }
    },
    "extensions": {
    "cost": {
      "requestedQueryCost": 1,
      "actualQueryCost": 1,
      "throttleStatus": {
      "maximumAvailable": 1000.0,
      "currentlyAvailable": 999,
      "restoreRate": 50.0
      }
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
  "networkStatusCode": 401,
  "message": "Unauthorized"
}
```

### Admin API graphQL error

```json
{
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
```

</details>

## Usage examples

### Query for a product

```typescript
const productQuery = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
});
```

### Dynamically set the Admin API version per data fetch

```typescript
const productQuery = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
  apiVersion: '2023-01',
});
```

### Add custom headers to API request

```typescript
const productQuery = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      handle
    }
  }
`;

const {data, errors, extensions} = await client.request(productQuery, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
  headers: {
    'X-GraphQL-Cost-Include-Fields': true,
  },
});
```

### Using `client.fetch()` to get API data

```typescript
const shopQuery = `
  query shop {
    shop {
      name
    }
  }
`;

const response = await client.fetch(shopQuery);

if (response.ok) {
  const {errors, data, extensions} = await response.json();
}
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

## Typing variables and return objects

This client is compatible with the `@shopify/api-codegen-preset` package.
You can use that package to create types from your operations with the [Codegen CLI](https://www.graphql-cli.com/codegen/).

There are different ways to [configure codegen](https://github.com/Shopify/shopify-api-js/tree/main/packages/api-codegen-preset#configuration) with it, but the simplest way is to:

1. Add the preset package as a dev dependency to your project, for example:
    ```bash
    npm install --save-dev @shopify/api-codegen-preset
    ```
1. Create a `.graphqlrc.ts` file in your root containing:
    ```ts
    import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";

    export default {
      schema: "https://shopify.dev/admin-graphql-direct-proxy",
      documents: ["*.ts", "!node_modules"],
      projects: {
        default: shopifyApiProject({
          apiType: ApiType.Admin,
          apiVersion: "2023-10",
          outputDir: "./types",
        }),
      },
    };
    ```
1. Add `"graphql-codegen": "graphql-codegen"` to your `scripts` section in `package.json`.
1. Tag your operations with `#graphql`, for example:
    ```ts
    const {data, errors, extensions} = await client.request(
      `#graphql
      query Shop {
        shop {
          name
        }
      }`
    );
    console.log(data?.shop.name);
    ```
1. Run `npm run graphql-codegen` to parse the types from your operations.

> [!NOTE]
> Remember to ensure that your tsconfig includes the files under `./types`!

Once the script runs, it'll create the file `./types/admin.generated.d.ts`.
When TS includes that file, it'll automatically cause the client to detect the types for each query.

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
| content  | `{`[`requestParams`](#requestparams)`: [url, init?], response: Response}` | Contextual data regarding the request and received response |

### `HTTPRetryLog`

This log content is sent to the logger whenever the client attempts to retry HTTP requests.

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| type      | `LogType['HTTP-Retry']`                 | The type of log content. Is always set to `HTTP-Retry`            |
| content  | `{`[`requestParams`](#requestparams)`: [url, init?], lastResponse?: Response, retryAttempt: number, maxRetries: number}` | Contextual data regarding the upcoming retry attempt. <br /><br/>`requestParams`: [parameters](#requestparams) used in the request<br/>`lastResponse`: previous response <br/> `retryAttempt`: the current retry attempt count <br/> `maxRetries`: the maximum number of retries  |

### `RequestParams`

| Property | Type                     | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| url      | `string`                 | Requested URL            |
| init?  | `{method?: string, headers?: HeaderInit, body?: string}` | The request information  |
