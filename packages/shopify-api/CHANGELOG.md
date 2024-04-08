# Changelog

## 9.7.1

### Patch Changes

- a60c214: Fix type error in graphql error handler
- 513f9e6: Fixed an issue with the `RecurringApplicationCharge` REST resource currency type

## 9.7.0

### Minor Changes

- 3415a8c: Added support for the 2024-04 API version.
- c9dff9f: Add `Shop.current()` method to the REST resources

## 9.6.2

### Patch Changes

- b60c6c9: Fixes bug, that is returning the onlineAccessInfo field on the session, when the session if offline

## 9.6.1

### Patch Changes

- 96a0aab: Fix bug that was causing duplicate keys in Session when using FromPropertyArray with returnUserData = true

## 9.6.0

### Minor Changes

- b912ecd: Updates the Session class to handle the associated user information on the session object.

  Updates the Session `fromPropertyArray` to handle all user info fields. New optional argument `returnUserData`, (defaulted to `false`), will return the user data if it is apart of the property array. This will be defaulted to `true` in an upcoming version.

  <details>

  ```ts
  const sessionProperties = session.toPropertyArray(true);
  /*
    if sessionProperties has the following data...
    [
      ['id', 'online_session_id'],
      ['shop', 'online-session-shop'],
      ['state', 'online-session-state'],
      ['isOnline', true],
      ['scope', 'online-session-scope'],
      ['accessToken', 'online-session-token'],
      ['expires', 1641013200000],  // example = January 1, 2022, as number of milliseconds since Jan 1, 1970
      ['userId', 1],
      ['first_name', 'online-session-first-name'],
      ['last_name', 'online-session-last-name'],
      ['email', 'online-session-email'],
      ['locale', 'online-session-locale'],
      ['email_verified', false]
      ['account_owner', true,]
      ['collaborator', false],
      ],
   */

  const session = Session.fromPropertyArray(sessionProperties, true);
  /*
    ... then session will have the following data...
    {
      id: 'online_session_id',
      shop: 'online-session-shop',
      state: 'online-session-state',
      isOnline: true,
      scope: 'online-session-scope',
      accessToken: 'online-session-token',
      expires: 2022-01-01T05:00:00.000Z,  // Date object
      onlineAccessInfo: {
        associated_user: {
          id: 1,
          first_name: 'online-session-first-name'
          last_name: 'online-session-last-name',
          email: 'online-session-email',
          locale: 'online-session-locale',
          email_verified: false,
          account_owner: true,
          collaborator: false,
        },
      }
    }
   */
  ```

  </details>

  Updates the Session `toPropertyArray` to handle all user info fields. New optional argument `returnUserData`, (defaulted to `false`), will return the user data as part of property array object. This will be defaulted to `true` in an upcoming version.

  <details>

  ```ts
  const { session, headers } = shopify.auth.callback({
    rawRequest: req,
    rawResponse: res,
  });

  /*
    If session has the following data content...
    {
      id: 'online_session_id',
      shop: 'online-session-shop',
      state: 'online-session-state',
      isOnline: true,
      scope: 'online-session-scope',
      accessToken: 'online-session-token',
      expires: 2022-01-01T05:00:00.000Z,  // Date object
      onlineAccessInfo: {
        expires_in: 1,
        associated_user_scope: 'online-session-user-scope',
        associated_user: {
          id: 1,
          first_name: 'online-session-first-name',
          last_name: 'online-session-last-name',
          email: 'online-session-email',
          locale: 'online-session-locale',
          email_verified: true,
          account_owner: true,
          collaborator: false,
        },
      }
    }
   */

  const sessionProperties = session.toPropertyArray();
  /*
    ... then sessionProperties will have the following data...
     [
      ['id', 'online_session_id'],
      ['shop', 'online-session-shop'],
      ['state', 'online-session-state'],
      ['isOnline', true],
      ['scope', 'online-session-scope'],
      ['accessToken', 'online-session-token'],
      ['expires', 1641013200000],  // example = January 1, 2022, as number of milliseconds since Jan 1, 1970
      ['userId', 1], // New returns the user id under the userId key instead of onlineAccessInfo
      ['first_name', 'online-session-first-name'],
      ['last_name', 'online-session-last-name'],
      ['email', 'online-session-email'],
      ['locale', 'online-session-locale'],
      ['email_verified', false]
      ['account_owner', true,]
      ['collaborator', false],
      ],
   */
  ```

  </details>

