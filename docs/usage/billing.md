# Configuring Billing

Some partners might wish to charge merchants for using their app.
The Admin API provides endpoints that enable apps to trigger purchases in the Shopify platform, so that merchants can pay for apps as part of their Shopify payments.

See the [billing reference](../reference/billing/README.md) for details on how to call those endpoints, using this configuration.

To trigger the billing behaviour, you'll need to set the `billing` value when calling `shopifyApi()`. For example:

```ts
import {
  shopifyApi,
  BillingInterval,
  BillingReplacementBehavior,
} from '@shopify/shopify-api';

const shopify = shopifyApi({
  // ...
  billing: {
    'My billing plan': {
      interval: BillingInterval.Every30Days,
      amount: 1,
      currencyCode: 'USD',
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    },
  },
});
```

This setting is a collection of billing plans. Each billing plan allows the following properties:

### One Time Billing Plans

| Parameter      | Type       | Required? | Default Value | Notes                                                      |
| -------------- | ---------- | :-------: | :-----------: | ---------------------------------------------------------- |
| `interval`     | `ONE_TIME` |    Yes    |       -       | `BillingInterval.OneTime` value                            |
| `amount`       | `number`   |    Yes    |       -       | The amount to charge                                       |
| `currencyCode` | `string`   |    Yes    |       -       | The currency to charge, currently only `"USD"` is accepted |

### Recurring Billing Plans

| Parameter             | Type                         | Required? | Default Value | Notes                                                                                                                                                        |
| --------------------- | ---------------------------- | :-------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `interval`            | `EVERY_30_DAYS`, `ANNUAL`    |    Yes    |       -       | `BillingInterval.Every30Days`, `BillingInterval.Annual` value                                                                                                |
| `amount`              | `number`                     |    Yes    |       -       | The amount to charge                                                                                                                                         |
| `currencyCode`        | `string`                     |    Yes    |       -       | The currency to charge, currently only `"USD"` is accepted                                                                                                   |
| `trialDays`           | `number`                     |    No     |       -       | Give merchants this many days before charging                                                                                                                |
| `replacementBehavior` | `BillingReplacementBehavior` |    No     |       -       | `BillingReplacementBehavior` value, see [the reference](https://shopify.dev/api/admin-graphql/2022-07/mutations/appSubscriptionCreate) for more information. |

### Usage Billing Plans

| Parameter             | Type                         | Required? | Default Value | Notes                                                                                                                                                        |
| --------------------- | ---------------------------- | :-------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `interval`            | `USAGE`                      |    Yes    |       -       | `BillingInterval.Usage`                                                                                                                                      |
| `amount`              | `number`                     |    Yes    |       -       | The maximum amount the merchant will be charged                                                                                                              |
| `currencyCode`        | `string`                     |    Yes    |       -       | The currency to charge, currently only `"USD"` is accepted                                                                                                   |
| `usageTerms`          | `string`                     |    Yes    |       -       | These terms stipulate the pricing model for the charges that an app creates.                                                                                 |
| `trialDays`           | `number`                     |    No     |       -       | Give merchants this many days before charging                                                                                                                |
| `replacementBehavior` | `BillingReplacementBehavior` |    No     |       -       | `BillingReplacementBehavior` value, see [the reference](https://shopify.dev/api/admin-graphql/2022-07/mutations/appSubscriptionCreate) for more information. |

## When should the app check for payment?

As mentioned above, billing requires a session to access the API, which means that the app must actually be installed before it can request payment.

With the `check` method, your app can block access to specific endpoints, or to the app as a whole.
If you're gating access to the entire app, you should check for billing:

1. After OAuth completes, you'll get the session back from [`shopify.auth.callback`](../reference/auth/callback.md). You can use the session to ensure billing takes place as part of the authentication flow.
1. When validating requests from the frontend. Since the check requires API access, you can only run it in requests that work with [`shopify.session.getCurrentId`](../reference/session/getCurrentId.md).

**Note**: the merchant may refuse payment when prompted or cancel subscriptions later on, but the app will already be installed at that point. We recommend using [billing webhooks](https://shopify.dev/apps/billing#webhooks-for-billing) to revoke access for merchants when they cancel / decline payment.

[Back to guide index](../../README.md#features)
