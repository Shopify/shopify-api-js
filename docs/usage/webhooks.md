# Webhooks

If your application's functionality depends on knowing when events occur on a given shop, you need to register a webhook. You need an access token to register webhooks, so you must complete the OAuth process beforehand.

The Shopify library enables you to handle all webhooks in a single endpoint (see [Webhook processing](#webhook-processing)
) below), but you are not restricted to a single endpoint.
You can register multiple handlers for each topic, and the library will add, remove, and update the handlers with Shopify based on the app's configuration.

To subscribe to webhooks using this library, there are 3 main steps to take:

1. [Load your handlers](#load-your-handlers)
1. [Register webhooks with Shopify](#webhook-registration)
1. [Process incoming webhooks](#webhook-processing)

## Load your handlers

The first step to process webhooks in your app is telling the library how you expect to handle them. To do that, you can call the `shopify.webhooks.addHandlers` method to inform Shopify of the events you wish to track.

For example, you can load one or more handlers when setting up your app's `config` (or any other location, as long as it happens before the call to `shopify.webhooks.register`) by running:

```typescript
import {shopifyApi, DeliveryMethod} from '@shopify/shopify-api';
const shopify = shopifyApi({apiKey: '...' /* ... */});

const handleWebhookRequest = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
) => {
  // handler triggered when a webhook is sent by the Shopify platform to your application
};

await shopify.webhooks.addHandlers({
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

> **Note**: you can only register multiple handlers with the same address when the delivery method is HTTP - the library will automatically chain the requests together when handling events.
> The library will fail when trying to add duplicate paths for other delivery methods.

See the documentation for [the full list](https://shopify.dev/api/admin-graphql/latest/enums/WebhookSubscriptionTopic) of accepted topics.

This method accepts an object indexed by topic. Each topic can map to an object or an array of objects with format:

| Parameter                    | Type                     | Restrictions  | Default Value | Notes                                                                                                                |
| ---------------------------- | ------------------------ | :-----------: | :-----------: | -------------------------------------------------------------------------------------------------------------------- |
| `deliveryMethod`             | `DeliveryMethod`         |  All methods  |  _Required_   | The delivery method for this handler. Different fields for this object are allowed depending on the method.          |
| `callbackUrl`                | `string`                 |    `Http`     |  _Required_   | The path for this handler within your app.                                                                           |
| `callback`                   | `WebhookHandlerFunction` |    `Http`     |  _Required_   | The `async` callback to call when a shop triggers a `topic` event.                                                   |
| `arn`                        | `string`                 | `EventBridge` |  _Required_   | The [ARN address](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html) for the handler. |
| `pubSubProject`              | `string`                 |   `PubSub`    |  _Required_   | The Pub-Sub project for your handler.                                                                                |
| `pubSubTopic`                | `string`                 |   `PubSub`    |  _Required_   | The Pub-Sub topic for your handler.                                                                                  |
| `includeFields`              | `string[]`               |       -       |     `[]`      | Fields to be included in the callback.                                                                               |
| `metafieldNamespaces`        | `string[]`               |       -       |     `[]`      | Namespaces to be included in the callback.                                                                           |
| `privateMetafieldNamespaces` | `string[]`               |    `Http`     |     `[]`      | Namespaces to be included in the callback.                                                                           |

When a shop triggers an event you subscribed to, the `process` method [below](#webhook-processing) will call your `Http` callbacks with the following arguments:

| Parameter            | Type     | Notes                                            |
| -------------------- | -------- | ------------------------------------------------ |
| `topic`              | `string` | The webhook topic.                               |
| `shop`               | `string` | The shop for which the webhook was triggered.    |
| `webhookRequestBody` | `string` | The payload of the POST request made by Shopify. |

## Get webhook registry information

To see topics loaded in the registry, `shopify.webhooks.getTopicsAdded` returns an array of topics names, as strings, or an empty array if there are no topics and handlers loaded.

```typescript
shopify.webhooks.addHandlers({
  PRODUCTS_CREATE: {
    /* ... */
  },
  PRODUCTS_DELETE: [
    {
      /* ... */
    },
  ],
});

const topics = shopify.webhooks.getTopicsAdded();
// topics = ['PRODUCTS_CREATE', 'PRODUCTS_DELETE']
```

To retrieve the handler information for a given topic, `shopify.webhooks.getHandlers()` takes a topic string as an argument and returns the list of handlers for that topic.

```typescript
shopify.webhooks.addHandlers({
  PRODUCTS_CREATE: {
    /* ... */
  },
});
const handlers = shopify.webhooks.getHandlers('PRODUCTS');
```

## Webhook Registration

After loading your handlers, you need to register which topics you want your app to listen to with Shopify. This can only happen after the merchant has installed your app, so the best place to register webhooks is after OAuth completes.

In your OAuth callback action, you can use the `shopify.webhooks.register` method to subscribe to any topic allowed by your app's scopes. You can safely call this method every time a shop logs in, as it will add, update, or remove subscriptions as necessary.

The parameters this method accepts are:

| Parameter | Type      | Required? | Default Value | Notes                            |
| :-------- | :-------- | :-------: | :-----------: | :------------------------------- |
| `session` | `Session` |    Yes    |       -       | The session to use for requests. |

This method will return a `RegisterReturn` object, which is a list of results indexed by topic. Each item in the lists has format. This object will only contain results for a handler if any of its information was updated with Shopify.

| Method    | Return type | Notes                                                      |
| --------- | ----------- | ---------------------------------------------------------- |
| `success` | `bool`      | Whether the registration was successful.                   |
| `result`  | `array`     | The body from the Shopify request to register the webhook. |

For example, to subscribe to the `PRODUCTS_CREATE` event, you can run this code in your OAuth callback action:

```ts
shopify.webhooks.addHandlers({
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/webhooks',
    callback: async (topic, shop, body) => {},
  },
});

// Register webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    const response = await shopify.webhooks.register({
      session: callbackResponse.session,
    });

    if (!response['PRODUCTS_CREATE'][0].success) {
      console.log(
        `Failed to register PRODUCTS_CREATE webhook: ${response['PRODUCTS_CREATE'].result}`,
      );
    }
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // or wherever you want your user to end up after OAuth completes
});
```

## Webhook Processing

To process an HTTPS webhook, you need to listen on the route(s) you provided for `Http` handlers during the webhook registration process, then call the appropriate handler.
The library provides a convenient method that acts as a middleware to handle webhooks.
It takes care of validating the request, and calling the correct handler for registered webhook topics.

The `process` method will handle extracting the necessary information from your request and response objects, and triggering the appropriate handler with the parameters detailed above.
If it can't find a handler for a topic, it will raise an error.

**Important**: In Node, the `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

```typescript
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

```typescript
let response;

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

### Note regarding use of body parsers

Unlike `v5` and earlier versions of this library, `shopify.webhooks.process()` now expects to receive the body content (in string format) as a parameter and no longer reads in the request body directly.

This allows for the use of body-parsers in your code.

To use Express as an example, if you wish to use the `express.json()` middleware in your app, the webhook processing can now occur after calling `app.use(express.json())`. For any path that's a webhooks path, `express.text({type: '*/*'})` should be used so that `req.body` is a string that `shopify.webhooks.process()` expects:

```typescript
await shopify.webhooks.process({
  rawBody: req.body,
  rawRequest: req,
  rawResponse: res,
});
```

[Back to guide index](../../README.md#features)
