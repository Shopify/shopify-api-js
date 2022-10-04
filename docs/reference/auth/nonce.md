<<<<<<< HEAD
# shopify.auth.nonce

Generates a string of 15 characters that are cryptographically random, suitable for short-lived values in cookies to aid validation of requests/responses.
=======
# auth.nonce

Creates a random string of characters to serve as a link between the `begin` and `callback` requests, so that the library can compare the requests.
>>>>>>> af919a3c (Add OAuth reference docs pages)

## Example

```ts
<<<<<<< HEAD
const state = shopify.auth.nonce();
=======
const nonce = shopify.auth.nonce();
>>>>>>> af919a3c (Add OAuth reference docs pages)
```

## Return

`string`

<<<<<<< HEAD
A random string of characters.

[Back to shopify.auth](./README.md)
=======
A string of random characters.

[Back to index](./README.md)
>>>>>>> af919a3c (Add OAuth reference docs pages)
