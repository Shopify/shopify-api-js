# shopify.auth

This object contains functions used to authenticate apps, and redirect users to Shopify.

| Property                                        | Description                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [begin](./begin.md)                             | Redirect the user to Shopify to request authorization for the app.                                |
| [callback](./callback.md)                       | Receive Shopify's callback after the user approves the app installation.                          |
| [nonce](./nonce.md)                             | Generates a random string of characters to be used as the state value for OAuth.                  |
| [safeCompare](./safeCompare.md)                 | Compares two strings or arrays in a way that's safe against timing attacks.                       |
| [getEmbeddedAppUrl](./getEmbeddedAppUrl.md)     | Builds a URL to redirect the user back to the right Shopify surface based on the current request. |
| [buildEmbeddedAppUrl](./buildEmbeddedAppUrl.md) | Constructs the appropriate Shopify URL to redirect to.                                            |

[Back to shopifyApi](../shopifyApi.md)
