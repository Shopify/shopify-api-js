# shopify.webhooks.getHandlers

Fetches the configured handlers for the given topic.

## Example

```ts
const handlers = shopify.webhooks.getHandlers('PRODUCTS_CREATE');
// e.g. handlers[0].deliveryMethod
```

## Parameters

### topic

`string` | :exclamation: required

The topic to search for.

## Return

`WebhookHandler[]`

The list of webhook handlers configured for that topic.

[Back to shopify.webhooks](./README.md)
