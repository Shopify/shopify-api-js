# GraphQL Admin API client

Once OAuth is complete, we can use this library to interact with the Admin GraphQL API.
To do that, create an instance of `shopify.clients.Graphql` using the current shop URL and session `accessToken` in your app's endpoint.

To create a client, you'll need a session, for example:

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
    session
  });
});
```

Once you construct a client, you can use the `query` method to run GraphQL queries or mutations on the API.

<div>Using a string:

```ts
const response = await client.query({
  data: `{
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
});
console.log(response.headers, response.body);
```

</div><div>Or using variables:

```ts
const response = await client.query({
  data: {
    query: `query GetProducts($first: Int!) {
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
    variables: {
      first: 10,
    },
  },
});
console.log(response.headers, response.body);
```

</div>

**Note**: we recommend using the [Shopify Admin API GraphiQL explorer](https://shopify.dev/apps/tools/graphiql-admin-api) to help build your queries.

If you're using TypeScript, you can pass in a type argument for the response body:

```ts
// If using TypeScript, you can type the response body
interface MyResponseBodyType {
  data: {
    //...
  };
}

const response = await client.query<MyResponseBodyType>({
  /* ... */
});

// response.body will be of type MyResponseBodyType
console.log(response.body.data);
```

The `query` method accepts the following arguments:

| Parameter      | Type                                | Required? | Default Value | Notes                                                             |
| -------------- | ----------------------------------- | :-------: | :-----------: | ----------------------------------------------------------------- |
| `data`         | `Record<string, unknown> \| string` |    Yes    |       -       | Either a string, or an object with a `query` and `variables`      |
| `query`        | `Record<string, string \| number>`  |    No     |       -       | An optional query argument object to append to the request URL    |
| `extraHeaders` | `Record<string, string \| number>`  |    No     |       -       | Add custom headers to your request                                |
| `tries`        | `number`                            |    No     |      `1`      | The maximum number of times to retry the request _(must be >= 0)_ |

It will return an object containing the response `headers` and `body` from Shopify.
If there are any errors in the response, `query` will throw a `GraphqlQueryError` which includes details from the API response:

```ts
import {GraphqlQueryError} from '@shopify/shopify-api';

try {
  const products = await client.query({
    data: `{
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
  });

  // No errors, proceed with logic
} catch (error) {
  if (error instanceof GraphqlQueryError) {
    // look at error.response for details returned from API,
    // specifically, error.response.errors[0].message
  } else {
    // handle other errors
  }
}
```

[Back to guide index](../../README.md#features)
