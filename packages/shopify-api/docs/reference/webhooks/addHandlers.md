# shopify.webhooks.addHandlers

Adds webhook handlers to the library registry, allowing you to register them with Shopify and process HTTP webhook requests from Shopify.

See the documentation for [the full list](https://shopify.dev/docs/api/admin-graphql/latest/enums/WebhookSubscriptionTopic) of accepted topics.

> **Note**: you can only register multiple handlers with the same address when the delivery method is HTTP - the library will automatically chain the requests together when handling events.
> The library will fail when trying to add duplicate paths for other delivery methods.

## Example

```ts
const shopify = shopifyApi({
  /* ... */
});

const handleWebhookRequest = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string,
) => {
  const sessionId = shopify.session.getOfflineId(shop);

  // Fetch the session from storage and process the webhook event
};

shopify.webhooks.addHandlers({
  PRODUCTS_CREATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
      callback: handleWebhookRequest,
    },
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
      callback: handleWebhookRequestPart2,
    },
  ],
});
```

## Parameters

This method accepts an object indexed by topic. Each topic can map to an object or an array of objects with format:

### deliveryMethod

`DeliveryMethod` | :exclamation: required

The delivery method for this handler. Different fields for this object are allowed depending on the method.

### includeFields

`string[]` | Defaults to `[]`

Fields to be included in the callback, defaulting to including all of them.

### metafieldNamespaces

`string[]` | Defaults to `[]`

Namespaces to be included in the callback, defaulting to including all of them.

## Delivery method-specific parameters

### Http

#### callbackUrl

`string` | :exclamation: required

The path for this handler within your app. The app's host will be automatically set to your configured host.

#### callback

`WebhookHandlerFunction` | :exclamation: required

The `async` callback to call when a shop triggers a `topic` event.

#### privateMetafieldNamespaces

`string[]` | Defaults to `[]` | :warning: deprecated, will be removed in v8.0.0

Namespaces to be included in the callback, defaulting to all of them.

### EventBridge

#### arn

`string` | :exclamation: required

The [ARN address](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html) for the handler.

### PubSub

#### pubSubProject

`string` | :exclamation: required

The Pub-Sub project for your handler.

#### pubSubTopic

`string` | :exclamation: required

The Pub-Sub topic for your handler.

## Callbacks

When a shop triggers an event you subscribed to, the [`process`](./process.md) method will call your `Http` callbacks with the following arguments:

### topic

`string`

The webhook topic.

### shop

`string`

The shop for which the webhook was triggered.

### webhookRequestBody

`string`

The payload of the POST request made by Shopify.

### webhookId

`string`

The id of the webhook registration in Shopify.

### apiVersion

`string`

The apiVersion of the webhook.

[Back to shopify.webhooks](./README.md)
