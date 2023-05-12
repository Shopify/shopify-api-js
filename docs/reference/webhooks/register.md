# shopify.webhooks.register

Registers all of the configured handlers using [`webhooks.addHandlers`](./addHandlers.md) with Shopify.

You can safely call this method every time a shop logs in, as it will add, update, or remove subscriptions as necessary so that all configured handlers are registered.

> **Note**: Webhooks can only be registered after the merchant has installed your app, so the best place to register webhooks is after OAuth completes.

## Example

```ts
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
```

## Parameters

### session

`Session` | :exclamation: required

The session to use for requests.

### allowMultipleHandlers

`bool` | default: `false`

If true it will not delete any existing webhooks that are not configured in the current session.

## Return

`RegisterReturn`

Returns an object containing a list of results, indexed by topic. Each entry in the list contains:

### success

`bool`

Whether the registration was successful.

### result

`array`

The body from the Shopify request to register the webhook.

> **Note**: This object will only contain results for a handler if any of its information was updated with Shopify.

[Back to shopify.webhooks](./README.md)
