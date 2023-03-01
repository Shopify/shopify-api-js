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
