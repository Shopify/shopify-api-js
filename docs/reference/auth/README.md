# shopify.auth

This object contains functions used to authenticate apps, and redirect users to Shopify.

## shopify.auth.[begin](./begin.md)

Redirect the user to Shopify to request authorization for the app.

## shopify.auth.[callback](./callback.md)

Receive Shopify's callback after the user approves the app installation.

## shopify.auth.[nonce](./nonce.md)

Generates a random string of characters to be used as the state value for OAuth.

## shopify.auth.[safeCompare](./safeCompare.md)

Compares two strings or arrays in a way that's safe against timing attacks.

## shopify.auth.[getEmbeddedAppUrl](./getEmbeddedAppUrl.md)

Builds a URL to redirect the user back to the right Shopify surface based on the current request.

## shopify.auth.[buildEmbeddedAppUrl](./buildEmbeddedAppUrl.md)

Constructs the appropriate Shopify URL to redirect to.
