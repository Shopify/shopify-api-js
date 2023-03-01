app.get('/auth/callback', async (req, res) => {
  // The library will automatically set the appropriate HTTP headers
  const callback = await shopify.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  // You can now use callback.session to make API requests

  res.redirect('/my-apps-entry-page');
});
