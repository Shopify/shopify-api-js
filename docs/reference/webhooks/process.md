# shopify.webhooks.process

This method validates and triggers the callbacks you configured using [`webhooks.addHandlers`](./addHandlers.md) for `Http` handlers.

If no handler is found, it will throw an error.

**Important**: In Node, the `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

## Example

```ts
app.post('/webhooks', express.text({type: '*/*'}), async (req, res) => {
  try {
    // Note: the express.text() given above is an Express middleware that will read
    // in the body as a string, and make it available at req.body, for this path only.
    await shopify.webhooks.process({
      rawBody: req.body, // is a string
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    console.log(error.message);
  }
});
```

**Important**: In a worker environment, e.g., CloudFlare Workers, the return value of the `process` method can be used to reply to Shopify. If the `process` call throws an error, the response will be contained in the thrown error, in `error.response`. This will enable the calling method in a worker environment to return a suitable response to Shopify.

```ts
let response: Response;

try {
  response = await shopify.webhooks.process({
    rawBody: req.body,
    rawRequest: req,
    rawResponse: res,
  });
} catch (error) {
  console.log(error.message);
  response = error.response;
}
return response;
```

## Parameters

Receives an object containing:

### rawBody

`string` | :exclamation: required

The raw body of the request received by the app.

### rawRequest

`AdapterRequest` | :exclamation: required

The HTTP Request object used by your runtime.

### rawResponse

`AdapterResponse` | :exclamation: required for Node.js

The HTTP Response object used by your runtime. Required for Node.js.

## Return

### Node.js

`Promise<void>`

This method doesn't return anything on Node.js because it handles responding.

### Cloudflare workers

`Promise<Response>`

The response for the request.

## Note regarding use of body parsers

Unlike `v5` and earlier versions of this library, `shopify.webhooks.process()` now expects to receive the body content (in string format) as a parameter and no longer reads in the request body directly.

This allows for the use of body-parsers in your code.

To use Express as an example, if you wish to use the `express.json()` middleware in your app, the webhook processing can now occur after calling `app.use(express.json())`. For any path that's a webhooks path, `express.text({type: '*/*'})` should be used so that `req.body` is a string that `shopify.webhooks.process()` expects:

```ts
await shopify.webhooks.process({
  rawBody: req.body,
  rawRequest: req,
  rawResponse: res,
});
```

[Back to shopify.webhooks](./README.md)
