# Webhooks

If your application's functionality depends on knowing when events occur on a given store, you need to register a Webhook. You need an access token to register webhooks, so you should complete the OAuth process beforehand.

The Shopify library enables you to handle all Webhooks in a single endpoint (see [Process a Webhook](#process-a-webhook) below), but you are not restricted to a single endpoint. Each topic you register can only be mapped to a single endpoint.

**Note**: The webhooks you register with Shopify are saved in the Shopify platform, but your handlers need to be reloaded whenever your server restarts. It is recommended to store your Webhooks in a persistent manner (for example, in a database) so that you can reload previously registered webhooks when your app restarts.

## Register a Webhook

In this example the webhook is being registered as soon as the authentication is completed.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if (pathName === '/login')

  // Register webhooks after OAuth completes
  if (pathName === '/auth/callback') {
    try {
      await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);

      const handleWebhookRequest = async (topic: string, shop: string, webhookRequestBody: Buffer) => {
        // this handler is triggered when a webhook is sent by the Shopify platform to your application
      }

      const currentSession = await Shopify.Utils.loadCurrentSession(request, response);

      // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for a list of available topics
      const resp = await Shopify.Webhooks.Registry.register({
        path: '/webhooks',
        topic: 'PRODUCTS_CREATE',
        accessToken: currentSession.accessToken,
        shop: currentSession.shop,
        webhookHandler: handleWebhookRequest
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
// Register webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted

    const handleWebhookRequest = async (
      topic: string,
      shop: string,
      webhookRequestBody: Buffer,
    ) => {
      // this handler is triggered when a webhook is sent by the Shopify platform to your application
    };

    const currentSession = await Shopify.Utils.loadCurrentSession(
      req,
      res,
    );

    // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for a list of available topics
    const resp = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: currentSession.accessToken,
      shop: currentSession.shop,
      webhookHandler: handleWebhookRequest,
    });
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
`Shopify.Webhooks.Registry.register` needs to be of a specific form.

For EventBridge, the `path` must be the [ARN of the partner event
source](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_EventSource.html).

For Pub/Sub, the `path` must be of the form
`pubsub://[PROJECT-ID]:[PUB-SUB-TOPIC-ID]`. For example, if you created a topic
with id `red` in the project `blue`, then the value of `path` would be
`pubsub://blue:red`.

## Process a Webhook

To process a webhook, you need to listen on the route(s) you provided during the Webhook registration process, then call the appropriate handler. The library provides a convenient `process` method that acts as a middleware to handle webhooks. It takes care of calling the correct handler for the registered Webhook topics.

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
