# Webhooks

If your application's functionality depends on knowing when events occur on a given store, you need to register a Webhook. You need an access token to register webhooks, so you should complete the OAuth process beforehand.

The Shopify library enables you to handle all Webhooks in a single endpoint (see [Process a Webhook](#process-a-webhook) below), but you are not restricted to a single endpoint. Each topic you register can only be mapped to a single endpoint.

**Note**: The webhooks you register with Shopify are saved in the Shopify platform, but your handlers need to be reloaded whenever your server restarts. It is recommended to store your Webhooks in a persistent manner (for example, in a database) so that you can reload previously registered webhooks when your app restarts.

## Register a Webhook

In this example the webhook is being registered as soon as the authentication is completed.

### Node.js

```typescript
  } // end of if (pathName === '/login')

  // Register webhooks after OAuth completes
  if (pathName === '/auth/callback') {
    try {
      await Shopify.Auth.OAuth.validateAuthCallback(request, response, query as AuthQuery);

      const handleWebhookRequest = (topic: string, shop: string, webhookRequestBody: Buffer) => {
        // this handler is triggered when a webhook is sent by the Shopify platform to your application
      }

      const currentSession = await Shopify.Utils.loadCurrentSession(request, response, false);

      const resp = await Shopify.Webhooks.Registry.register({
        path: '/webhooks',
        topic: 'PRODUCTS_CREATE',
        accessToken: currentSession.accessToken,
        shop: currentSession.shop,
        apiVersion: Context.API_VERSION,
        webhookHandler: handleWebhookRequest
      });
      response.writeHead(302, { 'Location': '/' });
      response.end();
    }
    catch (e) {
      ...
```

### Express

```ts
// Register webhooks after OAuth completes
app.get('/auth/callback', async (req, res) => {
  try {
    await Shopify.Auth.OAuth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted

    const handleWebhookRequest = (topic: string, shop: string, webhookRequestBody: Buffer) => {
      // this handler is triggered when a webhook is sent by the Shopify platform to your application
    }

    const currentSession = await Shopify.Utils.loadCurrentSession(request, response, false);

    const resp = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: currentSession.accessToken,
      shop: currentSession.shop,
      apiVersion: Context.API_VERSION,
      webhookHandler: handleWebhookRequest
    });
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // wherever you want your user to end up after OAuth completes
});
```

## Process a Webhook

To process a webhook, you need to listen on the route(s) you provided during the Webhook registration process, then call the appropriate handler.  The library provides a convenient `process` method which takes care of calling the correct handler for the registered Webhook topics.

### Node.js

```typescript
  } // end of if (pathName === '/auth/callback')

  if (Shopify.Webhooks.Registry.isWebhookPath(pathName)) {
    let data: Buffer[] = [];
    request.on('data', function (chunk: Buffer) {
      data.push(chunk)
    }).on('end', function () {
      const buffer: Buffer = Buffer.concat(data);
      try {
        const result = Shopify.Webhooks.Registry.process({ headers: headers, body: buffer });

        response.writeHead(result.statusCode, result.headers);
        response.end();
      }
      catch (e) {
        console.log(e);

        response.writeHead(500);
        if (e instanceof Shopify.Errors.ShopifyError) {
          response.end(e.message);
        }
        else {
          response.end(`Failed to complete webhook processing: ${e.message}`);
        }
      }
    });

    return;
  } // end of if (Shopify.Webhooks.Registry.isWebhookPath(pathName))
}  // end of onRequest()

http.createServer(onRequest).listen(3000);
```

### Express

```typescript
app.post('/webhooks', async (req, res) => {
  try {
    const result = Shopify.Webhooks.Registry.process({ headers: req.headers, body: req.body });

    response.writeHead(result.statusCode, result.headers);
    response.end();
  }
  catch (e) {
    console.log(e);

    response.writeHead(500);
    if (e instanceof Shopify.Errors.ShopifyError) {
      response.end(e.message);
    }
    else {
      response.end(`Failed to complete webhook processing: ${e.message}`);
    }
  }
});
```

[Back to guide index](../index.md)
