# shopify.session

This object contains functions used to authenticate apps, and redirect users to Shopify.

| Property                                      | Description                                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [getCurrentId](./getCurrentId.md)             | Extracts a Shopify session id for the current request when there is user interaction with the app.  |
| [getOfflineId](./getOfflineId.md)             | Builds the session id for the given shop, for background tasks that don't involve user interaction. |
| [decodeSessionToken](./decodeSessionToken.md) | Extracts and validates the session token JWT from App Bridge requests.                              |

[Back to shopifyApi](../shopifyApi.md)
