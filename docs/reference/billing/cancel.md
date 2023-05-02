# shopify.billing.cancel

Cancel a subscription plan by the given id.

## Example

### Cancel a subscription plan, given an id

The call to `cancel` will return an `CancelResponse` object, containing the current active subscriptions, and will throw a `BillingError` if any errors occur.

```ts
const subscriptionId = "gid://shopify/AppSubscription/1234567890"; // this can be obtained from a call to shopify.billing.subscriptions()
try {
  const canceledSubscription = await shopify.billing.cancel({
    session,
    subscriptionId,
    prorate: true,  // Whether to issue prorated credits for the unused portion of the app subscription. Defaults to true.
  })
} catch (error) {
  if (error typeof BillingError) {
    console.log(`Unable to cancel subscription ${subscriptionId}: ${JSON.stringify(error.errorData, null, 2)}`);
    // handle error appropriately
  }
}
// canceledSubscription will have the following shape:
// {
//   data: {
//     currentAppInstallation: ActiveSubscriptions;
//   };
// }
```

## Parameters

Receives an object containing:

### session

`Session` | :exclamation: required

The `Session` for the current request.

### subscriptionId

`string` | :exclamation: required

The id for the subscription to cancel.

### prorate

`boolean` | optional, defaults to `true`

Whether to issue prorated credits for the unused portion of the app subscription. Defaults to true.

## Return

`CancelResponse`

An object containing a `data` object with a list of the current app subscriptions after a successful cancel with the following shape:

```ts
{
  data: {
    currentAppInstallation: {
      activeSubscriptions: [
        {
          id: string;
          name: string;
          test: boolean;
        },
        {
          id: string;
          name: string;
          test: boolean;
        },
        // ...
      ];
    },
  },
}
```

If the call to `shopify.billing.cancel` throws a `BillingError`, the `BillingError` object will contain an array of error messages returned by the GraphQL API call in the `errorData` property.

[Back to shopify.billing](./README.md)
