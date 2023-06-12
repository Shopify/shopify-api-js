<<<<<<< HEAD
# shopify.clients.Rest

Instances of this class can make requests to the Shopify Admin REST API.

## Constructor

### Example

```ts
// Requests to /my-endpoint must be made with authenticatedFetch for embedded apps
app.get('/my-endpoint', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  const client = new shopify.clients.Rest({
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

## Get

Sends a GET request to the Admin API.

### Example

```ts
const getResponse = await client.get({
  path: 'products',
});
console.log(getResponse.headers, getResponse.body);
```

> **Note**: If using TypeScript, you can also pass in a type argument to cast the response body:
=======
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
>>>>>>> fad3ab98 (Add clients reference docs)

```ts
interface MyResponseBodyType {
  products: {
    /* ... */
  };
}

<<<<<<< HEAD
const response = await client.get<MyResponseBodyType>({
  path: 'products',
});

// response.body will be of type MyResponseBodyType
console.log(response.body.products);
```

### Parameters

#### path

`string` | :exclamation: required

The requested API endpoint path. This can be one of two formats:

- The path starting after the `/admin/api/{version}/` prefix, such as `'products'`, which executes `/admin/api/{version}/products.json`, where `{version}` is obtained from the library configuration (see [`shopifyApi`](../shopifyApi.md).
- The full path, such as `/admin/oauth/access_scopes.json`

#### query

`{[key: string]: string | number}`

An optional query argument object to append to the request URL.

#### extraHeaders

`{[key: string]: string | number}`

Add custom headers to the request.

#### type

`DataType` | Defaults to `DataType.JSON`

The `Content-Type` for the request (`JSON`, `GraphQL`, `URLEncoded`).

#### tries

`number` | Defaults to `1`, _must be >= 0_

The maximum number of times to retry the request.

### Return

`Promise<RequestResponse>`

Returns an object containing:

#### Headers

`{[key: string]: string | string[]}`

The HTTP headers in the response from Shopify.

#### Body

`any`

The HTTP body in the response from Shopify.

## Delete

Sends a DELETE request to the Admin API.

### Example

```ts
const deleteResponse = await client.delete({
  path: 'products/123456',
});
console.log(deleteResponse.headers, deleteResponse.body);
```

### Parameters

Takes the same parameters as the [`get`](#get) method.

### Return

`Promise<RequestResponse>`

Returns the same object as the [`get`](#get) method.

## Post

Sends a POST request to the Admin API.

### Example

```ts
const postResponse = await client.post({
=======
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
>>>>>>> fad3ab98 (Add clients reference docs)
  path: 'products',
  data: {
    title: 'My product title',
  },
});
<<<<<<< HEAD
console.log(postResponse.headers, postResponse.body);
```

### Parameters

Takes the same parameters as the [`get`](#get) method, with the addition of:

#### data

`{[key: string]: unknown} | string`

The request payload.

### Return

`Promise<RequestResponse>`

Returns the same object as the [`get`](#get) method.

## Put

Sends a PUT request to the Admin API.

### Example

```ts
const putResponse = await client.put({
  path: 'products/123456',
=======
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
>>>>>>> fad3ab98 (Add clients reference docs)
  data: {
    title: 'My product title',
  },
});
<<<<<<< HEAD
console.log(putResponse.headers, putResponse.body);
```

### Parameters

Takes the same parameters as the [`post`](#post) method.

### Return

`Promise<RequestResponse>`

Returns the same object as the [`get`](#get) method.

[Back to shopify.clients](./README.md)
=======
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
>>>>>>> fad3ab98 (Add clients reference docs)
