---
"@shopify/shopify-api": minor
---

Line Item Billing

Now with the future flag `unstable_lineItemBilling` you can specify multiple line items in a single billing request. This will allow you to create a single billing request for a subscription with both recurring and usage based app billing.

You will define the new billingConfig as follows.

```ts
const shopify = shopifyApp({
billing:  {
    "MultipleLineItems": {
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
      trialDays: 7,
      lineItems: [
        {
          interval: BillingInterval.Usage,
          amount: 30,
          currencyCode: "USD",
          terms: "per 1000 emails",
        },
        {
          interval: BillingInterval.Every30Days,
          amount: 30,
          currencyCode: "USD",
          discount: {
            durationLimitInIntervals: 3,
            value: {
              amount: 10,
            },
          },
        },
      ],
    },
  },
  futures: {
    unstable_lineItemBilling: true,
  }
});
```
