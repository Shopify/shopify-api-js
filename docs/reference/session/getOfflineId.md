# shopify.session.getOfflineId

Builds a session id that can be used to load an offline session, if there was a [`auth.begin`](../auth/begin.md) call to create one.

**Warning**: This method **_does not_** perform any validation on the `shop` parameter because it is meant for background tasks.
You should **_never_** read the shop from user inputs or URLs.

## Example

```ts
async function myWebhookHandler(topic, shop) {
  const offlineSessionId = await shopify.session.getOfflineId(shop);

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(offlineSessionId);

  // Perform webhook actions
}
```

## Parameters

Receives an object containing:

### shop

`string` | :exclamation: required

The shop domain for the task.

## Return

`string`

The session id for the given shop.

[Back to shopify.session](./README.md)
