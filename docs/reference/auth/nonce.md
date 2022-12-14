# shopify.auth.nonce

Generates a string of 15 characters that are cryptographically random, suitable for short-lived values in cookies to aid validation of requests/responses.

## Example

```ts
const state = shopify.auth.nonce();
```

## Return

`string`

A random string of characters.

[Back to shopify.auth](./README.md)
