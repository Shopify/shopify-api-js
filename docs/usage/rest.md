# Make a REST API call

Once OAuth is complete, we can use the library's `RestClient` to make an API call. To do that, you can create an instance of `RestClient` using the current shop URL and session `accessToken` to make requests to the Admin API.

## Methods

The `RestClient` offers the 4 core request methods: `get`, `delete`, `post`, and `put`, . These methods each take in an associated `<method>RequestParams` object as their argument, each with a set of required and optional parameters. The tables below outline these params objects.

**Get and Delete:**

- The `get` method accepts a `GetRequestParams` object, which accepts the following parameters: `path`, `type`, `data`, `query`, `extraHeaders`, and `tries`.

- **`GetRequestParams`:**
  | Parameter | Type | Notes | Required? | Default Value |
  | -------------- | ----------------------------------- | ------------------------------------------------------------------------------------- | :---------: | :-------------: |
  | `path` | `string` |The requested API endpoint path | True | none |
  | `data` | `Record<string, unknown> \| string` | The body of the request | False | none |
  | `type` | `DataType` | The type of data being sent in the body of the request (`JSON`, `GraphQL`, `URLEncoded`) | False | none |
  | `query` | `Record<string, string \| number>` | An optional query object to be appended to the request | False | none |
  | `extraHeaders` | `Record<string, string \| number>` | Any additional headers you want to send with your request | False | none |
  | `tries` | `number` | The maximum number of times to retry the request _(must be >= 0)_ | False | `1` |
- The `delete` method accepts a `DeleteRequestParams` object, **which has an identical strucuture to `GetRequestParams`**.

**Post and Put:**

- The `post` method accepts a `PostRequestParams` object, which differs from `get` in that both the `type` and `data` parameters are required, in addition to the `path`.

- **`PostRequestParams`:**
  | Parameter | Type | Notes | Required? | Default Value |
  | -------------- | ----------------------------------- | ------------------------------------------------------------------------------------- | :---------: | :-------------: |
  | `path` | `string` |The requested API endpoint path | True | none |
  | `data` | `Record<string, unknown> \| string` | The body of the request | True | none |
  | `type` | `DataType` | The type of data being sent in the body of the request (`JSON`, `GraphQL`, `URLEncoded`) | True | none |
  | `query` | `Record<string, string \| number>` | An optional query object to be appended to the request | False | none |
  | `extraHeaders` | `Record<string, string \| number>` | Any additional headers you want to send with your request | False | none |
  | `tries` | `number` | The maximum number of times to retry the request _(must be >= 0)_ | False | `1` |

- The `put` method accepts a `PutRequestParams` object, **which has an identical structure to `PostRequestParams`**.

## Usage Examples:

You can run the code below in any endpoint where you have access to a request and response objects.

**Perform a `get` request:**

```ts
const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
const client = new Shopify.Clients.Rest(session.shop, session.accessToken); // create a new client for the specified shop
const products = await client.get({
  // use client.get to request the REST endpoint you need, in this case "products"
  path: 'products',
});

// do something with the returned data
```

**Perform a `post` request:**

```ts
const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
const client = new Shopify.Clients.Rest(session.shop, session.accessToken); // create a new client for the specified shop
const body = {
  // post request body for a new product
};
await client.post({
  path: 'products',
  data: body,
});
```

[Back to guide index](../index.md)
