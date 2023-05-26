# shopify.billing.check

Checks if a payment exists for any of the given plans, by querying the Shopify Admin API.

> **Note**: Depending on the number of requests your app handles, you might want to cache a merchant's payment status, but you should periodically call this method to ensure you're blocking unpaid access.

## Example (not using return objects)

```ts
// This can happen at any point after the merchant goes through the OAuth process, as long as there is a session object
// The session can be retrieved from storage using the session id returned from shopify.session.getCurrentId
async function billingMiddleware(req, res, next) {
  const sessionId = shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  const session = await getSessionFromStorage(sessionId);

  const hasPayment = await shopify.billing.check({
    session,
    plans: ['My billing plan'],
    isTest: true,
  });

  if (hasPayment) {
    next();
  } else {
    // Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
    const confirmationUrl = await shopify.billing.request({
      session,
      plan: 'My billing plan',
      isTest: true,
    });

    res.redirect(confirmationUrl);
  }
}

app.use('/requires-payment/*', billingMiddleware);
```

## Example (using return objects)

As of version `7.3.0`, `check` can also receive an optional `returnObject` parameter that adjusts what is returned by the method.

```ts
// This can happen at any point after the merchant goes through the OAuth process, as long as there is a session object
// The session can be retrieved from storage using the session id returned from shopify.session.getCurrentId
async function billingMiddleware(req, res, next) {
  const sessionId = shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  const session = await getSessionFromStorage(sessionId);

  const payments = await shopify.billing.check({
    session,
    plans: ['My billing plan'],
    isTest: true,
    returnObject: true,
  });

  // With `returnObject` set to `true, `payments` now has the following shape:
  // {
  //   hasActivePayment: boolean;
  //   oneTimePurchases: OneTimePurchase[];
  //   appSubscriptions: AppSubscription[];
  // }
  //
  // OneTimePurchase has the following properties:
  // {
  //   id: string;
  //   name: string;
  //   test: boolean;
  //   status: string;
  // }

  // AppSubscription has the properties...
  // {
  //   id: string;
  //   name: string;
  //   test: boolean;
  // }

  if (payments.hasActivePayment) {
    next();
  } else {
    // Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
    const billingResponse = await shopify.billing.request({
      session,
      plan: 'My billing plan',
      isTest: true,
      returnObject: true,
    });

    res.redirect(billingResponse.confirmationUrl);
  }
}

app.use('/requires-payment/*', billingMiddleware);
```

## Parameters

Receives an object containing:

### session

`Session` | :exclamation: required

The `Session` for the current request.

### plans

`string | string[]` | :exclamation: required

Which plans to look for.

### isTest

`boolean` | Defaults to `true`

Whether to look for test purchases only.

### returnObject

`boolean` | Defaults to `false`

Whether to return `true`/`false` to indicate that there's a valid payment, or to return a more detailed object (see below).

## Return

### if `returnObject` parameter is `false` (default)

`Promise<boolean>`

`true` if there is a payment for any of the given plans, and `false` otherwise.

### if `returnObject` parameter is `true`

`Promise<BillingCheckResponseObject>`

`BillingCheckResponseObject` has the following shape:

```ts
{
  hasActivePayment: boolean; // `true` if there's a payment for any of the given plans, `false` otherwise
  oneTimePurchases: OneTimePurchase[]; // array of one time purchases that have status `ACTIVE`
  appSubscriptions: AppSubscription[]; // array of current subscriptions
}
```

`OneTimePurchase` has the following properties:

```ts
{
  id: string; // unique string identifier for this purchase
  name: string; // name of the plan
  test: boolean; // `true` if the plan a test plan, `false` otherwise
  status: string; // status = `ACTIVE`
}
```

`AppSubscription` has the following properties:

```ts
{
  id: string; // unique string identifier for this purchase
  name: string; // name of the plan
  test: boolean; // `true` if the plan a test plan, `false` otherwise
}
```

[Back to shopify.billing](./README.md)
