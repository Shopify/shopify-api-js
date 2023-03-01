app.get('/redirect/endpoint', (req, res) => {
  const redirectURL = shopify.auth.buildEmbeddedAppUrl(req.query.host);

  res.redirect(redirectURL);
});
