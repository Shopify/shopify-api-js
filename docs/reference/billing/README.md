# shopify.billing

This object contains functions used to create and check billing charges with Shopify, based on the plans defined in the [`billing`](../shopifyApi.md#billing) configuration.

Learn more about [how billing on Shopify works](https://shopify.dev/docs/apps/billing).

> **Note**: this package uses the GraphQL Admin API to look for and/or request payments, which means an app must go through OAuth before it can charge merchants.

| Property                            | Description                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| [check](./check.md)                 | Checks if the current shop has paid for any of the given plans.      |
| [request](./request.md)             | Requests a new payment for the given payment plan.                   |
| [cancel](./cancel.md)               | Cancel a subscription plan using the given subscription id.          |
| [subscriptions](./subscriptions.md) | Get a list of subscription plans that the current shop has paid for. |

[Back to shopifyApi](../shopifyApi.md)
