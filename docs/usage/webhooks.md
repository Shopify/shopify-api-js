# Webhooks

If your application's functionality depends on knowing when events occur on a given shop, you need to register a webhook. You need an access token to register webhooks, so you must complete the OAuth process beforehand.

The Shopify library enables you to handle all webhooks in a single endpoint (see [Webhook processing](#webhook-processing)
) below), but you are not restricted to a single endpoint.
You can register multiple handlers for each topic, and the library will add, remove, and update the handlers with Shopify based on the app's configuration.

To subscribe to webhooks using this library, there are 3 main steps to take:

1. [Load your handlers](#load-your-handlers)
1. [Register webhooks with Shopify](#webhook-registration)
1. [Process incoming webhooks](#webhook-processing)

[Back to guide index](../../README.md#features)
