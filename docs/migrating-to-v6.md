# Migrating to v6

We've extended the functionality of this library so that it can now run on JavaScript runtimes other than Node.js, as long as there is a runtime adapter for it.

To migrate your Node.js app to use this new adaptable version of the API library, you'll need to add an import of the node adapter in your app, _before_ importing the library functions themselves.
Note you only need to import this once in your app.

```js
import '@shopify/shopify-api/adapters/node';
import { ... } from '@shopify/shopify-api';
```

This automatically sets the library up to run on the Node.js runtime.

In addition to making the library compatible with multiple runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
Once you set up your app with the right adapter, you can follow the next sections for instructions on how to upgrade the individual methods that were changed.

**Note**: the examples below are assuming your app is running using Express.js, but the library still works with different frameworks as before.

## Table of contents

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Renamed `Shopify.Context` to `shopify.config`](#renamed-shopifycontext-to-shopifyconfig)
- [Passing in framework requests / responses](#passing-in-framework-requests--responses)
- [Changes to `Session` and `SessionStorage`](#changes-to-session-and-sessionstorage)
- [Changes to authentication functions](#changes-to-authentication-functions)
- [Changes to API clients](#changes-to-api-clients)
- [Billing](#billing)
- [Utility functions](#utility-functions)

## Renamed `Shopify.Context` to `shopify.config`

We've refactored the way objects are exported by this library, to remove the main "static" `Shopify` object with global settings stored in `Shopify.Context`.

Even though that object has no business logic, the fact that the configuration is global made it hard to mock for tests and to set up multiple instances of it.
Part of the changes we made were to create a library object with local settings, to make it feel more idiomatic and easier to work with.

In general, those changes don't affect any library functionality, unless explicitly mentioned below.
You will probably need to search and replace most of the imports to this library to leverage the new approach, but it should not require any functionality changes.

1. Apps no longer set up the library with `Shopify.Context.initialize()`. The new library object constructor takes in the configuration.
   <div>Before

   ```ts
   import {Shopify} from '@shopify/shopify-api';
   Shopify.Context.initialize({ API_KEY: '...', ... });
   ```

   </div><div>After

   ```ts
   import {shopifyApi} from '@shopify/shopify-api';
   const shopify = shopifyApi({ apiKey: '...', ... });
   ```

   </div>

1. `Shopify.Context` was replaced with `shopify.config`, and config options are now `camelCase` instead of `UPPER_CASE`.
   <div>Before

   ```ts
   console.log(Shopify.Context.API_KEY);
   ```

   </div><div>After

   ```ts
   console.log(shopify.config.apiKey);
   ```

   </div>

1. `Shopify.Context.throwIfUnitialized` and `UninitializedContextError` were removed.

## Passing in framework requests / responses

In the Node-only library, apps would generally call library functions as follows:

```ts
app.get(
  '/path',
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const redirectUri = await Shopify.Auth.beginAuth(req, res);
    res.redirect(redirectUri);
  },
);
```

To enable the library to work across runtimes, we've abstracted these objects into `rawRequest` and `rawResponse?`.
As a general rule, you'll need to update calls like above to:

```ts
app.get(
  '/path',
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Library will automatically trigger the redirect in res
    await shopify.auth.begin({rawRequest: req, rawResponse: res});
  },
);
```

For runtimes that expect handlers to _return_ a `Response` object, rather than passing it in as a parameter (like CloudFlare workers), you can skip the `rawResponse` value.

```ts
async function handleFetch(request: Request): Promise<Response> {
  // Library will return the Response object
  return shopify.auth.begin({rawRequest: request});
},
```

## Changes to `Session` and `SessionStorage`

1. `SessionStorage` is no longer an interface, but an abstract class. If you're using your own implementation of the interface, you need to replace `implements SessionStorage` with `extends SessionStorage`.
   <div>Before

   ```ts
   import {SessionStorage} from '@shopify/shopify-api';
   class MySessionStorage implements SessionStorage {
     // ...
   }
   ```

   </div><div>After

   ```ts
   import {SessionStorage} from '@shopify/shopify-api';
   class MySessionStorage extends SessionStorage {
     // ...
   }
   ```

   </div>

1. Since not all adapters work on all runtimes, they've been separated in their own import path. To use the provided storage options, you can import them directly using the following pattern:
   <div>Before

   ```ts
   import {MemorySessionStorage} from '@shopify/shopify-api';
   ```

   </div><div>After

   ```ts
   import {MemorySessionStorage} from '@shopify/shopify-api/session-storage/memory';
   ```

   </div>

1. The `Session` constructor now takes an object which allows all properties of a session, and `Session.cloneSession` was removed since we can use a session as arguments for the clone.
   <div>Before

   ```ts
   import {Session} from '@shopify/shopify-api';
   const session = new Session(
     'session-id',
     'shop.myshopify.com',
     'state1234',
     true,
   );
   session.accessToken = 'token';
   const clone = Session.cloneSession(session, 'newId');
   ```

   </div><div>After

   ```ts
   import {Session} from '@shopify/shopify-api';
   const session = new Session({
     id: 'session-id',
     shop: 'shop.myshopify.com',
     state: 'state1234',
     isOnline: true,
     accessToken: 'token',
   });
   const clone = new Session({...session, id: 'newId'});
   ```

   </div>

## Changes to authentication functions

The OAuth methods still behave the same way, but we've updated their signatures to make it easier to work with them. See the [updated OAuth instructions](./usage/oauth.md) for a complete example.

1. `Shopify.Auth.beginAuth()` is now `shopify.auth.begin()`, it takes in an object, and it now also triggers a redirect response to the correct endpoint.
   <div>Before

   ```ts
   const redirectUri = await Shopify.Auth.beginAuth(
     req,
     res,
     'my-shop.com',
     '/auth/callback',
     true,
   );
   // App had to redirect to the returned URL
   res.redirect(redirectUri);
   ```

   </div><div>After

   ```ts
   // Library handles redirecting
   await shopify.auth.begin({
     shop: 'my-shop.com',
     callbackPath: '/auth/callback',
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Auth.validateAuthCallback()` is now `shopify.auth.callback()`, it now takes an object with an `isOnline` value, but the `query` argument is no longer necessary - it will be read from the request. This method will set the appropriate response headers.
   <div>Before

   ```ts
   const session = Shopify.Auth.validateAuthCallback(
     req,
     res,
     req.query as AuthQuery,
   );
   // session.accessToken...
   res.redirect('url');
   ```

   </div><div>After

   ```ts
   const callbackResponse = shopify.auth.callback({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   // callbackResponse.session.accessToken...
   res.redirect('url');
   ```

   </div>

1. The `shopify.auth` component only exports the key functions now to make the API simpler, so `getCookieSessionId`, `getJwtSessionId`, `getOfflineSessionId`, `getCurrentSessionId` are no longer exported. They're internal library functions.

1. There is a new `shopify.session` object which contains session-specific functions. See the [Utility functions](#utility-functions) section for the specific changes.

## Changes to API clients

The API clients this package provides now take an object of arguments, rather than positional ones. The returned objects behave the same way they did before, so you'll only need to update the contructor calls.

1. REST Admin API client:

   <div>Before

   ```ts
   const restClient = new Shopify.Clients.Rest(
     session.shop,
     session.accessToken,
   );
   ```

   </div><div>After

   ```ts
   const restClient = new shopify.clients.Rest({
     domain: session.shop,
     accessToken: session.accessToken,
   });
   ```

   </div>

1. GraphQL Admin API client:

   <div>Before

   ```ts
   const graphqlClient = new Shopify.Clients.Graphql(
     session.shop,
     session.accessToken,
   );
   ```

   </div><div>After

   ```ts
   const graphqlClient = new shopify.clients.Graphql({
     domain: session.shop,
     accessToken: session.accessToken,
   });
   ```

   </div>

1. Storefront API client:

   <div>Before

   ```ts
   const storefrontClient = new Shopify.Clients.Storefront(
     session.shop,
     storefrontAccessToken,
   );
   ```

   </div><div>After

   ```ts
   const storefrontClient = new shopify.clients.Storefront({
     domain: session.shop,
     accessToken: storefrontAccessToken,
   });
   ```

   </div>

The `HttpResponseError`, `HttpRetriableError`, `HttpInternalError`, and `HttpThrottlingError` classes were updated to include more information on the errors.

<div>Before

```ts
catch (err) {
  if (err instanceof HttpResponseError) {
    console.log(err.code, err.statusText);
  }
}
```

</div><div>After

```ts
catch (err) {
  if (err instanceof HttpResponseError) {
    console.log(err.response.code, err.response.statusText, err.response);
  }
}
```

</div>

## Billing

The billing functionality hasn't changed, but the main difference is that the library now provides separate methods for checking and requesting payment, which gives apps more freedom to implement their billing logic.

To configure billing, you can now pass in more than one billing plan, and they're indexed by plan name:

<div>Before

```ts
Shopify.Context.initialize({
  // ...
  billing: {
    chargeName: 'My plan',
    amount: 5.0,
    currencyCode: 'USD',
    interval: BillingInterval.Every30Days,
  },
});
```

</div><div>After

```ts
const shopify = shopifyApi({
  // ...
  billing: {
    'My plan': {
      amount: 5.0,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
  },
});
```

</div>

We broke the `Shopify.Billing.check` method up into `shopify.billing.check` and `shopify.billing.request`, as mentioned above:

<div>Before

```ts
const {hasPayment, confirmBillingUrl} = await Shopify.Billing.check({
  session,
  isTest: true,
});

if (!hasPayment) {
  return redirect(confirmBillingUrl);
}
```

</div><div>After

```ts
const hasPayment = await shopify.billing.check({
  session,
  plans: 'My plan',
  isTest: true,
});

if (!hasPayment) {
  const confirmationUrl = await shopify.billing.request({
    session,
    plan: 'My plan',
    isTest: true,
  });
  return redirect(confirmationUrl);
}
```

Note that when calling `check`, apps can pass in one or more plans, and it will return true if any of them match. The `request` method creates a charge using the given plan's configs.

</div>

## Utility functions

The previous `Shopify.Utils` object contained functions that relied on the global configuration object, but those have been refactored to use the instance-specific configuration.
We also felt that the `Utils` object had some functions that belong to other parts of the library, so some of these functions have been moved to other sub-objects - keep an eye out for those changes in the list below!

Here are all the specific changes that we made to the `Utils` object:

1. `Shopify.Utils.generateLocalHmac` was removed because it's only meant to be used internally by the library.
1. The `storeSession` method was removed since sessions shouldn't be stored using the library unless the library is doing it. Apps can still save data to their sessions as they please, as long as the data is properly exported to the library via the configured `SessionStorage`.
1. `validateHmac` is now `async`.
   <div>Before

   ```ts
   const isValid = Shopify.Utils.validateHmac(req.query);
   ```

   </div><div>After

   ```ts
   const isValid = await shopify.utils.validateHmac(req.query);
   ```

   </div>

1. `nonce`, `safeCompare`, and `getEmbeddedAppUrl` have moved to `shopify.auth`. `getEmbeddedAppUrl` is now `async` and takes in an object.
   <div>Before

   ```ts
   const nonce = Shopify.Utils.nonce();
   const match = Shopify.Utils.safeCompare(strA, strB);
   const redirectUrl = Shopify.Utils.getEmbeddedAppUrl(req, res);
   ```

   </div><div>After

   ```ts
   const nonce = shopify.auth.nonce();
   const match = shopify.auth.safeCompare(strA, strB);
   const redirectUrl = await shopify.auth.getEmbeddedAppUrl({
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Context.LOG_FILE` was replaced with `shopify.config.logFunction` so it can work without file-system access.
   <div>Before

   ```ts
   Shopify.Context.initialize({LOG_FILE: 'path/to/file.log'});
   ```

   </div><div>After

   ```ts
   const shopify = new shopifyApi({
     logFunction: async (severity: string, message: string) => {
       fs.appendFile(
         'path/to/file.log',
         `${new Date()} [${severity}]: ${message}`,
       );
     },
   });
   ```

   </div>

1. `Shopify.Utils.decodeSessionToken` is now `shopify.session.decodeSessionToken`, and it's `async`.
   <div>Before

   ```ts
   const payload = Shopify.Utils.decodeSessionToken(token);
   ```

   </div><div>After

   ```ts
   const payload = await shopify.session.decodeSessionToken(token);
   ```

   </div>

1. `Shopify.Utils.loadCurrentSession` is now `shopify.session.getCurrent`, it takes in an object, and the `isOnline` param is mandatory.
   <div>Before

   ```ts
   const session = await Shopify.Utils.loadCurrentSession(req, res);
   ```

   </div><div>After

   ```ts
   const session = await shopify.session.getCurrent({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Utils.deleteCurrentSession` is now `shopify.session.deleteCurrent`, it takes in an object, and the `isOnline` param is mandatory.
   <div>Before

   ```ts
   const session = await Shopify.Utils.deleteCurrentSession(req, res);
   ```

   </div><div>After

   ```ts
   const session = await shopify.session.deleteCurrent({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Utils.loadOfflineSession` is now `shopify.session.getOffline`, and it now takes an object. It still **_does not_** validate the given arguments and should only be used if you trust the source of the shop argument.
   <div>Before

   ```ts
   const session = await Shopify.Utils.loadOfflineSession(
     'my-shop.myshopify.com',
     true,
   );
   ```

   </div><div>After

   ```ts
   const session = await shopify.session.getOffline({
     shop: 'my-shop.myshopify.com',
     includeExpired: true,
   });
   ```

   </div>

1. `Shopify.Utils.deleteOfflineSession` is now `shopify.session.deleteOffline`, and it now takes an object.
   <div>Before

   ```ts
   const success = await Shopify.Utils.deleteOfflineSession(
     'my-shop.myshopify.com',
   );
   ```

   </div><div>After

   ```ts
   const success = await shopify.session.deleteOffline({
     shop: 'my-shop.myshopify.com',
   });
   ```

   </div>

1. `Shopify.Utils.withSession` is now `shopify.session.withSession`, and it no longer takes a `shop` argument, it will always authenticate the request to get the shop. The client type is now an enum to make it easier to see the available options.
   <div>Before

   ```ts
   const {client, session} = await Shopify.Utils.withSession({
     clientType: 'rest',
     isOnline: true,
     req,
     res,
     shop: 'my-shop.myshopify.com',
   });
   ```

   </div><div>After

   ```ts
   import {ClientType} from '@shopify/shopify-api';

   const {client, session} = await shopify.session.withSession({
     clientType: ClientType.Rest,
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Utils.graphqlProxy` is now `shopify.clients.graphqlProxy`, and it takes the body as an argument instead of parsing it from the request. This will make it easier for apps to use a body parser with this function.
   <div>Before

   ```ts
   const response = await Shopify.Utils.graphqlProxy(req, res);
   ```

   </div><div>After

   ```ts
   const response = await shopify.clients.graphqlProxy({
     body: req.rawBody, // From my app
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>
