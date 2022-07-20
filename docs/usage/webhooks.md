# Webhooks

If your application's functionality depends on knowing when events occur on a given shop, you need to register a webhook. You need an access token to register webhooks, so you should complete the OAuth process beforehand.

The Shopify library enables you to handle all webhooks in a single endpoint (see [Webhook processing](#webhook-processing)
) below), but you are not restricted to a single endpoint. You can only register each topic once per shop, but the library will ensure your handler is up to date if you call `register` more than once.

To subscribe to webhooks using this library, there are 3 main steps to take:

1. [Load your handlers](#load-your-handlers)
1. [Register webhooks with Shopify](#webhook-registration)
1. [Process incoming webhooks](#webhook-processing)

## Load your handlers

The first step to process webhooks in your app is telling the library how you expect to handle them. To do that, you can call the `Shopify.Webhooks.Registry.addHandler` method to set the callback you want the library to trigger when a certain topic is received. We also provide a similar `addHandlers` method for convenience, which takes in a hash of topic => `WebhookRegistryEntry`.

The parameters this method accepts are:

| Parameter | Type | Required? | Default Value | Notes |
| --- | --- | :---: | :---: | --- |
| `topic` | `string` | Yes | - | The topic to subscribe to, [see the full list](https://shopify.dev/api/admin-graphql/latest/enums/WebhookSubscriptionTopic). |
| `handler` | `WebhookRegistryEntry` | Yes | - | The handler for this topic, contains a path and the `async` callback to call. |

When a shop triggers an event you subscribed to, the `process` method below will call your handler with the following arguments:

| Parameter | Type | Notes |
| --- | --- | --- |
| `topic` | `string` | The webhook topic. |
| `shop` | `string` | The shop for which the webhook was triggered. |
| `webhookRequestBody` | `string` | The payload of the POST request made by Shopify. |

For example, you can load one or more handlers when setting up your app's `Context` (or any other location, as long as it happens before the call to `process`) by running:

```typescript
Shopify.Context.initialize({ ... });

const handleWebhookRequest = async (topic: string, shop: string, webhookRequestBody: string) => {
  // handler triggered when a webhook is sent by the Shopify platform to your application
}

Shopify.Webhooks.Registry.addHandler("PRODUCTS_CREATE", {
  path: "/webhooks",
  webhookHandler: handleWebhookRequest,
});
```

**Note**: you only need to add handlers for webhooks delivered to your app via HTTPS. [Learn more about webhook configuration](https://shopify.dev/apps/webhooks/configuration).

## Webhook Registration

After loading your handlers, you need to register which topics you want your app to listen to with Shopify. This can only happen after the merchant has installed your app, so the best place to register webhooks is after OAuth completes.

In your OAuth callback action, you can use the `Shopify.Webhooks.Registry.register` method to subscribe to any topic allowed by your app's scopes. You can safely call this method multiple times for a shop, as it will add or update subscriptions as necessary.

**Note**: if you want to register all your webhook topics, you can call the `Shopify.Webhooks.Registry.registerAll({accessToken, shop, deliveryMethod})` method, which will iterate over your handlers and set them all up.

The parameters this method accepts are:

| Parameter | Type | Required? | Default Value | Notes |
|:---|:---|:---:|:---:|:---|
| `path` | `string` | Yes | - | The URL path for the callback for HTTPS delivery, EventBridge or Pub/Sub URLs |
| `topic` | `string` | Yes | - | The topic to subscribe to. |
| `shop` | `string` | Yes | - | The shop to use for requests. |
| `accessToken` | `string` | Yes | - | The access token to use for requests. |
| `deliveryMethod` | `string` | No | `DeliveryMethod.Http` | The delivery method for this webhook. |

This method will return a `RegisterReturn` object, which holds the following data:

| Method | Return type | Notes |
| --- | --- | --- |
| `success` | `bool` | Whether the registration was successful. |
| `result` | `array` | The body from the Shopify request to register the webhook. May be null even when successful if no request was needed. |

For example, to subscribe to the `PRODUCTS_CREATE` event, you can run this code in your OAuth callback action:

<details>
<summary>Node.js</summary>

```typescript
} // end of if (pathName === '/login')

// Register webhooks after OAuth completes
if (pathName === '/auth/callback') {
  try {
    const currentSession = await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);

    const response = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: currentSession.accessToken,
      shop: currentSession.shop,
    });

    if (!response['PRODUCTS_CREATE'].success) {
      console.log(
        `Failed to register PRODUCTS_CREATE webhook: ${response.result}`
      );
    }

    response.writeHead(302, { 'Location': '/' });
    response.end();
  }
  catch (e) {
    ...
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
    const currentSession = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted

    const response = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: currentSession.accessToken,
      shop: currentSession.shop,
    });

    if (!response['PRODUCTS_CREATE'].success) {
      console.log(
        `Failed to register PRODUCTS_CREATE webhook: ${response.result}`
      );
    }
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // wherever you want your user to end up after OAuth completes
});
```

</details>

### EventBridge and PubSub Webhooks

You can also register webhooks for delivery to Amazon EventBridge or Google Cloud
Pub/Sub. In this case the `path` argument to
`register` needs to be of a specific form.

For EventBridge, the `path` must be the [ARN of the partner event
source](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html).

For Pub/Sub, the `path` must be of the form
`pubsub://[PROJECT-ID]:[PUB-SUB-TOPIC-ID]`. For example, if you created a topic
with id `red` in the project `blue`, then the value of `path` would be
`pubsub://blue:red`.

## Webhook Processing

To process an HTTPS webhook, you need to listen on the route(s) you provided during the webhook registration process, then call the appropriate handler. The library provides a convenient method that acts as a middleware to handle webhooks. It takes care of validating the request, and calling the correct handler for registered webhook topics.

The `process` method will handle extracting the necessary information from your request and response objects, and triggering the appropriate handler with the parameters detailed above. If it can't find a handler for a topic, it will raise an error.

**Note**: The `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if (pathName === '/auth/callback')

  if (Shopify.Webhooks.Registry.isWebhookPath(pathName)) {
    try {
      await Shopify.Webhooks.Registry.process(request, response);
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
    await Shopify.Webhooks.Registry.process(req, res);
  } catch (error) {
    console.log(error.message);
  }
});
```

</details>

### Note regarding use of body parsers

Please note that the use of body parsing middleware must occur **after** webhook processing.  `Shopify.Webhooks.Registry.process()` reads in the request body directly, therefore, if a body parsing middleware is used beforehand, `process` thinks the request body is empty and will return a `bad request` message back to Shopify for the webhook and raise an error.

To use Express as an example, if you wish to use the `express.json()` middleware in your app **and** if you use this library's `process` method to handle webhooks API calls from Shopify (which we recommend), the webhook processing must occur ***before*** calling `app.use(express.json())`.

[Back to guide index](../README.md)
