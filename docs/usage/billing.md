# Billing for your app

Some partners might wish to charge merchants for using their app.
Shopify provides API endpoints that enable apps to trigger purchases in the Shopify platform, so that apps don't need to implement their own billing features.

This library provides support for billing apps by:

1. Checking if the store has already paid for the app
1. Triggering a payment if not

Learn more about billing in [our documentation](https://shopify.dev/apps/billing).

## Setting up for billing

To trigger the billing behaviour, you should set the `BILLING` value when calling `Shopify.Context.initialize`.
This setting is an object containing the following values:

| Parameter      | Type              | Required? | Default Value | Notes                                                              |
| -------------- | ----------------- | :-------: | :-----------: | ------------------------------------------------------------------ |
| `chargeName`   | `string`          |    Yes    |       -       | The charge name to display to the merchant                         |
| `amount`       | `number`          |    Yes    |       -       | The amount to charge                                               |
| `currencyCode` | `string`          |    Yes    |       -       | The currency to charge, currently only `"USD"` is supported        |
| `interval`     | `BillingInterval` |    Yes    |       -       | The interval for purchases, one of the BillingInterval enum values |

`BillingInterval` values:

- `OneTime`
- `Every30Days`
- `Annual`

## Checking for payment

The main method for billing is `Shopify.Billing.check`.
This method will take in the following parameters:

| Parameter | Type      | Required? | Default Value | Notes                                 |
| --------- | --------- | :-------: | :-----------: | ------------------------------------- |
| `session` | `Session` |    Yes    |       -       | The `Session` for the current request |
| `isTest`  | `boolean` |    Yes    |       -       | Whether this is a test purchase       |

And return the following:

| Parameter           | Type                   | Notes                                               |
| ------------------- | ---------------------- | --------------------------------------------------- |
| `hasPayment`        | `boolean`              | Whether the store has already paid for the app      |
| `confirmBillingUrl` | `string` / `undefined` | The URL to redirect to if payment is still required |

Here's a typical example of how to use `check`:

```ts
const {hasPayment, confirmBillingUrl} = await Shopify.Billing.check({
  session,
  isTest: true,
});

if (!hasPayment) {
  return redirect(confirmBillingUrl);
}

// Proceed with app logic
```

## When should the app check for payment

It's important to note that billing requires a session to access the API, which means that the app must actually be installed before it can request payment.

With the `check` method, your app can block access to specific endpoints, or to the app as a whole.
If you're gating access to the entire app, you should check for billing:

1. After OAuth completes, once you get the session back from `Shopify.Auth.validateAuthCallback`. This allows you to ensure billing takes place immediately after the app is installed.
   - Note that the merchant may refuse the payment at this point, but the app will already be installed. If your app is using offline tokens, sessions will be unique to a shop, so you can also use the latest session to check for access in full page loads.
1. When validating requests from the frontend. Since the check requires API access, you can only run it in requests that work with `Shopify.Utils.loadCurrentSession`.

[Back to guide index](../README.md)
