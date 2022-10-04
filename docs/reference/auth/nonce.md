# auth.nonce

Creates a random string of characters to serve as a link between the `begin` and `callback` requests, so that the library can compare the requests.

## Example

```ts
const nonce = shopify.auth.nonce();
```

## Return

`string`

A string of random characters.

[Back to index](./README.md)
