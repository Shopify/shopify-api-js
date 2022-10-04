# clients.Rest

This class enables apps to query the REST Admin API.

## Example

```ts
const client = new shopify.clients.Rest({
  domain: session.shop,
  accessToken: session.accessToken,
});
```

## Methods

### get

Sends a GET request to the REST API.

#### Example

```ts
interface MyResponseBodyType {
  products: {
    /* ... */
  };
}

const {headers, body} = await client.get<MyResponseBodyType>({
  path: 'products',
});
```

> **Note**: passing in a type is not mandatory, but it prevents TypeScript apps having to manually cast the response.
> The `body` response field will have the given type.

#### Parameters

##### path

`string` | :exclamation: required

The requested API endpoint path. This can be one of two formats:<ul><li>The path starting after the `/admin/api/{version}/` prefix, such as `'products'`, which executes `/admin/api/{version}/products.json`</li><li>The full path, such as `/admin/oauth/access_scopes.json`</li></ul>

##### query

`{[key: string]: string | number}`

An optional query argument object to append to the request URL

##### extraHeaders

`{[key: string]: string | number}`

Add custom headers to the request

##### type

`DataType` | Defaults to `DataType.JSON`

The `Content-Type` for the request (`JSON`, `GraphQL`, `URLEncoded`)

##### tries

`number` | Defaults to `1`

The maximum number of times to retry the request _(must be >= 0)_

#### Return

##### body

`unknown`

The response body sent by Shopify. If given a type, this object will have that type.

##### headers

`{[key: string]: string | string[]}`

The response headers sent by Shopify.

```ts
const response = await client.post({
  path: 'products',
  data: {
    title: 'My product title',
  },
});
console.log(response.headers, response.body);
```

### delete

Sends a DELETE request to the REST API.

#### Example

```ts
const {headers, body} = await client.delete({
  path: 'products/1234',
});
```

#### Parameters

Accepts all the parameters that [get](#get) does.

#### Return

Returns the same object as [get](#get).

### post

Sends a POST request to the REST API.

#### Example

```ts
const {body, headers} = await client.post({
  path: 'products',
  data: {
    title: 'My product title',
  },
});
```

#### Parameters

Accepts all the parameters that [get](#get) does.

##### data

`{[key: string]: unknown} | string` | :exclamation: required

The request payload.

#### Return

Returns the same object as [get](#get).

### put

Sends a PUT request to the REST API.

#### Example

```ts
const {body, headers} = await client.put({
  path: 'products/1234',
  data: {
    title: 'My product title',
  },
});
```

#### Parameters

Accepts all the parameters that [post](#post) does.

#### Return

Returns the same object as [post](#post).

[Back to index](./README.md)
