# shopify.billing.request

Creates a new charge for the merchant, for the given plan.

## Examples (not using return objects)

### Single-plan setup - charge after OAuth completes

```ts
app.get('/auth/callback', async () => {
  const callback = await shopify.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  // Check if we require payment, using shopify.billing.check()

  const confirmationUrl = await shopify.billing.request({
    session: callback.session,
    plan: 'My billing plan',
    isTest: true,
  });

  res.redirect(confirmationUrl);
});
```

### Multi-plan setup - charge based on user selection

```ts
app.post('/api/select-plan', async (req, res) => {
  const sessionId = shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  const session = await getSessionFromStorage(sessionId);

  const confirmationUrl = await shopify.billing.request({
    session,
    // Receive the selected plan from the frontend
    plan: req.body.selectedPlan,
    isTest: true,
  });

  res.redirect(confirmationUrl);
});
```

## Examples (using return objects)

As of version `7.3.0`, `request` can also receive an optional `returnObject` parameter that adjusts what is returned by the method.

### Single-plan setup - charge after OAuth completes

```ts
app.get('/auth/callback', async () => {
  const callback = await shopify.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  // Check if we require payment, using shopify.billing.check()

  const billingResponse = await shopify.billing.request({
    session: callback.session,
    plan: 'My billing plan',
    isTest: true,
    returnObject: true,
  });

  res.redirect(billingResponse.confirmationUrl);
});
```

### Multi-plan setup - charge based on user selection

```ts
app.post('/api/select-plan', async (req, res) => {
  const sessionId = shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  const session = await getSessionFromStorage(sessionId);

  const billingResponse = await shopify.billing.request({
    session,
    // Receive the selected plan from the frontend
    plan: req.body.selectedPlan,
    isTest: true,
    returnObject: true,
  });

  res.redirect(billingResponse.confirmationUrl);
});
```

## Parameters

Receives an object containing:

### session

`Session` | :exclamation: required

The `Session` for the current request.

### plan

`string` | :exclamation: required

Which plan to create a charge for.

### isTest

`boolean` | Defaults to `true`

If `true`, Shopify will not actually charge for this purchase.

### returnUrl

`string` | Defaults to embedded app's main page or hosted app's main page

Which URL to redirect the merchant to after the charge is confirmed.

### returnObject

`boolean` | Defaults to `false`

Whether to return the `confirmationUrl` as a `string`, or to return a more detailed object (see below).

### Plan Overrides

You can override any billing configuration fields at request time by passing them into your `billing.request` call.

```ts
const billingResponse = await shopify.billing.request({
  session: callback.session,
  plan: 'My billing plan',
  returnObject: true,
  isTest: true,
  trialDays: 4, // Overrides the trial days set in 'My billing plan'
  amount: 13, // Overrides the amount set in 'My billing plan'
});

res.redirect(billingResponse.confirmationUrl);
```

## Return

### if `returnObject` parameter is `false` (default)

`Promise<string>`

The URL to confirm the charge with the merchant.

> **Note** We don't redirect right away to make it possible for apps to run their own code after it creates the payment request.
>
> The app **must** redirect the merchant to this URL so that they can confirm the charge before Shopify applies it.
>
> After the process is complete, the merchant will be sent back to the page referenced by the `returnUrl` parameter, if set. Otherwise, the merchant will be sent to your app's main page.

### if `returnObject` parameter is `true`

`Promise<BillingRequestResponseObject>`

`BillingRequestResponseObject` has the following properties:

```ts
{
  confirmationUrl: string; // The URL to confirm the charge with the merchant, see note below
  oneTimePurchase?: OneTimePurchase; // will be populated if a one time purchase is requested
  appSubscription?: AppSubscription; // will be populated if a subscription is requested
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

> **Note** We don't redirect right away to make it possible for apps to run their own code after it creates the payment request.
>
> The app **must** redirect the merchant to this URL so that they can confirm the charge before Shopify applies it.
>
> After the process is complete, the merchant will be sent back to the page referenced by the `returnUrl` parameter, if set. Otherwise, the merchant will be sent to your app's main page.

[Back to shopify.billing](./README.md)