- 87208ea: Add a context argument to webhooks process function to make it easier for Cloudflare apps (and others that might use a context object) to pass information to the handler.

## 9.5.1

### Patch Changes

- 1344258: Bumps jose from 5.2.2 to 5.2.3.

## 9.5.0

### Minor Changes

- 01371f7: Add function to authenticate fulfillment service requests

### Patch Changes

- 4e7c479: Show an INFO log for disabled future flags to encourage apps to migrate ahead of time, making major version bumps simpler.
- 13a230d: Enabled returning the full response object in `Customer.search()` and `GiftCard.search()`, so that apps can paginate through the results.
- f57712c: Refactor HMAC validation to use a common function.
- 01a803d: Reintroduced logging of HTTP requests for OAuth processes, which was incorrectly removed when the new clients were introduced.
  - @shopify/admin-api-client@0.2.8
  - @shopify/storefront-api-client@0.3.3

## 9.4.1

### Patch Changes

- @shopify/admin-api-client@0.2.7
- @shopify/storefront-api-client@0.3.2

## 9.4.0

### Minor Changes

- d6657e8: Return additional app subscription plan information, including the line item IDs

### Patch Changes

- 6eb8091: Updated dependency on `jose`
  - @shopify/admin-api-client@0.2.6
  - @shopify/storefront-api-client@0.3.1

## 9.3.2

### Patch Changes

- Updated dependencies [9df4bacf]
  - @shopify/storefront-api-client@0.3.0
  - @shopify/admin-api-client@0.2.5

## 9.3.1

### Patch Changes

- 661d52dd: Fix bug with creation of webhooks with subtopics

## 9.3.0

### Minor Changes

- 35e06823: Add webhook subtopic as an additional option field when creating webhook subscriptions

### Patch Changes

- fbae4bcc: Bumps compare-versions from 5.0.3 to 6.1.0.
- cc52aaca: Fix linked reference for session in token exchange docs
  - @shopify/admin-api-client@0.2.4
  - @shopify/storefront-api-client@0.2.4

## 9.2.0

### Minor Changes

- e2d4fee2: Update lineItemBilling future flag to v10. Current users of `unstable_lineItemBilling` will need to update to `v10_lineItemBilling` to continue using this feature.

  ```ts
  const shopify = shopifyApi({
    // ...
  future: {
    v10_lineItemBilling: true,
  });
  ```

### Patch Changes

- db7d9cff: Remove gating of the token exchange API behind the `unstable_tokenExchange` flag.

## 9.1.0

### Minor Changes

- 9c41d910: Added support for validating Flow extension requests, using `shopify.authenticate.flow`.

  Please see [the `flow` object documentation](./docs/reference/flow/README.md) for more information.

- 348b138a: Export GraphqlClient class from types

### Patch Changes

- 224fbf57: Fixed the types of the `balance` and `currency` fields in the `GiftCard` object.
- 0f0ffb8a: Updated global fetch types to more closely match reality
- Updated dependencies [0f0ffb8a]
  - @shopify/storefront-api-client@0.2.3
  - @shopify/admin-api-client@0.2.3

## 9.0.2

### Patch Changes

- 4d7f9a01: Update documentation with required shopifyApi params
- 1b4caf91: Return "body" field from GraphqlQueryError type
- Updated dependencies [b2414c2f]
  - @shopify/storefront-api-client@0.2.2
  - @shopify/admin-api-client@0.2.2

## 9.0.1

### Patch Changes

- fdd25e13: Fixed an issue in the `RestClient` class' `request` method, which was incorrectly made `private` instead of `protected.`
  - @shopify/admin-api-client@0.2.1
  - @shopify/storefront-api-client@0.2.1

## 9.0.0

### Major Changes

