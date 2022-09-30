# Webhooks

If your application's functionality depends on knowing when events occur on a given shop, you need to register a webhook. You need an access token to register webhooks, so you must complete the OAuth process beforehand.

The Shopify library enables you to handle all webhooks in a single endpoint (see [Webhook processing](#webhook-processing)
) below), but you are not restricted to a single endpoint. You can only register each topic once per shop, but the library will ensure your handler is up to date if you call `register` more than once.

To subscribe to webhooks using this library, there are 3 main steps to take:

1. [Load your handlers](#load-your-handlers)
1. [Register webhooks with Shopify](#webhook-registration)
1. [Process incoming webhooks](#webhook-processing)

## Load your handlers

The first step to process webhooks in your app is telling the library how you expect to handle them. To do that, you can call the `shopify.webhooks.addHandler` method to set the callback you want the library to trigger when a certain topic is received.

For example, you can load one or more handlers when setting up your app's `config` (or any other location, as long as it happens before the call to `shopify.webhooks.process`) by running:

```typescript
import {shopifyApi} from '@shopify/shopify-api';
const shopify = shopifyApi({ apiKey: '...', ... });

const handleWebhookRequest = async (topic: string, shop: string, webhookRequestBody: string) => {
  // handler triggered when a webhook is sent by the Shopify platform to your application
}

shopify.webhooks.addHandler({
  topic: "PRODUCTS_CREATE",
  path: "/webhooks",
  webhookHandler: handleWebhookRequest,
});
```

The parameters this method accepts are:

| Parameter        | Type                     | Required? | Default Value | Notes                                                                                                                        |
| ---------------- | ------------------------ | :-------: | :-----------: | ---------------------------------------------------------------------------------------------------------------------------- |
| `topic`          | `string`                 |    Yes    |       -       | The topic to subscribe to, [see the full list](https://shopify.dev/api/admin-graphql/latest/enums/WebhookSubscriptionTopic). |
| `path`           | `string`                 |    Yes    |       -       | The path that the app will listen on to process the webhook for the given `topic`.                                           |
| `webhookHandler` | `WebhookHandlerFunction` |    Yes    |       -       | The `async` callback to call when a shop triggers a `topic` event.                                                           |

When a shop triggers an event you subscribed to, the `process` method [below](#webhook-processing) will call your handler with the following arguments:

| Parameter            | Type     | Notes                                            |
| -------------------- | -------- | ------------------------------------------------ |
| `topic`              | `string` | The webhook topic.                               |
| `shop`               | `string` | The shop for which the webhook was triggered.    |
| `webhookRequestBody` | `string` | The payload of the POST request made by Shopify. |

**Note**: You only need to add handlers for webhooks delivered to your app via HTTPS. For webhooks delivered to Amazon EventBridge or Google Cloud Pub/Sub, you don't add any handlers - you just call `register` (see [webhook registration](#webhook-registration) and [EventBridge and Pub/Sub webhooks](#eventbridge-and-pubsub-webhooks) for more details).

A similar `addHandlers` method is also provided for convenience, which takes in an object with `topic` property names, each pointing to a `WebhookRegistryEntry` (`path` and `webhookHandler`), e.g.,

```typescript
  shopify.webhooks.addHandlers({
    PRODUCTS_CREATE: {
      path: '/webhooks',
      webhookHandler: productCreateWebhookHandler,
    },
    PRODUCTS_DELETE: {
      path: '/webhooks',
      webhookHandler: productDeleteWebhookHandler,
    },
  });
```

## Get Webhook registry information

The library provides some utility methods to see what topics are loaded in the registry and to retrieve the handler details for a given topic.

To see topics loaded in the registry, `shopify.webhooks.getTopics` returns an array of topics names, as strings, or an empty array if there are no topics and handlers loaded.

```typescript
  shopify.webhooks.addHandlers({
    PRODUCTS_CREATE: {
      path: '/webhooks',
      webhookHandler: productCreateWebhookHandler,
    },
    PRODUCTS_DELETE: {
      path: '/webhooks',
      webhookHandler: productDeleteWebhookHandler
    },
  });
  const topics = shopify.webhooks.getTopics();
  // topics = ['PRODUCTS_CREATE', 'PRODUCTS_DELETE']
```

To retrieve the handler information for a given topic, `shopify.webhooks.getHandler()` takes a topic string as an argument and returns the handler properties (path, handler) or `null` if not found.

```typescript
  Shopify.Webhooks.Registry.addHandler({
    topic: 'PRODUCTS',
    path: '/webhooks',
    webhookHandler: productsWebhookHandler,
  });
  const productsHandler = Shopify.Webhooks.Registry.getHandler('PRODUCTS');
  // productsHandler = {path: '/webhooks', webhookHandler: productsWebhookHandler}
```

## Webhook Registration

After loading your handlers, you need to register which topics you want your app to listen to with Shopify. This can only happen after the merchant has installed your app, so the best place to register webhooks is after OAuth completes.

In your OAuth callback action, you can use the `shopify.webhooks.register` method to subscribe to any topic allowed by your app's scopes. You can safely call this method multiple times for a shop, as it will add or update subscriptions as necessary.

The parameters this method accepts are:

| Parameter        | Type     | Required? |     Default Value     | Notes                                                                         |
| :--------------- | :------- | :-------: | :-------------------: | :---------------------------------------------------------------------------- |
| `path`           | `string` |    Yes    |           -           | The URL path for the callback for HTTPS delivery, EventBridge or Pub/Sub URLs |
| `topic`          | `string` |    Yes    |           -           | The topic to subscribe to.                                                    |
| `shop`           | `string` |    Yes    |           -           | The shop to use for requests.                                                 |
| `accessToken`    | `string` |    Yes    |           -           | The access token to use for requests.                                         |
| `deliveryMethod` | `string` |    No     | `DeliveryMethod.Http` | The delivery method for this webhook.                                         |

This method will return a `RegisterReturn` object, which holds the following data:

| Method    | Return type | Notes                                                                                                                 |
| --------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `success` | `bool`      | Whether the registration was successful.                                                                              |
| `result`  | `array`     | The body from the Shopify request to register the webhook. May be null even when successful if no request was needed. |

> **Note**: If you want to register all your webhook topics, you can call the `shopify.webhooks.registerAll({accessToken, shop, deliveryMethod})` method, which will iterate over your handlers and set them all up.
>
> `registerAll()` accepts the following parameters:
>
> | Parameter        | Type     | Required? |     Default Value     | Notes                                                                         |
> | :--------------- | :------- | :-------: | :-------------------: | :---------------------------------------------------------------------------- |
> | `shop`           | `string` |    Yes    |           -           | The shop to use for requests.                                                 |
> | `accessToken`    | `string` |    Yes    |           -           | The access token to use for requests.                                         |
> | `deliveryMethod` | `string` |    No     | `DeliveryMethod.Http` | The delivery method for this webhook.                                         |

For example, to subscribe to the `PRODUCTS_CREATE` event, you can run this code in your OAuth callback action:

```ts
// Register webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    const response = await shopify.webhooks.register({
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: callbackResponse.session.accessToken,
      shop: callbackResponse.session.shop,
    });

    if (!response['PRODUCTS_CREATE'].success) {
      console.log(
        `Failed to register PRODUCTS_CREATE webhook: ${response['PRODUCTS_CREATE'].result}`
      );
    }
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // or wherever you want your user to end up after OAuth completes
});
```

### EventBridge and PubSub Webhooks

You can also register webhooks for delivery to Amazon EventBridge or Google Cloud Pub/Sub. In this case the `path` argument to `register` needs to be of a specific form.

For EventBridge, the `path` must be the [ARN of the partner event source](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html).

For Pub/Sub, the `path` must be of the form `pubsub://[PROJECT-ID]:[PUB-SUB-TOPIC-ID]`. For example, if you created a topic with id `red` in the project `blue`, then the value of `path` would be `pubsub://blue:red`.

## Webhook Processing

To process an HTTPS webhook, you need to listen on the route(s) you provided during the webhook registration process, then call the appropriate handler. The library provides a convenient method that acts as a middleware to handle webhooks. It takes care of validating the request, and calling the correct handler for registered webhook topics.

The `process` method will handle extracting the necessary information from your request and response objects, and triggering the appropriate handler with the parameters detailed above. If it can't find a handler for a topic, it will raise an error.

**Note**: In Node, the `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

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

**Note**: In a worker environment, e.g., CloudFlare Workers, the return value of the `process` method can be used to reply to Shopify. If the `process` call throws an error, the response will be contained in the thrown error, in `error.response`.  This will enable the calling method in a worker environment to return a suitable response to Shopify.

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

To use Express as an example, if you wish to use the `express.json()` middleware in your app, the webhook processing can now occur after calling `app.use(express.json())`.  For any path that's a webhooks path, `express.text({type: '*/*'})` should be used so that `req.body` is a string that `shopify.webhooks.process()` expects:

```typescript
    await shopify.webhooks.process({
      rawBody: req.body,
      rawRequest: req,
      rawResponse: res,
    });
```

[Back to guide index](../../README.md#features)
