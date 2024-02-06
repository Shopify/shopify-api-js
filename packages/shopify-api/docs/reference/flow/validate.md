# shopify.flow.validate

Takes in a raw request and the raw body for that request, and validates that it's a legitimate Shopify Flow extension request.

Refer to [the Flow documentation](https://shopify.dev/docs/apps/flow/actions/endpoints#custom-validation) for more information on how this validation works.

## Example

```ts
app.post('/flow', express.text({type: '*/*'}), async (req, res) => {
  const result = await shopify.flow.validate({
    rawBody: req.body, // is a string
    rawRequest: req,
    rawResponse: res,
  });

  if (!result.valid) {
    console.log(`Received invalid Flow extension request: ${result.reason}`);
    res.send(400);
  }

  res.send(200);
});
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

Returns an object containing:

### valid

`boolean`

Whether the request is a valid Flow extension request from Shopify.

### If valid is `false`:

#### reason

`FlowValidationErrorReason`

The reason why the check was considered invalid.

[Back to shopify.flow](./README.md)
