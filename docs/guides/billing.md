# Configuring Billing

Some partners might wish to charge merchants for using their app.
The Admin API provides endpoints that enable apps to trigger purchases in the Shopify platform, so that merchants can pay for apps as part of their Shopify payments.

See the [billing reference](../reference/billing/README.md) for details on how to call those endpoints, using this configuration.

To trigger the billing behaviour, you'll need to set the `billing` value when calling `shopifyApi()`. For example, the following configuration will allow you to charge merchants $30 every 30 days. The first three charges will be discounted by $10, so merchants would be charged $20.

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
      amount: 30,
      currencyCode: 'USD',
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
      discount: {
        durationLimitInIntervals: 3,
        value: {
          amount: 10,
        },
      },
    },
  },
});
```

This setting is a collection of billing plans. Each billing plan allows the following properties:

### One Time Billing Plans

| Parameter      | Type       | Required? | Default Value | Notes                                                               |
| -------------- | ---------- | :-------: | :-----------: | ------------------------------------------------------------------- |
| `interval`     | `ONE_TIME` |    Yes    |       -       | `BillingInterval.OneTime` value                                     |
| `amount`       | `number`   |    Yes    |       -       | The amount to charge                                                |
| `currencyCode` | `string`   |    Yes    |       -       | The currency to charge, USD or merchant's shop currency<sup>1</sup> |

### Recurring Billing Plans

| Parameter                           | Type                         | Required? | Default Value | Notes                                                                                                                                                                                  |
| ----------------------------------- | ---------------------------- | :-------: | :-----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interval`                          | `EVERY_30_DAYS`, `ANNUAL`    |    Yes    |       -       | `BillingInterval.Every30Days`, `BillingInterval.Annual` value                                                                                                                          |
| `amount`                            | `number`                     |    Yes    |       -       | The amount to charge                                                                                                                                                                   |
| `currencyCode`                      | `string`                     |    Yes    |       -       | The currency to charge, USD or merchant's shop currency<sup>1</sup>                                                                                                                    |
| `trialDays`                         | `number`                     |    No     |       -       | Give merchants this many days before charging                                                                                                                                          |
| `replacementBehavior`               | `BillingReplacementBehavior` |    No     |       -       | `BillingReplacementBehavior` value, see [the reference](https://shopify.dev/docs/api/admin-graphql/latest/mutations/appSubscriptionCreate) for more information.                       |
| `discount.durationLimitInIntervals` | `number`                     |    No     |       -       | The number of billing intervals to apply the discount for. See [the reference](https://shopify.dev/docs/apps/billing/purchase-adjustments/subscription-discounts) for more information |
| `discount.value.amount`             | `number`                     |    No     |       -       | The amount of the discount in the currency that the merchant is being billed in.                                                                                                       |
| `discount.value.percentage`         | `number`                     |    No     |       -       | The percentage value of the discount.                                                                                                                                                  |

> **Note** `discount.value` can only include either `amount` or `percentage` but not both.

### Usage Billing Plans

| Parameter             | Type                         | Required? | Default Value | Notes                                                                                                                                                            |
| --------------------- | ---------------------------- | :-------: | :-----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interval`            | `USAGE`                      |    Yes    |       -       | `BillingInterval.Usage`                                                                                                                                          |
| `amount`              | `number`                     |    Yes    |       -       | The maximum amount the merchant will be charged                                                                                                                  |
| `currencyCode`        | `string`                     |    Yes    |       -       | The currency to charge, USD or merchant's shop currency<sup>1</sup>                                                                                              |
| `usageTerms`          | `string`                     |    Yes    |       -       | These terms stipulate the pricing model for the charges that an app creates.                                                                                     |
| `trialDays`           | `number`                     |    No     |       -       | Give merchants this many days before charging                                                                                                                    |
| `replacementBehavior` | `BillingReplacementBehavior` |    No     |       -       | `BillingReplacementBehavior` value, see [the reference](https://shopify.dev/docs/api/admin-graphql/latest/mutations/appSubscriptionCreate) for more information. |

1. Prior to `ApiVersion.April23` the currency code must be `USD`.

## When should the app check for payment?

As mentioned above, billing requires a session to access the API, which means that the app must actually be installed before it can request payment.

With the `check` method, your app can block access to specific endpoints, or to the app as a whole.
If you're gating access to the entire app, you should check for billing:

1. After OAuth completes, you'll get the session back from [`shopify.auth.callback`](../reference/auth/callback.md). You can use the session to ensure billing takes place as part of the authentication flow.
1. When validating requests from the frontend. Since the check requires API access, you can only run it in requests that work with [`shopify.session.getCurrentId`](../reference/session/getCurrentId.md).

**Note**: the merchant may refuse payment when prompted or cancel subscriptions later on, but the app will already be installed at that point. We recommend using [billing webhooks](https://shopify.dev/docs/apps/billing#webhooks-for-billing) to revoke access for merchants when they cancel / decline payment.

## Canceling a subscription

With the `cancel` method you'll be able to cancel a single subscription. First, you'll need to obtain the id for the subscription you wish to cancel. You can use the `subscriptions` method to obtain a list of current subscriptions.

As of version `7.3.0`, the `check` and `request` methods can take an optional `returnObject` parameter that modifies the return value to be an object that will include the payment/subscription plan `id`'s, among other data. This allows the app to save the id's for a future call to `cancel`. See the [billing reference](../reference/billing/README.md) for more details.

```js
const activeSubscriptions = await shopify.api.billing.subscriptions({
  session: res.locals.shopify.session,
});

// activeSubscriptions will be an array of subscription details, e.g.,
// [
//   {
//     "name": "My Shopify Subscription Charge",
//     "id": "gid://shopify/AppSubscription/1234567890",
//     "test": true
//   },
// ],
```

The `cancel` method will require the `session` object that is setup during authorization as well as the subscription id.

The call to `cancel` will return an `AppSubscription` object, containing the details of the subscription just cancelled successfully, and will throw a `BillingError` if any errors occur.

```js
// using the example activeSubscriptions response above...
const subscriptionId = activeSubscriptions[0].id; // "gid://shopify/AppSubscription/1234567890"
const canceledSubscription = await shopify.billing.cancel({
  session,
  subscriptionId,
  prorate: true, // Whether to issue prorated credits for the unused portion of the app subscription. Defaults to true.
});

// canceledSubscription will have the following shape:
// {
//   id: string;
//   name: string;
//   test: boolean;
// }
```

See the [billing reference](../reference/billing/README.md) for details on how to call the `subscriptions` and `cancel` endpoints.

[Back to guide index](../../README.md#guides)
