# shopify.auth.tokenExchange

Begins the OAuth process by exchanging the current user's [session token](https://shopify.dev/docs/apps/auth/session-tokens) for an
[access token](https://shopify.dev/docs/apps/auth/access-token-types/online.md) to make authenticated Shopify API queries.

Learn more:
- [Token Exchange](../../guides/oauth.md#token-exchange)

## Examples

### Node.js
```ts
app.get('/auth', async (req, res) => {
  const shop = shopify.utils.sanitizeShop(req.query.shop, true)
  const headerSessionToken = getSessionTokenHeader(request);
  const searchParamSessionToken = getSessionTokenFromUrlParam(request);
  const sessionToken = (headerSessionToken || searchParamSessionToken)!;

  await shopify.auth.tokenExchange({
    sessionToken,
    shop,
    requestedTokenType: RequestedTokenType.OfflineAccessToken // or RequestedTokenType.OnlineAccessToken
  });
});

function getSessionTokenHeader(request){
  // Get session token from header `authorization`
  // Header Format is: "{"Authorization", "Bearer this-is-the-session-token"}
  // Return "this-is-the-session-token" from request header
}

function getSessionTokenFromUrlParam(request){
  // Get session token from the request URL param
  // The param is "id_token"
  // Example: "${app_url}/?shop=${shop}&id_token=this-is-the-session-token"
  // Return "this-is-the-session-token" from URL param
}
```

## Parameters

### sessionToken
`string` | :exclamation: required

The current user's session token, can be found in:
1. Request header:
```
{
    "Authorization": "Bearer this-is-the-session-token
}
```
2. URL Param:
```
'${APP_URL}/?shop=someshop.myshopify.com&id_token=this-is-the-session-token
```

### shop
`string` | :exclamation: required

A Shopify domain name in the form `{exampleshop}.myshopify.com`.

### requestedTokenType
`enum` | :exclamation: required

[`RequestedTokenType` in token-exchange.ts](https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/lib/auth/oauth/token-exchange.ts)

- `RequestedTokenType.OnlineAccessToken` - Learn more about [online tokens](https://shopify.dev/docs/apps/auth/access-token-types/online.md)
- `RequestedTokenType.OfflineAccessToken` - Learn more about [offline tokens](https://shopify.dev/docs/apps/auth/access-token-types/offline.md)

## Return

`Promise<Session>`

The new Shopify [Session object](../../../lib/session/session.ts), containing the API access token.

[Back to shopify.auth](./README.md)
