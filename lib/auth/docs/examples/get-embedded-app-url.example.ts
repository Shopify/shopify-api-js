app.get('/redirect/endpoint', async (req, res) => {
  const redirectURL = await shopify.auth.getEmbeddedAppUrl({
    rawRequest: req,
    rawResponse: res,
  });

  res.redirect(redirectURL);
});
