# shopify.billing.subscriptions

Returns a list of subscription plans for which the app has already paid.

## Example

### List active subscriptions for current shop

```ts
app.get('/api/list-subscriptions', async (req, res) => {
  const sessionId = shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  const session = await getSessionFromStorage(sessionId);

  // return the list of currently active subscriptions for the shop
  // referenced in the current session
  const activeSubscriptions = await shopify.billing.subscriptions({
    session,
  });

  // activeSubscriptions will be an array of subscription details, e.g.,
  // [
  //   {
  //     "name": "My Active Subscription Charge",
  //     "id": "gid://shopify/AppSubscription/1234567890",
  //     "test": false
  //   },
  //   {
  //     "name": "My Test Subscription Charge",
  //     "id": "gid://shopify/AppSubscription/1234567890",
  //     "test": true
  //   },
  // ],
});
```

## Parameters

Receives an object containing:

### session

`Session` | :exclamation: required

The `Session` for the current request.

## Return

`ActiveSubscriptions`

An object with an `activeSubscriptions` property containing an array with app subscription details, with the following shape:

```ts
{
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
}
```

[Back to shopify.billing](./README.md)
