# shopify.billing.check

Checks if a payment exists for any of the given plans, by querying the Shopify Admin API.

> **Note**: Depending on the number of requests your app handles, you might want to cache a merchant's payment status, but you should periodically call this method to ensure you're blocking unpaid access.

## Example

```ts
// This can happen at any point after the merchant goes through the OAuth process, as long as there is a session object
// The session can be retrieved from storage using the session id returned from shopify.session.getCurrentId
async function billingMiddleware(req, res, next) {
  const session = res.locals.shopify.session;

  const hasPayment = await shopify.billing.check({
    session,
    plans: ['My billing plan'],
    isTest: true,
  });

  if (hasPayment) {
    next();
  } else {
    // Either request payment now or redirect to plan selection page, e.g.
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

## Return

`Promise<boolean>`

`true` if there is a payment for any of the given plans, and `false` otherwise.
