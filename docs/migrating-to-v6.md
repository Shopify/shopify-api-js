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

**Note 1**: the examples below are assuming your app is running using Express.js, but the library still works with different frameworks as before.

**Note 2**: in general, method calls in v6 of the library take parameter objects instead of positional parameters. A :warning: symbol will highlight where these changes have occurred below, as forgetting to migrate the parameters into parameter objects can result in confusing app behaviour.

## Table of contents

To make it easier to navigate this guide, here is an overview of the sections it contains:

- [Updating `package.json` to use new version](#updating-packagejson-to-use-new-version)
- [Renamed `Shopify.Context` to `shopify.config`](#renamed-shopifycontext-to-shopifyconfig)
- [Passing in framework requests / responses](#passing-in-framework-requests--responses)
- [Simplified namespace for errors](#simplified-namespace-for-errors)
- [Changes to package exports](#changes-to-package-exports)
- [Changes to authentication functions](#changes-to-authentication-functions)
- [Changes to `Session` and `SessionStorage`](#changes-to-session-and-sessionstorage)
- [Changes to API clients](#changes-to-api-clients)
- [Billing](#billing)
- [Utility functions](#utility-functions)
- [Changes to webhook functions](#changes-to-webhook-functions)
- [Changes to use of REST resources](#changes-to-use-of-rest-resources)
- [Example migration](./example-migration-v5-node-template-to-v6.md)

---

## Updating `package.json` to use new version

To use the `v6` version of the library, update the apps `package.json` file to refer to the new version

```diff
   "dependencies": {
-    "@shopify/shopify-api": "^5.0.0",
+    "@shopify/shopify-api": "^6.0.0",
```

After the file is updated, install the updated library with your preferred package manager.

```shell
yarn install
# or
npm install
# or
pnpm install
```

---

## Renamed `Shopify.Context` to `shopify.config`

We've refactored the way objects are exported by this library, to remove the main static singleton `Shopify` object with global settings stored in `Shopify.Context`.

Even though that object has no business logic, the fact that the configuration is global made it hard to mock for tests and to set up multiple instances of it.
Part of the changes we made were to create a library object with local settings, to make it feel more idiomatic and easier to work with.

The settings that were previously set in `Shopify.Context` are now returned in the `config` property in the api instance return by `shopifyApi()`.

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

---

## Passing in framework requests / responses

Using the v5 or earlier version of the library, apps would generally call library functions as follows:

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

---

## Simplified namespace for errors

Using the v5 or earlier version of the library, error types were available via the `Shopify` instance, e.g., `Shopify.Errors.HttpResponseError`. In v6, they are now exported by the library and can be imported without any namespace prefix.

<div>Before

```ts
app.post('/webhooks', async (req, res) => {
  try {
    await Shopify.Webhooks.Registry.process(req, res);
  } catch (error) {
    if (error instanceof Shopify.Errors.InvalidWebhookError) {
      console.log(`Webhook processing error:\n\tmessage = ${error.message}`);
    } else {
      console.log('Other error:\n\t', error);
    }
  }
});
```

</div><div>:warning: After

```ts
import {InvalidWebhookError} from '@shopify/shopify-api';

// ...

app.post('/webhooks', async (req, res) => {
  try {
    await shopify.webhooks.process({
      rawBody: (req as any).rawBody, // as a string
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookError) {
      console.log(
        `Webhook processing error:\n\tmessage = ${error.message}\n\tresponse = ${error.response}`,
      );
    } else {
      console.log('Other error:\n\t', error);
    }
  }
});
```

---

## Changes to package exports

In v5 and earlier versions, certain exports needed to be imported from deep paths into the package. In v6, only some export paths are allowed and are specific to various needs of the application. For example, for the list of GDPR webhook topics,

<div>Before

```ts
import {gdprTopics} from '@shopify/shopify-api/dist/webhooks/registry.js';
```

</div><div>:warning: After

```ts
import {gdprTopics} from '@shopify/shopify-api';
```

See the [Changes to use of REST resources](#changes-to-use-of-rest-resources) section on how to access REST resources in v6.

---

## Changes to authentication functions

The OAuth methods still behave the same way, but we've updated their signatures to make it easier to work with them. See the [updated OAuth instructions](./guides/oauth.md) for a complete example.

See [Access modes](https://shopify.dev/docs/apps/auth/oauth/access-modes) for more details regarding how to use the `isOnline` parameter.

> **Note**: if you created your app before August 23, 2022, make sure you [update your embedded app OAuth flow](https://shopify.dev/docs/apps/auth/oauth/update/node-php) to follow our best practices.

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

   </div><div>:warning: After

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

1. `Shopify.Auth.validateAuthCallback()` is now `shopify.auth.callback()`, it now takes an object with the request and response, but the `query` argument is no longer necessary - it will be read from the request. This method will set the appropriate response headers.

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

   </div><div>:warning: After

   ```ts
   const callbackResponse = shopify.auth.callback({
     rawRequest: req,
     rawResponse: res,
   });
   // callbackResponse.session.accessToken...
   res.redirect('url');
   ```

   </div>

1. The `shopify.auth` component only exports the key functions now to make the API simpler, so `getCookieSessionId`, `getJwtSessionId`, `getOfflineSessionId`, `getCurrentSessionId` are no longer exported. They're internal library functions.

1. There is a new `shopify.session` object which contains session-specific functions. See the [Utility functions](#utility-functions) section for the specific changes.

---

## Changes to `Session` and `SessionStorage`

1. The `SessionStorage` interface has been removed and any provided implementions have been removed from the library. The library only provides methods to obtain sessionId's. Responsibility for storing sessions is delegated to the application.

   > **Note** The previous implementations of session storage have been converted into their own standalone packages in the [`Shopify/shopify-app-js` repo](https://github.com/Shopify/shopify-app-js/tree/main/packages) (see the list in the [Implementing session storage guide](./guides/session-storage.md)).

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

   </div><div>:warning: After

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

1. The `isActive()` method of `Session` now takes a `scopes` parameter. If the scopes of the session don't match the scopes of the application (e.g., app has been restarted with new scopes), the session is deemed to be inactive and OAuth should be initiated again.
   <div>Before

   ```ts
   const session = await Shopify.Utils.loadCurrentSession(req, res);

   if (!session.isActive()) {
     // current session is not active - either expired or scopes have changed
   }
   ```

   </div><div>:warning: After

   ```ts
   const sessionId = await shopify.session.getCurrentId({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   // use sessionId to retrieve session from app's session storage
   // getSessionFromStorage() must be provided by application
   const session = await getSessionFromStorage(sessionId);

   if (!session.isActive(shopify.config.scopes)) {
     // current session is not active - either expired or scopes have changed
   }
   ```

   </div>

1. The `Session` class now includes a `.toObject` method to support the app in storing `Session` objects. The return value of `.toObject` can be passed to `new Session()` to create a `Session` object.

   ```ts
   const callbackResponse = shopify.auth.callback({
     rawRequest: req,
     rawResponse: res,
   });

   // app stores Session in its own storage mechanism
   await addSessionToStorage(callbackResponse.session.toObject());
   ```

1. See the [Implementing session storage guide](./guides/session-storage.md) for the changes you'll need to make to load and store your sessions. In general, you'll need to [store sessions](./guides/session-storage.md#save-a-session-to-storage) that are returned from `shopify.auth.callback()` and you'll need to [load sessions](./guides/session-storage.md#load-a-session-from-storage) anywhere your code previously used `loadCurrentSession`.

---

## Changes to API clients

The constructor for each API client that this package provides now takes an object of arguments, rather than positional ones. The returned objects behave the same as they did previously.

1. REST Admin API client:

   <div>Before

   ```ts
   const restClient = new Shopify.Clients.Rest(
     session.shop,
     session.accessToken,
   );
   ```

   </div><div>:warning: After

   ```ts
   const restClient = new shopify.clients.Rest({session});
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

   </div><div>:warning: After

   ```ts
   const graphqlClient = new shopify.clients.Graphql({session});
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

   </div><div>:warning: After

   ```ts
   const storefrontClient = new shopify.clients.Storefront({
     domain: session.shop,
     storefrontAccessToken,
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

---

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

Note that when calling `check`, apps can pass in one or more plans, and it will return true if any of them match. The `request` method creates a charge using the configuration of the given plan name.

</div>

---

## Utility functions

The previous `Shopify.Utils` object contained functions that relied on the global configuration object, but those have been refactored to use the instance-specific configuration.
We also felt that the `Utils` object had some functions that belong to other parts of the library, so some of these functions have been moved to other sub-objects - keep an eye out for those changes in the list below!

Here are all the specific changes that we made to the `Utils` object:

1. `Shopify.Utils.generateLocalHmac` was removed because it's only meant to be used internally by the library.

1. The `storeSession` method was removed since sessions are no longer stored by the library. Apps are now fully responsible for implementating session storage and can save data to their sessions as they please. See the [implementing session storage guide](./guides/session-storage.md) for the changes you'll need to make to store your sessions.

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

   </div><div>:warning: After

   ```ts
   const nonce = shopify.auth.nonce();
   const match = shopify.auth.safeCompare(strA, strB);
   const redirectUrl = await shopify.auth.getEmbeddedAppUrl({
     rawRequest: req,
     rawResponse: res,
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

1. `Shopify.Utils.loadCurrentSession` is now `shopify.session.getCurrentId`, it takes in an object, the `isOnline` param is mandatory, and it now returns a session id, that can then be used to retrieve the session details from app-provided storage.
   <div>Before

   ```ts
   const session = await Shopify.Utils.loadCurrentSession(req, res);
   ```

   </div><div>:warning: After

   ```ts
   const sessionId = await shopify.session.getCurrentId({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   ```

   </div>

1. `Shopify.Utils.deleteCurrentSession` has been removed, as the library no longer handles the storage of sessions.

1. `Shopify.Utils.loadOfflineSession` is now `shopify.session.getOfflineId`, and takes a `shop` argument as its only parameter. It still **_does not_** validate the given arguments and should only be used if you trust the source of the shop argument. It returns a session id that can then be used to retrieve the session details from app-provided storage.
   <div>Before

   ```ts
   const session = await Shopify.Utils.loadOfflineSession(
     'my-shop.myshopify.com',
     true,
   );
   ```

   </div><div>:warning: After

   ```ts
   const sessionId = await shopify.session.getOfflineId(
     'my-shop.myshopify.com',
   );
   ```

   </div>

1. `Shopify.Utils.deleteOfflineSession` has been removed, as the library no longer handles the storage of sessions.

1. `Shopify.Utils.withSession` has been removed, as the library no longer handles the storage of sessions. The various clients have been updated to take a session as an argument.
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

   </div><div>:warning: After

   ```ts
   const sessionId = await shopify.session.getCurrentId({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   // use sessionId to retrieve session from app's session storage
   // getSessionFromStorage() must be provided by application
   const session = await getSessionFromStorage(sessionId);

   const gqlClient = await shopify.clients.Graphql({session});
   // or
   const restClient = await shopify.clients.Rest({session});
   // or
   const storefrontClient = await shopify.clients.Storefront({
     session,
     storefrontAccessToken,
   });
   ```

   </div>

1. `Shopify.Utils.graphqlProxy` is now `shopify.clients.graphqlProxy`, it takes a session argument, and it also takes the body as an argument instead of parsing it from the request. This will make it easier for apps to use a body parser with this function.
   <div>Before

   ```ts
   const response = await Shopify.Utils.graphqlProxy(req, res);
   ```

   </div><div>:warning: After

   ```ts
   const sessionId = await shopify.session.getCurrentId({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   // use sessionId to retrieve session from app's session storage
   // getSessionFromStorage() must be provided by application
   const session = await getSessionFromStorage(sessionId);

   const response = await shopify.clients.graphqlProxy({
     session,
     rawBody: req.rawBody, // From my app
   });
   ```

   </div>

### Logging

`Shopify.Context.LOG_FILE` was replaced with `shopify.config.logger.log` so it can work without file-system access.

<div>Before

```ts
Shopify.Context.initialize({LOG_FILE: 'path/to/file.log'});
```

</div><div>After

```ts
const shopify = new shopifyApi({
  logger: {
    log: async (_severity: string, message: string) => {
      fs.appendFile('path/to/file.log', message);
    },
  },
});
```

</div>

We've also added more logging to this package to make it easier for apps to debug issues and track what's happening.
See [the documentation](../README.md#configurations) for `logger` settings.
The package formats the message in a consistent way before calling the `log` function.

---

## Changes to webhook functions

In v6, apps can now set up multiple handlers per webhook topic, and we simplified the library's interface to reduce the number of methods needed.

The following methods are now available:

- `addHandlers`
- `register`
- `process`
- `getHandlers`
- `getTopicsAdded` replaces the previous `getTopics`

And the following methods are no longer supported:

- `addHandler`
- `registerAll`
- `getHandler`
- `isWebhookPath`

For more details on the updated webhook functions, see the [documentation](./guides/webhooks.md).

Below are instructions on how webhooks work now:

1. You can call `shopify.webhooks.addHandlers` with a list of handlers, indexed by topic. Note that:

- you must now use delivery method-specific fields instead of `path`, like `callbackUrl` and `arn`, to match the GrahpQL API behavior
- this is now `async`, so you'll need to `await` it

   <div>Before

  ```ts
  Shopify.Webhooks.Registry.addHandler('PRODUCTS_CREATE', {
    path: '/webhooks',
    webhookHandler: handleWebhookRequest,
  });
  ```

   </div><div>:warning: After

  ```ts
  await shopify.webhooks.addHandlers({
    PRODUCTS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
      callback: handleWebhookRequest,
    },
    TOPIC_1: [handler, handler2],
    TOPIC_2: handler3,
  });
  ```

   </div>

> **Note**: if you're using TypeScript, the handlers are typed based on the `deliveryMethod` you select.

1. `Shopify.Webhooks.Registry.register` is now `shopify.webhooks.register`, and it now only takes in the session. It will register any handlers you added, and delete registrations that don't match the new configuration. That means the final webhooks registered for a shop will always match your configuration.

   <div>Before

   ```ts
   const response = await Shopify.Webhooks.Registry.register({
     path: '/webhooks',
     topic: 'PRODUCTS_CREATE',
     accessToken: session.accessToken,
     shop: session.shop,
   });
   ```

   </div><div>:warning: After

   ```ts
   const response = await shopify.webhooks.register({session: session});

   // Response will be a list indexed by topic:
   console.log(response[topic][0].success, response[topic][0].result);
   ```

   </div>

1. The response from `register` has a different structure in v6 when compared to v5 or earlier.

   <div>Before

   ```ts
   response = {
     TOPIC: {
       success: boolean;
       result: any;
       }
     },
     TOPIC2: {
       // ...
     },
   }
   ```

   </div><div>:warning: After

   ```ts
   response = {
     TOPIC: [
       {
         deliveryMethod: DeliveryMethod;
         success: boolean;
         result: any;
       },
       {
         deliveryMethod: DeliveryMethod;
         success: boolean;
         result: any;
       },
     ],
     TOPIC2: [
       // ...
     ],
   }

   // DeliveryMethod is an enum whose value can be one of
   // - DeliveryMethod.Http
   // - DeliveryMethod.EventBridge
   // - DeliveryMethod.PubSub
   ```

   </div>

   As with earlier versions, when `success` is not `true`, `result` should contain an `errors` property with an array of error `message`'s, e.g.,

   ```ts
   response = {
     PRODUCTS_CREATE: [
       {
         deliveryMethod: DeliveryMethod.Http;
         success: false;
         result: {
           errors: [
             {
               message: "Error message",
             }
           ],
         };
       },
     ],
   }

   if (!response["PRODUCTS_CREATE"][0].success) {
     console.log(response["PRODUCTS_CREATE"][0].result.errors[0].message); // "Error message"
   }
   ```

1. `Shopify.Webhooks.Registry.process` is now `shopify.webhooks.process`, and it takes the body as an argument instead of parsing it from the request. This will make it easier for apps to use a body parser with this function.
   <div>Before

   ```ts
   app.post('/webhooks', async (req, res) => {
     try {
       await Shopify.Webhooks.Registry.process(req, res);
     } catch (error) {
       console.log(error.message);
     }
   });
   ```

   </div><div>:warning: After

   ```ts
   app.post('/webhooks', async (req, res) => {
     try {
       // Note: this example assumes that the raw content of the body of the request
       // has been read and is available at req.rawBody; this will likely differ
       // depending on which body parser is used.
       await shopify.webhooks.process({
         rawBody: (req as any).rawBody, // as a string
         rawRequest: req,
         rawResponse: res,
       });
     } catch (error) {
       console.log(error.message);
     }
   });
   ```

   </div>

1. `Shopify.Webhooks.Registry.getHandler` is now `shopify.webhooks.getHandlers`, and returns all handler configurations for that topic.
   <div>Before

   ```ts
   Shopify.Webhooks.Registry.addHandler({
     topic: 'PRODUCTS',
     path: '/webhooks',
     webhookHandler: productsWebhookHandler,
   });

   const productsHandler = Shopify.Webhooks.Registry.getHandler('PRODUCTS');
   // productsHandler = {path: '/webhooks', webhookHandler: productsWebhookHandler}
   ```

   </div><div>:warning: After

   ```ts
   await shopify.webhooks.addHandlers({
     PRODUCTS: {
       deliveryMethod: DeliveryMethod.Http,
       callbackUrl: '/webhooks',
       callback: productsWebhookHandler,
     },
   });

   // Is an array of handler configurations
   const handlers = shopify.webhooks.getHandlers('PRODUCTS');
   ```

   </div>

1. `Shopify.Webhooks.Registry.getTopics` is now `shopify.webhooks.getTopicsAdded`, to indicate that it returns the topics added using `addHandlers`.
   <div>Before

   ```ts
   Shopify.Webhooks.Registry.addHandlers({
     PRODUCTS_CREATE: {
       path: '/webhooks',
       webhookHandler: productCreateWebhookHandler,
     },
     PRODUCTS_DELETE: {
       path: '/webhooks',
       webhookHandler: productDeleteWebhookHandler,
     },
   });

   const topics = Shopify.Webhooks.Registry.getTopics();
   // topics = ['PRODUCTS_CREATE', 'PRODUCTS_DELETE']
   ```

   </div><div>:warning: After

   ```ts
   await shopify.webhooks.addHandlers({
     PRODUCTS_CREATE: {
       deliveryMethod: DeliveryMethod.Http,
       callbackUrl: '/webhooks',
       callback: productCreateWebhookHandler,
     },
     PRODUCTS_DELETE: {
       deliveryMethod: DeliveryMethod.Http,
       callbackUrl: '/webhooks',
       callback: productDeleteWebhookHandler,
     },
   });

   const topics = shopify.webhooks.getTopicsAdded();
   // topics = ['PRODUCTS_CREATE', 'PRODUCTS_DELETE']
   ```

   </div>

---

## Changes to use of REST resources

REST resources were added to version 3 of the API library and were accessed by importing directly from the `dist` folder of the `@shopify/shopify-api`.

Starting with v6, they can now be accessed via the Shopify API instance directly.

<div>Before

```ts
app.get('/api/products/count', async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const {Product} = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );

  const countData = await Product.count({session});
  res.status(200).send(countData);
});
```

</div><div>:warning: After

```ts
import {shopifyApi, ApiVersion} from '@shopify/shopify-api';
const apiVersion = ApiVersion.October22;
let {restResources} = await import(
  `@shopify/shopify-api/rest/admin/${apiVersion}`
);

const shopify = shopifyApi({
  // ...
  apiVersion,
  restResources,
});

// ...

app.get('/api/products/count', async (req, res) => {
  const sessionId = await shopify.session.getCurrentId({
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(sessionId);

  const countData = await shopify.rest.Product.count({session});
  res.status(200).send(countData);
});
```

See [using REST resources](./guides/rest-resources.md) for more details.