- 64f61414:

  > [!NOTE]
  > This change only affects apps that are using custom runtime adapters.
  > If you're using a default adapter from this package, you don't need to make this change.

  Changed `setAbstractFetchFunc` to accept a `fetch` API instead of one based on `NormalizedRequest` and `NormalizedResponse`.

  With this change, we can return a `Response` object for requests with the upcoming clients, which can help make the interface for requests more familiar to users.

  For more information and examples, see the [migration guide to v9](./docs/migrating-to-v9.md#changes-to-runtime-adapters).

- 7bd4be08: Rephrased `gdprTopics` to `privacyTopics` to account for other privacy regulations with data subject requests.

  This changes the name of the exported object.
  You can fix this by changing your `import` statements:

  Before:

  ```ts
  import { gdprTopics } from "@shopify/shopify-api";
  ```

  After:

  ```ts
  import { privacyTopics } from "@shopify/shopify-api";
  ```

### Minor Changes

- 83b15905: Allow access tokens to be marked as expired before actual expiry.
- 218f4521: Use the new GraphQL API clients in shopify-api to use all of the latest features, including automatic types for query / mutation return object and variables.

  For more information and examples, see the [migration guide to v9](./docs/migrating-to-v9.md#using-the-new-clients).

- 18781092: Updated shopify-api GraphQL clients' APIs to be closer to the underlying clients
- 4dd7612d: Underpinned the new REST client from `admin-api-client` into `shopify-api`, so apps can access it as a standalone client as well.
- 5e85e15b: Added support for the 2024-01 API version.
- 64cda80a: Add helpers to convert between shop admin URLs and legacy URLs. `sanitizeShop` utility method can now support shop admin URLs.

### Patch Changes

- Updated dependencies [88858305]
- Updated dependencies [218f4521]
- Updated dependencies [0286e7fe]
- Updated dependencies [18781092]
- Updated dependencies [2b9e06f6]
- Updated dependencies [194ddcf2]
- Updated dependencies [c9622cd7]
  - @shopify/admin-api-client@0.2.0
  - @shopify/storefront-api-client@0.2.0

## 8.1.1

### Patch Changes

- 880c9ddf: Add isExpired() and isScopeChanged() functions to Session class

## 8.1.0

### Minor Changes

- bf0664bb: Line Item Billing

  Now with the future flag `unstable_lineItemBilling` you can specify multiple line items in a single billing request. This will allow you to create a single billing request for a subscription with both recurring and usage based app billing.

  You will define the new billingConfig as follows.

  ```ts
  const shopify = shopifyApp({
    billing: {
      MultipleLineItems: {
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 7,
        lineItems: [
          {
            interval: BillingInterval.Usage,
            amount: 30,
            currencyCode: "USD",
            terms: "per 1000 emails",
          },
          {
            interval: BillingInterval.Every30Days,
            amount: 30,
            currencyCode: "USD",
            discount: {
              durationLimitInIntervals: 3,
              value: {
                amount: 10,
              },
            },
          },
        ],
      },
    },
    futures: {
      unstable_lineItemBilling: true,
    },
  });
  ```

- eae5a4a8: Introduce token exchange API for fetching access tokens. This feature is currently unstable and is hidden behind the `unstable_tokenExchange` future flag.

  :exclamation: To learn more about Token Exchange, see [Performing OAuth](./docs/guides/oauth.md)

## 8.0.2

### Patch Changes

- 58a20daf: Changed LATEST_API_VERSION export to point to October23. Thanks @SeanMythen!

## 8.0.1

### Patch Changes

- c8eebf30: Fixing publishing process to prevent empty packages

## 8.0.0

### Major Changes

- 737838dd: Removed support for Node 14, and removed existing code deprecations.

  <!-- markdown-link-check-disable -->

  For details on what's changed in this version, please see the [V8 migration guide](/packages/shopify-api/docs/migrating-to-v8.md).

  <!-- markdown-link-check-enable -->

### Minor Changes

- df5fb586: Added support for the `future` configuration option. This will allow apps to opt in to upcoming features without needing to install RC packages.
- cf60b3d1: Added support for the 2023-10 API version.

## 7.7.0

### Minor Changes

- 5da6add9 / 3382a958: Allow overriding billing configurations when requesting payment, so that apps can use different values for different requests.
- be262ba1: Allow using Session objects to create Storefront API clients that make requests using private access tokens.

### Patch Changes

- 8187031f: Fix CustomerAddress.all not returning anything

## 7.6.0

### Minor Changes

- d2df0b1b: validateHmac now accepts an optional second param. Use this to support HMAC validation for app proxy requests

## 7.5.2

### Patch Changes

- c2962537: Fix storefront client incorrectly setting private token as access token

## 7.5.1

### Patch Changes

- 6f075397: Allow not checking a session token payload's `aud` field to support tokens generated outside of the Shopify Admin.
- ce638203: Fixing host validation to work with unified admin shops

## 7.5.0

### Minor Changes

- 7a953a92: Adding support for 2023-07 API version

## 7.4.0

### Minor Changes

- 9735d0c3: Stop sending the privateMetafieldNamespaces field in webhook queries to avoid the API duplication warning, and added a new shopify.utils.versionPriorTo method to help with cases like this one where apps will need to stop doing something that was deprecated.
- 1d84c135: Add Web API runtime adapter

## 7.3.1

### Patch Changes

- a9ef2e20: Fix crypto module set up for node, so it doesn't break webpack apps
- 85e7478f: [Internal] Improved tracking of webhook registration GraphQL calls

## 7.3.0

### Minor Changes

- 52047d68: Add optional parameter to `billing.check` and `billing.request` to modify return value to be a more detailed object.
- 9b8ef033: Added Subscription cancel capabilities for App Billing. Fixes #771

  Usage:

  ```js
  const canceledSubscription = await shopify.billing.cancel({
    session,
    subscriptionId,
  });
  ```

  See [Billing Guide](docs/guides/billing.md) for more details.

### Patch Changes

- c700888a: Deprecated privateMetafieldNamespaces field in HTTP webhook configurations
- b6e9f83c: Add shop search param to default billing return URL for non-embedded apps
- 18671105: Return the performed operation for each handler when registering webhooks

## 7.2.0

### Minor Changes

- 57f31117: Add webhooks.validate method to support webhooks without callbacks
- 65eb416f: Export BillingCheckParams, BillingRequestParams and session.getJwtSessionId

## 7.1.0

### Minor Changes

- 1a64d96c: Added `returnUrl` as optional parameter to billing `request` function, improved `returnUrl` logic. See [documentation](docs/reference/billing/request.md#returnurl) of `returnUrl` parameter for more details.
- 89cca000: Discount functionality for App Billing. Fixes [#731](https://github.com/Shopify/shopify-api-js/issues/731)

### Patch Changes

- 8de3c783: Removed `setCrypto` function to simplify runtimes
- 2628a7fc: Add scopes validation for AuthScopes object and convert it to array. Fixes [#1208](https://github.com/Shopify/shopify-app-template-node/issues/1208), [1221](https://github.com/Shopify/shopify-app-template-node/issues/1221)
- d028ec0f: Replace `semver` with `compare-versions` lib to reduce dependency on nodejs builtin-libs
- 7dcecb65: [Custom store apps only] Add new `adminApiAccessToken` parameter to `config` for when `isCustomStoreApp` is `true`. If set, it will be used for API access. `apiSecretKey` should now be set to the custom store app's API secret key, which is used to validate the HMAC of webhook events received from Shopify for a custom store app. Fixes [#772](https://github.com/Shopify/shopify-api-js/issues/772), [#800](https://github.com/Shopify/shopify-api-js/issues/800)

  For apps that don't receive HTTP webhook events from Shopify, no change is required yet - `apiSecretKey` will be used for client authentication as the fallback option.

  Starting with the next major release

  - `adminApiAccessToken` will be mandatory for custom store apps and must be set to the Admin API access token
  - `apiSecretKey` will not be used for client authentication but must be set for HMAC validation of HTTP webhook events

  See [setting up a custom store app](docs/guides/custom-store-app.md) for more details.

- 450c9e7f: Add deprecation notice for removal of Node 14 support from next major release
- 9c095d12: Bumps [jose](https://github.com/panva/jose) from 4.13.1 to 4.14.1. See jose's [changelog](https://github.com/panva/jose/blob/main/CHANGELOG.md) for more details.
- f04f0f64: `apiKey` configuration parameter is no longer mandatory when `isCustomStoreApp` is `true`. Fixes [#782](https://github.com/Shopify/shopify-api-js/issues/782)
- 464fd4f2: Extend support for Event topic names
- e8966d50: Restoring REST resources for 2022-04, updates to certain resources for other API versions
- 8de6024f: [Fix] Forward original graphql error message to client
- f09417c4: Adds check for Google's Crawler in the authorization functions to prevent `CookieNotFound` error loops. Fixes [#686](https://github.com/Shopify/shopify-api-js/issues/686)
- cbffa2f6: Add trial days and replacement behavior to usage billing mutation. Fixes [#770](https://github.com/Shopify/shopify-api-js/issues/770)

## 7.0.0

### Major Changes

- 5a68e4a5: ⚠️ [Breaking] Return pagination info as part of .all() requests in REST resources, and remove the `[PREV|NEXT]_PAGE_INFO` static, thread unsafe attributes.
  Instead of returning a plain array of objects, it will now return an object containing that array, as well as the response headers and pagination info.

  This enables apps to use locally-scoped pagination info, which makes it possible to use pagination in a thread-safe way.

  You'll need to make 2 changes to use this version:

  1. Where you accessed resources from the response, you'll now access the `data` property.
  1. Where you accessed pagination data from the static variables, you'll now retrieve it from the response.

  ```ts
  const response = await shopify.rest.Product.all({
    /* ... */
  });

  // BEFORE
  const products: Product[] = response;
  const nextPageInfo = shopify.rest.Product.NEXT_PAGE_INFO;

  // AFTER
  const products: Product[] = response.data;
  const nextPageInfo = response.pageInfo?.nextPage;
  const responseHeaders = response.headers;
  ```

- fc2692f0: ⚠️ [Breaking] Removing deprecated code:

  - The `isPrivateApp` param from `shopifyApi()` was removed in favour of `isCustomStoreApp`.
  - The `isOnline` param from `shopify.auth.callback()` was removed, because it's now handled automatically.

- 8acc71da: Adding support for 2023-04 API version.

  ⚠️ [Breaking] Removing support for 2022-04 and 2022-07 API versions.

- 2096f9e4: The logger is now synchronous. This removes unnecessary `await`'s from functions that use the logger but functionally don't need to `await` anything else. `webhooks.addHandlers` is the main impacted public method (it was `async` only because of the logging mechanism).

  Apps that use the default logging methods (which send to `console`) will not be impacted by this change. Apps that implement their own loggers _may_ be impacted; async logging functions can still be used but they need to be handled as promises.

  ```ts
  // BEFORE
  const myLogFunction = async (severity, message) => {
    try {
      await MyService.log(severity, message);
      // After external call
    } catch {
      // Handle error
    }
  };

  // AFTER
  const myLogFunction = (severity, message) => {
    MyService.log(severity, message)
      .then(() => {
        // After external call
      })
      .catch(() => {
        // Handle error
      });
  };
  ```

### Patch Changes

- f06912d3: Bump jose from 4.11.2 to 4.13.1. See jose [changelog](https://github.com/panva/jose/blob/main/CHANGELOG.md) for details.
- 89847cac: Bump @shopify/network from 1.5.1 to 3.2.1. See [network changelog](https://github.com/Shopify/quilt/blob/main/packages/network/CHANGELOG.md) for details.
- 896ef0d8: Add response headers to `GraphqlQueryError`. Fixes #553
- 97449f9e: validateHmac will now check for a `hmac` or a `signature` query argument. Fixes #776

## [6.2.0] - 2023-02-15

- [Minor] Validate HMAC timestamp during OAuth [#671](https://github.com/Shopify/shopify-api-js/pull/671)
- [Patch] Improve logger call on different API versions [#664](https://github.com/Shopify/shopify-api-js/pull/664)
- [Patch] Prevent leakage of session object with REST resources [#690](https://github.com/Shopify/shopify-api-js/pull/690)
- [Patch] Improve typing of `PREV_PAGE_INFO` and `NEXT_PAGE_INFO` for REST resources [#701](https://github.com/Shopify/shopify-api-js/pull/701)
- [Minor] Change `isPrivateApp` configuration item to `isCustomStoreApp`, keep `isPrivateApp` but with a deprecation notice, add `shopify.session.customAppSession` method to create a session suitable for use with clients, REST resources in a store-specific custom app [#710](https://github.com/Shopify/shopify-api-js/pull/710)

## [6.1.0] - 2023-01-05

- [Minor] Allow api version overrides [#660](https://github.com/Shopify/shopify-api-js/pull/660)
- [Minor] Add support for 2023-01 API version [#659](https://github.com/Shopify/shopify-api-js/pull/659)
- [Patch] Force `/` path on session cookie [#658](https://github.com/Shopify/shopify-api-js/pull/658)
- [Patch] Don't ignore previous headers when beginning OAuth [#652](https://github.com/Shopify/shopify-api-js/pull/652)
- [Patch] Export missing client types from package [#648](https://github.com/Shopify/shopify-api-js/pull/648)
- [Patch] Add an info-level log of API library version and runtime environment string during initialization, to aid in troubleshooting [650](https://github.com/Shopify/shopify-api-js/pull/650)
- [Patch] Add new tracking SDK headers to Storefront API client [#649](https://github.com/Shopify/shopify-api-js/pull/649)

## [6.0.2] - 2022-12-08

- [Patch] Raise an `InvalidSession` if `Session.fromPropertyArray` receive an object that is not an array
- [Patch] Validate content of host parameter using sanitizeShop regex [#634](https://github.com/Shopify/shopify-api-js/pull/634)
- [Patch] Use the GraphQL format of webhook topics in the error message [#626](https://github.com/Shopify/shopify-api-js/pull/626)
- [Patch] Export deprecation notices for v5 main interface [#639](https://github.com/Shopify/shopify-api-js/pull/639)
- [Patch] Fixed an issue when parsing the response body in the AssignedFulfillmentOrder REST resource [#644](https://github.com/Shopify/shopify-api-js/pull/644)

## [6.0.1] - 2022-12-08

- [Patch] Auto-detect session type in auth callback, deprecate `isOnline` argument [#628](https://github.com/Shopify/shopify-api-js/pull/628)
- [Patch] Removed callback URL path check from webhook processing [#629](https://github.com/Shopify/shopify-api-js/pull/629)
- [Patch] Pass api version to webhook handlers [#630](https://github.com/Shopify/shopify-api-js/pull/630)

## [6.0.0] - 2022-12-06

- ⚠️ [Breaking] Major overhaul of `Shopify/shopify-api-node`, which is a complete breaking change across all surfaces of the library. See the [migration guide](./docs/migrating-to-v6.md) for instructions on how to update your app.

## [5.3.0] - 2022-12-05

- [Minor] Pass webhook id to handlers [#606](https://github.com/Shopify/shopify-api-js/pull/606)

## [5.2.0] - 2022-10-04

- Added support for the `2022-10` API version [#535](https://github.com/Shopify/shopify-api-js/pull/535)

## [5.1.0] - 2022-09-19

- Increased tolerance for expired JWT session tokens from 5s to 10s [#462](https://github.com/Shopify/shopify-api-js/pull/462)
- Add support for billing to the library [#449](https://github.com/Shopify/shopify-api-js/pull/449)
- Allow dynamically typing the body of REST and GraphQL request responses, so callers don't need to cast it [#447](https://github.com/Shopify/shopify-api-js/pull/447)
- Rather than create a temporary session in order to store a session id in a cookie for the OAuth transaction, we can store the `state` in the cookie instead, that can then be compared against the `state` provided by Shopify in the callback. [#438](https://github.com/Shopify/shopify-api-js/pull/438)

## [5.0.1] - 2022-08-03

- Make `sanitizeHost` validation more flexible [#446](https://github.com/Shopify/shopify-api-js/pull/446)

## [5.0.0] - 2022-07-28

- ⚠️ [Breaking] If a response from a GraphQL query contains an `errors` attribute, `GraphqlClient` will now throw a `GraphqlQueryError`. The caller can check the `error.response` attribute to see what was returned from the GraphQL API. [#431](https://github.com/Shopify/shopify-api-js/pull/431)
- ⚠️ [Breaking] Add utils functions to sanitize shops and hosts, and remove the `validateShop` utils function [#434](https://github.com/Shopify/shopify-api-js/pull/434)
- Allow passing in options for the Redis client used by the session storage strategy [#430](https://github.com/Shopify/shopify-api-js/pull/430)
- Fix User-Agent header sent in PUT / POST requests [#435](https://github.com/Shopify/shopify-api-js/pull/435)

## [4.2.0] - 2022-07-20

- Return a 401 instead of 403 when webhooks fail validation [#425](https://github.com/Shopify/shopify-api-js/pull/425)
- Add optional new methods `deleteSession` and `findSessionsByShop` to `SessionStorage`, with the corresponding implementations for the various session storage adapters [#418](https://github.com/Shopify/shopify-api-js/pull/418)
- Include subset of query body in API deprecation logs [#426](https://github.com/Shopify/shopify-api-js/pull/426)

## [4.1.0] - 2022-07-14

- Add new method to construct the host app URL [#419](https://github.com/Shopify/shopify-api-js/pull/419)

## [4.0.0] - 2022-07-04

- ⚠️ [Breaking] Add REST resources for July 2022 API version, add `LATEST_API_VERSION` constant, remove support and REST resources for July 2021 (`2021-07`) API version [#415](https://github.com/Shopify/shopify-api-js/pull/415)
- Add support for July 2022 API version [#409](https://github.com/Shopify/shopify-api-js/pull/409)

### Fixes

- Fix a bug where the PostgreSQL session storage always attempted to create the sessions table [#413](https://github.com/Shopify/shopify-api-js/pull/413)

## [3.1.3] - 2022-06-08

### Fixes

- Return instances of `Session` from session storages, not POJOs.

## [3.1.2] - 2022-06-07

### Added

- Store user id and expiration date of online tokens

### Fixes

- Properly parse a non-json HTTP response [#257](https://github.com/Shopify/shopify-api-js/issues/257)
- Don’t create a SQLite DB file if the SQLite storage is not used.

## [3.1.0] - 2022-05-16

### Added

- Support for specifying the URI scheme of the host [#385](https://github.com/Shopify/shopify-api-js/pull/385)
- Add optional `saving` parameter to `serialize` of `Base` class - default is `false` and will include read-only attributes in returned object; `true` used for `save` when committing via API to Shopify.

### Fixed

- Fixes [#363](https://github.com/Shopify/shopify-api-js/issues/363)
  - Webhooks `register` now checks for any attempt to register a GDPR topic (not done via API but by Partner Dashboard), provides an error message in response
  - For topics that don't exist, `register` checks the response from the initial API call for an `errors` field and returns accordingly

## [3.0.1] - 2022-04-11

### Added

- Allow REST resources to configure a deny list of attributes to be excluded when saving [#355](https://github.com/Shopify/shopify-api-js/pull/355)

## [3.0.0] - 2022-04-04

### Added

- ⚠️ [Breaking] Removing API version `2021-04` [#343](https://github.com/Shopify/shopify-api-js/pull/343)
- ⚠️ [Breaking] The `HttpResponseError` error and its flavours (all returned from HTTP requests) have been slightly altered:
  - They now take in a hash of values, and will always include the response code, body (as a string if the response is not JSON), and headers
  - All response fields are now contained within a `response` object, to make it easier to access them
- ⚠️ [Breaking] Update supported Admin API versions [#310](https://github.com/Shopify/shopify-api-js/pull/310)
- Allow full paths in REST requests [#301](https://github.com/Shopify/shopify-api-js/pull/301)

### Fixed

- ⚠️ [Breaking] Stop responding to the request in the GraphQL Proxy function, returning Shopify's response instead [#312](https://github.com/Shopify/shopify-api-js/pull/312)

  The examples below are in [express](https://expressjs.com/); you will now need to handle the response yourself.

  Before:

  ```js
  app.post("/graphql", async (req, res) => {
    await Shopify.Utils.graphqlProxy(req, res);
  });
  ```

  After:

  ```js
  app.post("/graphql", async (req, res) => {
    const response = await Shopify.Utils.graphqlProxy(req, res);
    res.status(200).send(response.body);
  });
  ```

## [2.1.0] - 2022-02-03

### Added

- Add support for January 2022 API version [#285](https://github.com/Shopify/shopify-api-js/pull/285)

## [2.0.0] - 2021-10-28

### Added

- Add a 5 second `clockTolerance` to fix `jwt not active` error [#227](https://github.com/Shopify/shopify-api-js/pull/227)
- ⚠️ [Breaking] Change default for OAuth.beginAuth to online sessions [#203](https://github.com/Shopify/shopify-api-js/pull/203)
  - see [oauth.md](./docs/guides/oauth.md) for updated docs
- ⚠️ [Breaking] Return and delete session in `validateAuthCallback` [#217](https://github.com/Shopify/shopify-api-js/pull/217)
  - see [oauth.md](./docs/guides/oauth.md) for updated usage
- ⚠️ [Breaking] Extract `addHandler` and `getHandler` methods for webhooks out of `register` [#205](https://github.com/Shopify/shopify-api-js/pull/205)
- ⚠️ [Breaking] Sessions no longer default to `false` for `isOnline` [#169](https://github.com/Shopify/shopify-api-js/pull/169)
- Required `Session` arguments must be passed to the constructor [#169](https://github.com/Shopify/shopify-api-js/pull/169)
- Allow `undefined` in `AuthScopes` [#169](https://github.com/Shopify/shopify-api-js/pull/169)

## [1.4.3] - 2021-10-22

### Fixed

- Fixed the HTTP client error messages to expand objects [#252](https://github.com/Shopify/shopify-api-js/pull/252)

## [1.4.2] - 2021-10-20

- Added `October21` to `ApiVersion` [#247](https://github.com/Shopify/shopify-api-js/pull/247)

## [1.4.1] - 2021-06-11

- Don't include extra params when calculating local hmac [#196](https://github.com/Shopify/shopify-api-js/pull/196)

## [1.4.0] - 2021-05-21

### Added

- Add support for registering Google Pub/Sub webhooks [#181](https://github.com/Shopify/shopify-api-js/pull/181)
- Added `July21` to `ApiVersion` [#181](https://github.com/Shopify/shopify-api-js/pull/181)

## [1.3.0] - 2021-05-12

### Added

- Added Storefront API client under `Shopify.Clients.Storefront`
- Add `isActive()` method to `Session` class to check if session is active, replace `Session` with `SessionInterface` when used as a type [#153](https://github.com/Shopify/shopify-api-js/pull/153)

## [1.2.1] - 2021-03-26

### Added

- Added `April21` to `ApiVersion` [#149](https://github.com/Shopify/shopify-api-js/pull/149)

## [1.2.0] - 2021-03-16

### Added

- Allow plain objects to be returned from the `loadCallback` on `CustomSessionStorage` [#126](https://github.com/Shopify/shopify-api-js/pull/126)
- Documentation and example code for `CustomSessionStorage` [#129](https://github.com/Shopify/shopify-api-js/pull/129)

### Fixed

- Throw a different error for a missing cookie upon OAuth return [#131](https://github.com/Shopify/shopify-api-js/pull/131)
- Improved documentation for GraphQL and Rest Clients. [#123](https://github.com/Shopify/shopify-api-js/pull/123)
- Made Docs directory more browseable in GitHub. [#136](https://github.com/Shopify/shopify-api-js/pull/136)
- Make sure `CustomSessionStorage` converts the `expires` field from a string to `Date`. [#132](https://github.com/Shopify/shopify-api-js/pull/132)
- Made `limit` optional for get-requests with query [#135](https://github.com/Shopify/shopify-api-js/pull/135)

## [1.1.0] - 2021-03-02

- Minor text/doc changes
- Added `2021-01` API version to enum. [#117](https://github.com/Shopify/shopify-api-js/pull/117)
- Allow retrieving offline sessions using `loadCurrentSession`. [#119](https://github.com/Shopify/shopify-api-js/pull/119)

## [1.0.0]

- Initial public release

## [0.5.0]

### Added

- Added `AuthScopes` value object to allow apps to easily check whether scopes have been updated. [#110](https://github.com/Shopify/shopify-api-js/pull/110)

### Fixed

- GraphQL Proxy attempts to parse the request body as JSON before passing it to the client. [#106](https://github.com/Shopify/shopify-api-js/pull/106)

## [0.4.0] - 2021-02-10

### Added

- Webhooks types are now exported outside the library [#91](https://github.com/Shopify/shopify-api-js/pull/91)
- Added support for private apps [#99](https://github.com/Shopify/shopify-api-js/pull/99)
- `USER_AGENT_PREFIX` added to Context, to add agent to all requests [#101](https://github.com/Shopify/shopify-api-js/pull/101)
- Add link to tutorial on how to rotate credentials if neccesary [#107](https://github.com/Shopify/shopify-api-js/pull/107)

### Fixed

- Export `withSession` utility method [#96](https://github.com/Shopify/shopify-api-js/pull/96)
- GraphQL Client appropriately handles queries with variables [#97](https://github.com/Shopify/shopify-api-js/pull/97)
- Use cryptographically random bytes to generate nonce [#98](https://github.com/Shopify/shopify-api-js/pull/98)
- Stop using `SameSite=none` cookies for OAuth, using `lax` instead [#100](https://github.com/Shopify/shopify-api-js/pull/100)

## [0.3.1] - 2021-02-03

### Fixed

- Fixed an issue when deleting the current session for embedded apps [#88](https://github.com/Shopify/shopify-api-js/pull/88)

## [0.3.0] - 2021-01-27

### Added

- Add `withSession` utility method [#83](https://github.com/Shopify/shopify-api-js/pull/83)

### Fixed

- Refactor library public interface [#87](https://github.com/Shopify/shopify-api-js/pull/87)
- Check if a webhook is registered before calling Shopify [#82](https://github.com/Shopify/shopify-api-js/pull/82)

## [0.2.2] - 2021-01-14

### Fixed

- Ensure that the OAuth session expiration matches the cookie expiration [#72](https://github.com/Shopify/shopify-api-js/pull/72) / [#73](https://github.com/Shopify/shopify-api-js/pull/73)

## [0.2.0] - 2021-01-13

- Preserve the OAuth cookie session for a few seconds so SPA can perform their initial load using it [#70](https://github.com/Shopify/shopify-api-js/pull/70)
- Session fetches now return `undefined` when a session is not available [#64](https://github.com/Shopify/shopify-api-js/pull/64)
- Add `deleteCurrentSession` utils method [#60](https://github.com/Shopify/shopify-api-js/pull/60)

## [0.1.0] - 2020-12-17

- Beta release

## [0.0.1] - 2020-12-17

- Test releasing scripts
- Start of Changelog
