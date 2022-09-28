# Webhooks

If your application's functionality depends on knowing when events occur on a given shop, you need to register a webhook. You need an access token to register webhooks, so you should complete the OAuth process beforehand.

The Shopify library enables you to handle all webhooks in a single endpoint (see [Webhook processing](#webhook-processing)
) below), but you are not restricted to a single endpoint. You can only register each topic once per shop, but the library will ensure your handler is up to date if you call `register` more than once.

To subscribe to webhooks using this library, there are 3 main steps to take:

1. [Load your handlers](#load-your-handlers)
1. [Register webhooks with Shopify](#webhook-registration)
1. [Process incoming webhooks](#webhook-processing)

## Load your handlers

The first step to process webhooks in your app is telling the library how you expect to handle them. To do that, you can call the `shopify.webhooks.addHandler` method to set the callback you want the library to trigger when a certain topic is received.

The parameters this method accepts are:

| Parameter | Type                   | Required? | Default Value | Notes                                                                                                                        |
| --------- | ---------------------- | :-------: | :-----------: | ---------------------------------------------------------------------------------------------------------------------------- |
| `topic`   | `string`               |    Yes    |       -       | The topic to subscribe to, [see the full list](https://shopify.dev/api/admin-graphql/latest/enums/WebhookSubscriptionTopic). |
| `handler` | `WebhookRegistryEntry` |    Yes    |       -       | The registry entry for this topic, which contains a path and the `async` callback to call.                                                |

We also provide a similar `addHandlers` method for convenience, which takes in an object of with `topic` as a property pointing to a `WebhookRegistryEntry`, e.g.,

```typescript
  await shopify.webhooks.addHandlers({
    PRODUCTS_CREATE: {
      path: '/webhooks',
      webhookHandler: productCreateWebhookHandler,
    },
    PRODUCTS_DELETE: {
      path: '/webhooks',
      webhookHandler: productDeleteWebhookHandler},
  });
```

When a shop triggers an event you subscribed to, the `process` method below will call your handler with the following arguments:

| Parameter            | Type     | Notes                                            |
| -------------------- | -------- | ------------------------------------------------ |
| `topic`              | `string` | The webhook topic.                               |
| `shop`               | `string` | The shop for which the webhook was triggered.    |
| `webhookRequestBody` | `string` | The payload of the POST request made by Shopify. |

For example, you can load one or more handlers when setting up your app's `config` (or any other location, as long as it happens before the call to `process`) by running:

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

**Note**: You only need to add handlers for webhooks delivered to your app via HTTPS. [Learn more about webhook configuration](https://shopify.dev/apps/webhooks/configuration).

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
>| Parameter        | Type     | Required? |     Default Value     | Notes                                                                         |
> | :--------------- | :------- | :-------: | :-------------------: | :---------------------------------------------------------------------------- |
> | `shop`           | `string` |    Yes    |           -           | The shop to use for requests.                                                 |
> | `accessToken`    | `string` |    Yes    |           -           | The access token to use for requests.                                         |
> | `deliveryMethod` | `string` |    No     | `DeliveryMethod.Http` | The delivery method for this webhook.                                         |

For example, to subscribe to the `PRODUCTS_CREATE` event, you can run this code in your OAuth callback action:

<details>
<summary>Node.js</summary>

```typescript
} // end of if (pathName === '/login')

// Register webhooks after OAuth completes
if (pathName === '/auth/callback') {
  try {
    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: request,
      rawResponse: response,
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

    response.writeHead(
      302,
      {
        'Location': '/' // or wherever you want your user to end up after OAuth completes
      }
    );
    response.end();
  }
  catch (e) {
    // handle error appropriately ...
  }
}
```

</details>

<details>
<summary>Express</summary>

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

</details>

### EventBridge and PubSub Webhooks

You can also register webhooks for delivery to Amazon EventBridge or Google Cloud Pub/Sub. In this case the `path` argument to `register` needs to be of a specific form.

For EventBridge, the `path` must be the [ARN of the partner event source](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html).

For Pub/Sub, the `path` must be of the form `pubsub://[PROJECT-ID]:[PUB-SUB-TOPIC-ID]`. For example, if you created a topic with id `red` in the project `blue`, then the value of `path` would be `pubsub://blue:red`.

## Webhook Processing

To process an HTTPS webhook, you need to listen on the route(s) you provided during the webhook registration process, then call the appropriate handler. The library provides a convenient method that acts as a middleware to handle webhooks. It takes care of validating the request, and calling the correct handler for registered webhook topics.

The `process` method will handle extracting the necessary information from your request and response objects, and triggering the appropriate handler with the parameters detailed above. If it can't find a handler for a topic, it will raise an error.

**Note**: The `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if (pathName === '/auth/callback')

  if (shopify.webhooks.isWebhookPath(pathName)) {
    try {
      // Note: this assumes that the raw content of the body of the request
      // has been read and is available at req.rawBody.
      await shopify.webhooks.process({
        rawBody: (request as any).rawBody, // as a string
        rawRequest: request,
        rawResponse: response,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}  // end of onRequest()

http.createServer(onRequest).listen(3000);
```

</details>

<details>
<summary>Express</summary>

```typescript
app.post('/webhooks', async (req, res) => {
  try {
    // Note: this assumes that the raw content of the body of the request has been
    // read and is available at req.rawBody; this will likely differ depending on
    // which body parser may be used.
    await shopify.webhooks.process({
      rawBody: (req as any).rawBody, // as a string
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    console.log(error.message);
  }
});
```

</details>

### Note regarding use of body parsers

Unlike `v5` and earlier versions of this library, `shopify.webhooks.process()` now expects to receive the body content (in string format) as a parameter and no longer reads in the request body directly.

This allows for the use of body-parsers in your code.

To use Express as an example, if you wish to use the `express.json()` middleware in your app, the webhook processing can now occur after calling `app.use(express.json())`.  `shopify.webhooks.process()` can then be called as follows:

```typescript
    await shopify.webhooks.process({
      rawBody: JSON.stringify(req.body), // req.body is object from JSON -> convert to string
      rawRequest: req,
      rawResponse: res,
    });
```

If you wish to use the `express.text()` middleware in your app, `shopify.webhooks.process()` can then be called as follows:

```typescript
    await shopify.webhooks.process({
      rawBody: req.body, // already in string format
      rawRequest: req,
      rawResponse: res,
    });
```

[Back to guide index](../../README.md#features)
