# shopify.webhooks.validate

This method validates an incoming request for `Http` handlers.
If the call is invalid, it will return a `valid` field set to `false`.

## Example

```ts
app.post('/webhooks', express.text({type: '*/*'}), async (req, res) => {
  const {valid, topic, domain} = await shopify.webhooks.validate({
    rawBody: req.body, // is a string
    rawRequest: req,
    rawResponse: res,
  });

  if (!valid) {
    // This is not a valid request!
    res.send(400); // Bad Request
  }

  // Run my webhook-processing code here
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

Whether the request is a valid webhook from Shopify.

### If valid is `true`:

#### webhookId

`string`

The webhook ID from Shopify.

#### apiVersion

`string`

The API version used when subscribing to this webhook.

#### domain

`string`

The shop that triggered the event.

#### topic

`string`

The event topic.

### If valid is `false`:

#### reason

`WebhookValidationErrorReason`

The reason why the check was considered invalid.

#### missingHeaders

`string[]`

Which required Shopify headers were missing from the call.
Only present if `reason` is `WebhookValidationErrorReason.MissingHeaders`.

## Note regarding use of body parsers

Unlike `v5` and earlier versions of this library, `shopify.webhooks.validate()` now expects to receive the body content (in string format) as a parameter and no longer reads in the request body directly.

This allows for the use of body-parsers in your code.

To use Express as an example, if you wish to use the `express.json()` middleware in your app, the webhook validation can now occur after calling `app.use(express.json())`.
For any path that's a webhooks path, `express.text({type: '*/*'})` should be used so that `req.body` is a string that `shopify.webhooks.validate()` expects:

```ts
await shopify.webhooks.validate({
  rawBody: req.body,
  rawRequest: req,
  rawResponse: res,
});
```

[Back to shopify.webhooks](./README.md)
