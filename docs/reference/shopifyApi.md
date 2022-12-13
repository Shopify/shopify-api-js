# shopifyApi

Creates a new library object that provides all features needed for an app to interact with Shopify APIs.
Use this function when you [set up your app](../../README.md#getting-started).

## Example

```ts
import {shopifyApi, ApiVersion, BillingInterval} from '@shopify/shopify-api';
import {MemorySessionStorage} from '@shopify/shopify-api/session-storage/memory';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';

const shopify = shopifyApi({
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'localhost:4321',
  hostScheme: 'http',
  apiVersion: ApiVersion.July22,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
  isPrivateApp: false,
  userAgentPrefix: 'Custom prefix',
  privateAppStorefrontAccessToken: 'PrivateAccessToken',
  customShopDomains: ['*.my-custom-domain.io'],
  billing: {
    'My plan': {
      amount: 5.0,
      currencyCode: 'USD',
      interval: BillingInterval.OneTime,
    },
  },
  logger: {
    log: (severity, message) => {
      myAppsLogFunction(severity, message);
    },
  },
  restResources,
});
```

## Parameters

### apiKey

`string` | :exclamation: **required**

API key for the app. You can find it in the Partners Dashboard.

### apiSecretKey

`string` | :exclamation: **required**

API secret key for the app. You can find it in the Partners Dashboard.

### scopes

`string[] | AuthScopes` | :exclamation: **required**

[Shopify scopes](https://shopify.dev/api/usage/access-scopes) required for your app.

### hostName

`string` | :exclamation: **required**

App host name in the format `my-host-name.com`. Do **not** include the scheme or leading or trailing slashes.

### hostScheme

`"https" | "http"` | Defaults to `"https"`

The scheme for your app's public URL. `http` is only allowed if your app is running on `localhost`.

### apiVersion

`ApiVersion` | Defaults to `LATEST_API_VERSION`

API version your app will be querying. E.g. `ApiVersion.January20`.

### isEmbeddedApp

`boolean` | Defaults to `true`

Whether your app will run within the Shopify Admin. Learn more about embedded apps with [`App Bridge`](https://shopify.dev/apps/tools/app-bridge/getting-started/app-setup).

### isPrivateApp

`boolean` | Defaults to `false`

Whether you are building a private app for a store.

### userAgentPrefix

`string` | Defaults to `undefined`

Any prefix you wish to include in the `User-Agent` for requests made by the library.

### privateAppStorefrontAccessToken

`string` | Defaults to `undefined`

Fixed Storefront API access token for private apps.

### customShopDomains

`(RegExp | string)[]` | Defaults to `undefined`

Use this if you need to allow values other than `myshopify.com`.

### billing

`BillingConfig` | Defaults to `undefined`

Billing configurations. [See documentation](../usage/billing.md) for full description.

### restResources

`ShopifyRestResources`

Mounts the given REST resources onto the object. Must use the same version as `apiVersion`. Learn more about [using REST resources](../usage/rest.md#using-rest-resources).

### logger

`LoggerConfig`

Tweaks the behaviour of the package's internal logging to make it easier to debug applications.

#### log

`() => Promise<void>`

Async callback function used for logging, which takes in a `LogSeverity` value and a formatted `message`. Defaults to using `console` calls matching the severity parameter.

#### level

`LogSeverity` | Defaults to `LogSeverity.Info`

Minimum severity for which to trigger the log function.

#### httpRequests

`boolean` | Defaults to `false`

Whether to log **ALL** HTTP requests made by the package. Logs the requests at the `Debug` level.

#### timestamps

`boolean` | Defaults to `false`

Whether to add the current timestamp to every log call.

## Return

This function returns an object containing the following properties:

### config

The options used to set up the object, containing the parameters of this function.

### [auth](./auth/README.md)

Object containing functions to authenticate with Shopify APIs.

### [clients](./clients/README.md)

Object containing clients to access Shopify APIs.

### [session](./session/README.md)

Object containing functions to manage Shopify sessions.

### [webhooks](./webhooks/README.md)

Object containing functions to handle Shopify webhooks.

### [billing](./billing/README.md)

Object containing functions to enable apps to bill merchants.

### [utils](./utils/README.md)

Object containing general functions to help build apps.

### rest

Object containing OO representations of the Admin REST API.
See the [API reference documentation](https://shopify.dev/api/admin-rest) for details.

[Back to reference index](./README.md)
