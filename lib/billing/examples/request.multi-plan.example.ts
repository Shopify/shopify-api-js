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
