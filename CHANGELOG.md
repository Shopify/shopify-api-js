# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased
### Fixed
- Don't include extra params when calculating local hmac [#196](https://github.com/Shopify/shopify-node-api/pull/196)

## [1.4.0] - 2021-05-21
### Added
- Add support for registering Google Pub/Sub webhooks [#181](https://github.com/Shopify/shopify-node-api/pull/181)
- Added `July21` to `ApiVersion` [#181](https://github.com/Shopify/shopify-node-api/pull/181)

## [1.3.0] - 2021-05-12
### Added
- Added Storefront API client under `Shopify.Clients.Storefront`
- Add `isActive()` method to `Session` class to check if session is active, replace `Session` with `SessionInterface` when used as a type [#153](https://github.com/Shopify/shopify-node-api/pull/153)

## [1.2.1] - 2021-03-26
### Added
- Added `April21` to `ApiVersion` [#149](https://github.com/Shopify/shopify-node-api/pull/149)

## [1.2.0] - 2021-03-16

### Added
- Allow plain objects to be returned from the `loadCallback` on `CustomSessionStorage` [#126](https://github.com/shopify/shopify-node-api/pull/126)
- Documentation and example code for `CustomSessionStorage` [#129](https://github.com/shopify/shopify-node-api/pull/129)

### Fixed
- Throw a different error for a missing cookie upon OAuth return [#131](https://github.com/shopify/shopify-node-api/pull/131)
- Improved documentation for GraphQL and Rest Clients. [#123](https://github.com/Shopify/shopify-node-api/pull/123)
- Made Docs directory more browseable in GitHub. [#136](https://github.com/Shopify/shopify-node-api/pull/136)
- Make sure `CustomSessionStorage` converts the `expires` field from a string to `Date`. [#132](https://github.com/Shopify/shopify-node-api/pull/132)
- Made `limit` optional for get-requests with query [#135](https://github.com/Shopify/shopify-node-api/pull/135)

## [1.1.0] - 2021-03-02

- Minor text/doc changes
- Added `2021-01` API version to enum. [#117](https://github.com/shopify/shopify-node-api/pull/117)
- Allow retrieving offline sessions using `loadCurrentSession`. [#119](https://github.com/shopify/shopify-node-api/pull/119)

## [1.0.0]

- Initial public release

## [0.5.0]

### Added

- Added `AuthScopes` value object to allow apps to easily check whether scopes have been updated. [#110](https://github.com/shopify/shopify-node-api/pull/110)

### Fixed

- GraphQL Proxy attempts to parse the request body as JSON before passing it to the client. [#106](https://github.com/shopify/shopify-node-api/pull/106)

## [0.4.0] - 2021-02-10

### Added

- Webhooks types are now exported outside the library [#91](https://github.com/shopify/shopify-node-api/pull/91)
- Added support for private apps [#99](https://github.com/Shopify/shopify-node-api/pull/99)
- `USER_AGENT_PREFIX` added to Context, to add agent to all requests [#101](https://github.com/Shopify/shopify-node-api/pull/101)
- Add link to tutorial on how to rotate credentials if neccesary [#107](https://github.com/Shopify/shopify-node-api/pull/107)

### Fixed

- Export `withSession` utility method [#96](https://github.com/Shopify/shopify-node-api/pull/96)
- GraphQL Client appropriately handles queries with variables [#97](https://github.com/Shopify/shopify-node-api/pull/97)
- Use cryptographically random bytes to generate nonce [#98](https://github.com/Shopify/shopify-node-api/pull/98)
- Stop using `SameSite=none` cookies for OAuth, using `lax` instead [#100](https://github.com/Shopify/shopify-node-api/pull/100)

## [0.3.1] - 2021-02-03

### Fixed

- Fixed an issue when deleting the current session for embedded apps [#88](https://github.com/shopify/shopify-node-api/pull/88)

## [0.3.0] - 2021-01-27

### Added

- Add `withSession` utility method [#83](https://github.com/shopify/shopify-node-api/pull/83)

### Fixed

- Refactor library public interface [#87](https://github.com/shopify/shopify-node-api/pull/87)
- Check if a webhook is registered before calling Shopify [#82](https://github.com/shopify/shopify-node-api/pull/82)

## [0.2.2] - 2021-01-14

### Fixed

- Ensure that the OAuth session expiration matches the cookie expiration [#72](https://github.com/shopify/shopify-node-api/pull/72) / [#73](https://github.com/shopify/shopify-node-api/pull/73)

## [0.2.0] - 2021-01-13

- Preserve the OAuth cookie session for a few seconds so SPA can perform their initial load using it [#70](https://github.com/shopify/shopify-node-api/pull/70)
- Session fetches now return `undefined` when a session is not available [#64](https://github.com/shopify/shopify-node-api/pull/64)
- Add `deleteCurrentSession` utils method [#60](https://github.com/shopify/shopify-node-api/pull/60)

## [0.1.0] - 2020-12-17

- Beta release

## [0.0.1] - 2020-12-17

- Test releasing scripts
- Start of Changelog
