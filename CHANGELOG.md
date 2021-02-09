# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Webhooks types are now exported outside the library [#91](https://github.com/shopify/shopify-node-api/pull/91)
### Fixed
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
