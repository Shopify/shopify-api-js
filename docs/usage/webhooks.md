# Webhooks

If your application's functionality depends on knowing when events occur on a given store, you need to register a Webhook. You need an access token to register Webhooks, so you should complete the OAuth process beforehand.

The Shopify library enables you to handle all Webhooks in a single endpoint (see [Process Webhooks](#process-webhooks) below), but you are not restricted to a single endpoint. Each topic you register can only be mapped to a single endpoint.

## Webhooks registry

Before registering Webhooks to Shopify, you need to define them in your Webhooks registry when you [set up the Context](getting_started.md#set-up-context).

```typescript
const WEBHOOKS_REGISTRY = {
  PRODUCTS_CREATE: {
    path: '/webhooks',
    webhookHandler: async (topic: string, shop: string, body: Buffer) => {
      // this handler is triggered when a Webhook is sent by the Shopify platform to your application
    }
  }
}

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: {boolean},
  API_VERSION: ApiVersion.{version},
  WEBHOOKS_REGISTRY
});
```

The Webhooks registry is a collection of Webhooks where the key is a Webhook `topic` and the value is an object containing the Webhook `path`, `webhookHandler` and `deliveryMethod`.

<details>
<summary>Signature</summary>

```typescript
type WEBHOOKS_REGISTRY = {
  [topic: string]: {
    path: string;
    webhookHandler: (topic: string, shop: string, body: Buffer) => Promise<void>;
    deliveryMethod?: 'http' | 'eventbridge' | 'pubsub';
  }
}
```

</details>

<details>
<summary>Parameters</summary>

| Parameter        | Type                                                            | Required? | Default Value | Notes                                                                                                                    |
| ---------------- | --------------------------------------------------------------- | :-------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------ |
| `topic`          | `string`                                                        |   True    |     none      | See the [list of available topics](https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic) |
| `path`           | `string`                                                        |   True    |     none      | The path to call depending on the `deliveryMethod`                                                                       |
| `webhookHandler` | `(topic: string, shop: string, body: Buffer) => Promise<void>`  |   True    |     none      | The handler to execute when the Webhook is called                                                                        |
| `deliveryMethod` | <code>'http' &#124; 'eventbridge' &#124; 'pubsub'</code>        |   False   |     `'http'`  | See [Delivery methods](#delivery-methods) below for more de details                                                      |

</details>

## Register Webhooks

In this example the Webhooks are being registered as soon as the authentication is completed.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if (pathName === '/login')

  // Register Webhooks after OAuth completes
  if (pathName === '/auth/callback') {
    try {
      await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);

      const currentSession = await Shopify.Utils.loadCurrentSession(request, response);

      const resp = await Shopify.Webhooks.Registry.register({
        accessToken: currentSession.accessToken,
        shop: currentSession.shop
      });
      response.writeHead(302, { 'Location': '/' });
      response.end();
    }
    catch (e) {
      ...
```

</details>

<details>
<summary>Express</summary>

```ts
// Register Webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted

    const currentSession = await Shopify.Utils.loadCurrentSession(
      req,
      res,
    );

    const resp = await Shopify.Webhooks.Registry.register({
      accessToken: currentSession.accessToken,
      shop: currentSession.shop
    });
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // wherever you want your user to end up after OAuth completes
});
```

</details>

## Delivery methods

The default delivery method is `http`. With this method, Shopify will deliver the Webhook payload to an endpoint on your app that you specified in the `path` parameter (eg: `/webhooks`).

However, if you need to manage large volumes of event notifications, then you can configure subscriptions to send Webhooks to [Amazon EventBridge](https://shopify.dev/apps/webhooks/eventbridge) and [Google Cloud Pub/Sub](https://shopify.dev/apps/webhooks/google-cloud).

In this case the `path` parameter to needs to be of a specific form.

For `eventbridge`, the `path` must be the [ARN of the partner event source](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html).

For `pubsub`, the `path` must be of the form `pubsub://[PROJECT-ID]:[PUB-SUB-TOPIC-ID]`. For example, if you created a topic with id `red` in the project `blue`, then the value of `path` would be `pubsub://blue:red`.

## Process Webhooks

To process the Webhooks that use the `http` delivery method, you need to listen on the endpoint(s) you provided in the `path` parameter of your Webhooks in the `Shopify.Context.WEBHOOKS_REGISTRY`. The library provides a convenient `process` method that acts as a middleware to handle Webhooks. It takes care of calling the correct handler for the registered Webhook topics.

**Note**: The `process` method will always respond to Shopify, even if your call throws an error. You can catch and log errors, but you can't change the response.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if (pathName === '/auth/callback')

  if (Shopify.Webhooks.Registry.isWebhookPath(pathName)) {
    try {
      await Shopify.Webhooks.Registry.process(request, response);
    } catch (error) {
      console.log(error);
    }
  } // end of if (Shopify.Webhooks.Registry.isWebhookPath(pathName))
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
    console.log(error);
  }
});
```

</details>

[Back to guide index](../README.md)
