# shopify.session.decodeSessionToken

This method parses the JWT session token created by App Bridge, returning its payload.

## Example

```ts
app.get('/fetch-some-data', async (req, res) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader.replace('Bearer ', '');
  const payload = await shopify.session.decodeSessionToken(token);

  // Use the payload data
});
```

## Parameters

### token

`string` | :exclamation: required

The token to parse.

### options

`Object`

An object that allows the following fields:

#### checkAudience

`boolean` | Defaults to `true`

Whether the method should check the `aud` field in the decoded payload.
This should always be set to `true` if the token is coming from the Shopify Admin.

## Return

`Promise<JwtPayload>`

The parsed JWT payload, matching the payload contained in [session tokens](https://shopify.dev/docs/apps/auth/oauth/session-tokens#payload).

[Back to shopify.session](./README.md)
