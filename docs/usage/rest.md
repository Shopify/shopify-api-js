# Make a REST API call

Once OAuth is complete, we can use the library's `RestClient` to make an API call. To do that, you can create an instance of `RestClient` using the current shop URL and session `accessToken` to make requests to the Admin API.

You can run the code below in any endpoint where you have access to a request and response objects.

```ts
  const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken); // create a new client for the specified shop
  const products = await client.get({ // use client.get to request the REST endpoint you need, in this case "products"
      path: 'products'
  });

  // do something with the returned data
```

[Back to guide index](../index.md)
