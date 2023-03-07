async function handleFetch(request: Request): Promise<Response> {
  const {searchParams} = new URL(request.url);

  // The library will return a Response object
  return shopify.auth.begin({
    shop: shopify.utils.sanitizeShop(searchParams.get('shop'), true),
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: request,
  });
}
