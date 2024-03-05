# shopify.fulfillmentService.validate

Takes in a raw request and the raw body for that request, and validates that it's a legitimate fulfillment service request.

Refer to [the fulfillment service documentation](https://shopify.dev/docs/apps/fulfillment/fulfillment-service-apps/manage-fulfillments#step-3-act-on-fulfillment-requests) for more information on how this validation works.

## Example

```ts
app.post('/fulfillment_order_notification', express.text({type: '*/*'}), async (req, res) => {
  const result = await shopify.fulfillmentService.validate({
    rawBody: req.body, // is a string
    rawRequest: req,
    rawResponse: res,
  });

  if (!result.valid) {
    console.log(`Received invalid fulfillment service request: ${result.reason}`);
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

Whether the request is a valid fulfillment service request from Shopify.

### If valid is `false`:

#### reason

`ValidationErrorReason`

The reason why the check was considered invalid.

[Back to shopify.fulfillmentService](./README.md)
