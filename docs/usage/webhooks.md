# Setting up webhooks

If your app needs to keep track of specific events happening on a shop, you can use [Shopify webhooks](https://shopify.dev/apps/webhooks) to subscribe to those events.

To do that, you'll need to perform the following steps:

1. Set up your webhook handlers by calling [shopify.webhooks.addHandlers](../reference/webhooks/addHandlers.md).
1. Register your handlers with Shopify after the app is installed by calling [shopify.webhooks.register](../reference/webhooks/register.md).
1. Process incoming events by setting up an endpoint that calls [shopfiy.webhooks.process](../reference/webhooks/process.md).

Below is a simplified example of what the combination of these steps looks like in practice:

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
  const sessionId = shopify.session.getOfflineId({shop});

  // Fetch the session from storage and process the webhook event
};

await shopify.webhooks.addHandlers({
  PRODUCTS_CREATE: [
    {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
      callback: handleWebhookRequest,
    },
  ],
});

const app = express();

// Register webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const response = await shopify.webhooks.register({
      session: callbackResponse.session,
    });

    if (!response['PRODUCTS_CREATE'][0].success) {
      console.log(
        `Failed to register PRODUCTS_CREATE webhook: ${response['PRODUCTS_CREATE'][0].result}`,
      );
    }
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }

  return res.redirect('/'); // or wherever you want your user to end up after OAuth completes
});

// Process webhooks
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

## Note regarding use of body parsers

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
