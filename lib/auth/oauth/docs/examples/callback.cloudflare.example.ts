async function handleFetch(request: Request): Promise<Response> {
  const callback = await shopify.auth.callback<Headers>({
    rawRequest: request,
  });

  // You can now use callback.session to make API requests

  // The callback returns some HTTP headers, but you can redirect to any route here
  return new Response('', {
    status: 302,
    // Headers are of type [string, string][]
    headers: [...callback.headers, ['Location', '/my-apps-entry-page']],
  });
}
