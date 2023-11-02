# @shopify/admin-api-client

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../../LICENSE.md)

<!-- [![npm version](https://badge.fury.io/js/%40shopify%2Fadmin-api-client.svg)](https://badge.fury.io/js/%40shopify%2Fadmin-api-client) -->

The Admin API Client library is for developers who want to interact with Shopify's GraphQL `Admin API`. The features of this library are designed to be lightweight and minimally opinionated.

## Getting Started

To install this package, you can run this in your terminal:

```typescript
npm install @shopify/admin-api-client -s
```

## Admin API Client Examples

### Initialize the Admin API Client

```typescript
import {createAdminAPIClient} from '@shopify/admin-api-client';

const client = createAdminAPIClient({
  storeDomain: 'your-shop-name.myshopify.com',
  apiVersion: '2023-04',
  accessToken: 'your-admin-api-access-token',
});
```

### Query for a product using the client

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

const {data, error, extensions} = await client.request(operation, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
});
```

### `createAdminAPIClient()` parameters

| Property            | Type             | Description                                                                                                                                                                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| storeDomain         | `string`         | The domain of the store. It can be the Shopify `myshopify.com` domain or a custom store domain.                                                                                                                                                      |
| apiVersion          | `string`         | The requested Admin API version.                                                                                                                                                                                                                     |
| accessToken         | `string`         | Admin API access token.                                                                                                                                                                                                                              |
| clientName?         | `string`         | Name of the client.                                                                                                                                                                                                                                  |
| customFetchAPI?     | `CustomFetchAPI` | A custom fetch function that will be used by the client when it interacts with the API. Defaults to the [browser's Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                                                           |

## Client properties

| Property      | Type                                                                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config        | `ClientConfig`                                                                                                                                                             | Configuration for the client                                                                                                                                                                                                                                                                                                                                               |
| getHeaders    | `(customHeaders?: Record<string, string>) => Record<string, string>`                                                                                                       | Returns Admin API specific headers needed to interact with the API. If `customHeaders` is provided, the custom headers will be included in the returned headers object.                                                                                                                                                                                               |
| getApiUrl     | `(apiVersion?: string) => string`                                                                                                                                          | Returns the shop specific API url. If an API version is provided, the returned URL will include the provided version, else the URL will include the API version set at client initialization.                                                                                                                                                                              |
| fetch         | `<TData>(operation: string, options?:`[AdminAPIClientRequestOptions](#adminapiclientrequestoptions-properties)`) => Promise<Response>`                                          | Fetches data from Admin API using the provided GQL `operation` string and [AdminAPIClientRequestOptions](#adminapiclientrequestoptions-properties) object and returns the network response.                                                                                                                                                                                 |
| request       | `<TData>(operation: string, options?:`[AdminAPIClientRequestOptions](#adminapiclientrequestoptions-properties)`) => Promise<`[ClientResponse\<TData\>](#clientresponsetdata)`>` | Requests data from Admin API using the provided GQL `operation` string and [AdminAPIClientRequestOptions](#adminapiclientrequestoptions-properties) object and returns a normalized response object.                                                                                                                                                                        |

## `AdminAPIClientRequestOptions` properties

| Name           | Type                     | Description                                          |
| -------------- | ------------------------ | ---------------------------------------------------- |
| variables?     | `Record<string, any>`    | Variable values needed in the graphQL operation      |
| apiVersion?    | `string`                 | The Admin API version to use in the API request      |
| customHeaders? | `Record<string, string>` | Customized headers to be included in the API request |

## `ClientResponse<TData>`

| Name        | Type                      | Description                                                                                                                                                                                         |
| ----------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data?       | `TData \| any`            | Data returned from the Admin API. If `TData` was provided to the function, the return type is `TData`, else it returns type `any`.                                                                  |
| error?      | `ClientResponse['error']` | Error object that contains any API or network errors that occured while fetching the data from the API. It does not include any `UserErrors`.                                                       |
| extensions? | `Record<string, any>`     | Additional information on the GraphQL response data and context. It can include the `context` object that contains the localization context information used to generate the returned API response. |

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

const {data, error, extensions} = await client.request(productQuery, {
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

const {data, error, extensions} = await client.request(productQuery, {
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

const {data, error, extensions} = await client.request(productQuery, {
  variables: {
    id: 'gid://shopify/Product/7608002183224',
  },
  customHeaders: {
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
