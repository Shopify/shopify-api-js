# shopify.billing.request

Creates a new charge for the merchant, for the given plan.

## Examples

### Single-plan setup - charge after OAuth completes

```ts
app.get('/auth/callback', async () => {
  const callback = await shopify.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  // Check if we require payment

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
  // getSessionFromStorage() must be provided by application
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

## Return

`string`

The URL to confirm the charge with the merchant - we don't redirect right away to make it possible for apps to run their own code after it creates the payment request.

The app **must** redirect the merchant to this URL so that they can confirm the charge before Shopify applies it.
The merchant will be sent back to your app's main page after the process is complete.
