# shopify.session.getJwtSessionId

Builds the session ID for the given shop and user. Use this for getting online tokens.

It's likely you will use this with a session token, which your server received from an authorization header.

## Example

```ts
function getOnlineSessionId(request: Request) {
  const token = request.headers.get('authorization').replace('Bearer ', '');
  const jwt = await api.session.decodeSessionToken(token);
  const dest = new URL(jwt.dest);
  const shop = dest.hostname;
  const userId = jwt.sub;
  const sessionId = api.session.getJwtSessionId(shop, userId);

  return sessionId;
}
```

## Parameters

### shop

`string` | :exclamation: required

The shop you want to get a session for

### userId

`string` | :exclamation: required

The user ID you want to get a session for.

## Return

`Promise<string>`

The session ID for an online token. You can use this to load a session from a storage adaptor. For example:

```
function getOnlineSession(request: Request) {
  const sessionStorage = new PrismaSessionStorage(prisma)
  const sessionId = getOnlineSessionId(request)
  const session = await sessionStorage.loadSession(sessionId);

  return session
}
```

[Back to shopify.session](./README.md)
