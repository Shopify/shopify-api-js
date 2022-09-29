# Billing for your app

Some partners might wish to charge merchants for using their app.
The Admin API provides endpoints that enable apps to trigger purchases in the Shopify platform, so that merchants can pay for apps as part of their Shopify payments.

This library provides support for billing apps by:

1. Checking if the store has already paid for the app
1. Triggering a charge for the merchant if the store has not paid

**Note**: this package uses the GraphQL Admin API to look for / request payment, which means an app must go through OAuth before it can charge merchants.

Learn more about [how billing works](https://shopify.dev/apps/billing).

## Setting up for billing

To trigger the billing behaviour, you'll need to set the `billing` value when calling `shopifyApi()`. For example:

```ts
import {
  shopifyApi,
  BillingInterval,
  BillingReplacementBehavior,
} from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: ...,
  apiSecretKey: ...,
  :
  :
  billing: {
    'My billing plan': {
      amount: 1,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
    },
  },
});
```

This setting is a collection of billing plans. Each billing plan allows the following properties:

| Parameter             | Type                         | Required? | Default Value | Notes                                                                                                                                                                                            |
| --------------------- | ---------------------------- | :-------: | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `amount`              | `number`                     |    Yes    |       -       | The amount to charge                                                                                                                                                                             |
| `currencyCode`        | `string`                     |    Yes    |       -       | The currency to charge, currently only `"USD"` is accepted                                                                                                                                       |
| `interval`            | `BillingInterval`            |    Yes    |       -       | `BillingInterval` value                                                                                                                                                                          |
| `trialDays`           | `number`                     |    No     |       -       | Give merchants this many days before charging. _Not available for `OneTime` plans_                                                                                                               |
| `replacementBehavior` | `BillingReplacementBehavior` |    No     |       -       | `BillingReplacementBehavior` value, see [the reference](https://shopify.dev/api/admin-graphql/2022-07/mutations/appSubscriptionCreate) for more information. _Not available for `OneTime` plans_ |

## Checking for payment

Once the app has an access token, you can call `shopify.billing.check` to look for an existing payment.

Here's a typical example of how apps might do that:

```ts
// This can happen at any point after the merchant goes through the OAuth process, as long as there is a session object
// The session can come from either shopify.session.getCurrent or shopify.session.getOffline
function billingMiddleware(req, res, next) {
  const session = shopify.session.getCurrent({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  const hasPayment = await shopify.billing.check({
    session,
    plans: ['My billing plan'],
    isTest: true,
  });

  if (hasPayment) {
    next();
  } else {
    // Either request payment now or redirect to plan selection page
  }
}

app.use('/requires-payment/*', billingMiddleware);
```

**Note**: the `check` method will always query Shopify's API because merchants can cancel subscriptions at any point. Depending on the number of requests your app handles, you might want to cache a merchant's payment status, but you should periodically call this method to ensure you're blocking unpaid access.

The `check` method accepts the following parameters:

| Parameter | Type                 | Required? | Default Value | Notes                                   |
| --------- | -------------------- | :-------: | :-----------: | --------------------------------------- |
| `session` | `Session`            |    Yes    |       -       | The `Session` for the current request   |
| `plans`   | `string \| string[]` |    Yes    |       -       | Which plans to look for                 |
| `isTest`  | `boolean`            |    No     |    `true`     | Whether to look for test purchases only |

It returns `true` if there is a payment for any of the given plans, and `false` otherwise.

## Requesting payment

When you want create a new charge for the merchant, you can call `shopify.billing.request` to instruct Shopify to create a charge.
Here are some typical examples of how apps might do that:

<div>Example single-plan setup - charge after OAuth completes

```ts
app.get('/auth/callback', async () => {
  const callback = await shopify.auth.callback({
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });

  // Check if we require payment ... see example above

  const confirmationUrl = await shopify.billing.request({
    session: callback.session,
    plan: 'My billing plan',
    isTest: true,
  });

  res.redirect(confirmationUrl);
});
```

</div><div>Example multi-plan setup - charge based on user selection

```ts
app.post('/api/select-plan', async (req, res) => {
  const session = shopify.session.getCurrent({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  const confirmationUrl = await shopify.billing.request({
    session,
    // Receive the selected plan from the frontend
    plan: req.body.selectedPlan,
    isTest: true,
  });

  res.redirect(confirmationUrl);
});
```

The `request` method accepts the following parameters:

| Parameter | Type      | Required? | Default Value | Notes                                                |
| --------- | --------- | :-------: | :-----------: | ---------------------------------------------------- |
| `session` | `Session` |    Yes    |       -       | The `Session` for the current request                |
| `plan`    | `string`  |    Yes    |       -       | Which plan to create a charge for                    |
| `isTest`  | `boolean` |    No     |    `true`     | If `true`, Shopify will not charge for this purchase |

It will return a `string` containing a URL - we don't redirect right away to make it possible for apps to run their own code after it creates the payment request.

The app **must** redirect the merchant to this URL so that they can confirm the charge before Shopify applies it.
The merchant will be sent back to your app's main page after the process is complete.

## When should the app check for payment?

As mentioned above, billing requires a session to access the API, which means that the app must actually be installed before it can request payment.

With the `check` method, your app can block access to specific endpoints, or to the app as a whole.
If you're gating access to the entire app, you should check for billing:

1. After OAuth completes, you'll get the session back from `shopify.auth.callback`. You can use the session to ensure billing takes place as part of the authentication flow.
1. When validating requests from the frontend. Since the check requires API access, you can only run it in requests that work with `shopify.session.getCurrent`.

**Note**: the merchant may refuse payment when prompted or cancel subscriptions later on, but the app will already be installed at that point. We recommend using [billing webhooks](https://shopify.dev/apps/billing#webhooks-for-billing) to revoke access for merchants when they cancel / decline payment.

[Back to guide index](../../README.md#features)
