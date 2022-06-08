# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.1.3] - 2022-06-08

### Fixes
- Return instances of `Session` from session storages, not POJOs.

## [3.1.2] - 2022-06-07

### Added
- Store user id and expiration date of online tokens

### Fixes
- Properly parse a non-json HTTP response [#257](https://github.com/Shopify/shopify-node-api/issues/257)
- Don’t create a SQLite DB file if the SQLite storage is not used.


## [3.1.0] - 2022-05-16

### Added
- Support for specifying the URI scheme of the host [#385](https://github.com/Shopify/shopify-node-api/pull/385)
- Add optional `saving` parameter to `serialize` of `Base` class - default is `false` and will include read-only attributes in returned object; `true` used for `save` when committing via API to Shopify.

### Fixed
- Fixes [#363](https://github.com/Shopify/shopify-node-api/issues/363)
  - Webhooks `register` now checks for any attempt to register a GDPR topic (not done via API but by Partner Dashboard), provides an error message in response
  - For topics that don't exist, `register` checks the response from the initial API call for an `errors` field and returns accordingly

## [3.0.1] - 2022-04-11

### Added

- Allow REST resources to configure a deny list of attributes to be excluded when saving [#355](https://github.com/Shopify/shopify-node-api/pull/355)

## [3.0.0] - 2022-04-04

### Added

- ⚠️ [Breaking] Removing API version `2021-04` [#343](https://github.com/Shopify/shopify-node-api/pull/343)
- ⚠️ [Breaking] The `HttpResponseError` error and its flavours (all returned from HTTP requests) have been slightly altered:
  - They now take in a hash of values, and will always include the response code, body (as a string if the response is not JSON), and headers
  - All response fields are now contained within a `response` object, to make it easier to access them
- ⚠️ [Breaking] Update supported Admin API versions [#310](https://github.com/Shopify/shopify-node-api/pull/310)
- Allow full paths in REST requests [#301](https://github.com/Shopify/shopify-node-api/pull/301)

### Fixed

- ⚠️ [Breaking] Stop responding to the request in the GraphQL Proxy function, returning Shopify's response instead [#312](https://github.com/Shopify/shopify-node-api/pull/312)

  The examples below are in [express](https://expressjs.com/); you will now need to handle the response yourself.

  Before:

  ```js
  app.post('/graphql', async (req, res) => {
    await Shopify.Utils.graphqlProxy(req, res);
  });
  ```

  After:

  ```js
  app.post('/graphql', async (req, res) => {
    const response = await Shopify.Utils.graphqlProxy(req, res);
    res.status(200).send(response.body);
  });
  ```

## [2.1.0] - 2022-02-03

### Added

- Add support for January 2022 API version [#285](https://github.com/Shopify/shopify-node-api/pull/285)

## [2.0.0] - 2021-10-28

### Added

- Add a 5 second `clockTolerance` to fix `jwt not active` error [#227](https://github.com/Shopify/shopify-node-api/pull/227)
- [Breaking] Change default for OAuth.beginAuth to online sessions [#203](https://github.com/Shopify/shopify-node-api/pull/203)
  - see [oauth.md](https://github.com/Shopify/shopify-node-api/blob/main/docs/usage/oauth.md) for updated docs
- [Breaking] Return and delete session in `validateAuthCallback` [#217](https://github.com/Shopify/shopify-node-api/pull/217)
  - see [oauth.md](https://github.com/Shopify/shopify-node-api/blob/main/docs/usage/oauth.md) for updated usage
- [Breaking] Extract `addHandler` and `getHandler` methods for webhooks out of `register` [#205](https://github.com/Shopify/shopify-node-api/pull/205)
- [Breaking] Sessions no longer default to `false` for `isOnline` [#169](https://github.com/Shopify/shopify-node-api/pull/169)
- Required `Session` arguments must be passed to the constructor [#169](https://github.com/Shopify/shopify-node-api/pull/169)
- Allow `undefined` in `AuthScopes` [#169](https://github.com/Shopify/shopify-node-api/pull/169)

## [1.4.3] - 2021-10-22

### Fixed

- Fixed the HTTP client error messages to expand objects [#252](https://github.com/Shopify/shopify-node-api/pull/252)

## [1.4.2] - 2021-10-20

- Added `October21` to `ApiVersion` [#247](https://github.com/Shopify/shopify-node-api/pull/247)

## [1.4.1] - 2021-06-11

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
