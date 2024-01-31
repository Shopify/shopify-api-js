# shopify.auth

This object contains functions used to authenticate apps, and redirect users to Shopify.

## Token Exchange

Learn more about [token exchange](../../guides/oauth.md#token-exchange).

| Property                                        | Description                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [tokenExchange](./tokenExchange.md)             | Performs token exchange to get access token from session token                                    |

## Authorization Code Grant Flow

Learn more about [authorization code grant flow](../../guides/oauth.md#authorization-code-grant-flow).

| Property                                        | Description                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [begin](./begin.md)                             | Redirect the user to Shopify to request authorization for the app.                                |
| [callback](./callback.md)                       | Receive Shopify's callback after the user approves the app installation.                          |
| [nonce](./nonce.md)                             | Generates a random string of characters to be used as the state value for OAuth.                  |

## Utility Functions

| Property                                        | Description                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [safeCompare](./safeCompare.md)                 | Compares two strings or arrays in a way that's safe against timing attacks.                       |
| [getEmbeddedAppUrl](./getEmbeddedAppUrl.md)     | Builds a URL to redirect the user back to the right Shopify surface based on the current request. |
| [buildEmbeddedAppUrl](./buildEmbeddedAppUrl.md) | Constructs the appropriate Shopify URL to redirect to.                                            |

🔙 [Back to shopifyApi](../shopifyApi.md)
