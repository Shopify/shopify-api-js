app.get('/fetch-some-data', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  // Build a client and make requests with session.accessToken
  // See the REST, GraphQL, or Storefront API documentation for more information
});
