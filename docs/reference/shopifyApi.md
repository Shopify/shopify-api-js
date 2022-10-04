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
  logFunction: (severity, message) => {
    myAppsLogFunction(severity, message);
  },
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

### apiVersion

`ApiVersion` | Defaults to `LATEST_API_VERSION`

API version your app will be querying. E.g. `ApiVersion.January20`.

### sessionStorage

`SessionStorage` | :exclamation: **required** | Default _depends on runtime_

The storage strategy for your user sessions. Learn more about the [available strategies](../usage/customsessions.md).

### hostScheme

`"https" | "http"` | Defaults to `"https"`

The scheme for your app's public URL. `http` is only allowed if your app is running on `localhost`.

### isEmbeddedApp

`boolean` | Defaults to `true`

Whether your app will run within the Shopify Admin. Learn more about embedded apps with [`App Bridge`](https://shopify.dev/apps/tools/app-bridge/getting-started/app-setup).

### isPrivateApp

`boolean` | Defaults to `false`

Whether you are building a private app for a store.

### logFunction

`string` | Defaults to `undefined`

Function used by the library to log information using the app's infrastructure.

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
