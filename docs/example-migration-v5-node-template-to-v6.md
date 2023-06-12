# Instructions to migrate v5-based node template to use v6

**Note 1**: this assumes a v5-based template that has already been run with `yarn dev` (i.e., the needed dependencies have already been installed).

**Note 2**: this guide outlines what's required to migrate the node template app that hasn't been modified in any other way by the developer.

## Steps

### 1. Change into the `web` directory

This is root directory of where most of the changes will occur.

```shell
cd web
```

### 2. Modify the `package.json` file to use `v6` of the `@shopify/shopify-api` package

```diff
   "dependencies": {
-    "@shopify/shopify-api": "^5.0.0",
+    "@shopify/shopify-api": "^6.0.0",
```

### 3. Update the api library package using your preferred package manager

```shell
yarn install
# or
npm install
# or
pnpm install
```

### 4. Create a new file called `shopify.js`

This will be used to to create the shopify api instance used throughout the application.

In version 6, we improved this package so that it can run on any JS runtime, like Node.js or Cloudflare workers. Because of that, the very first thing the app needs to do is to import the Node.js adapter to set up the right defaults:

```js
import '@shopify/shopify-api/adapters/node';
```

Below is an example of a `shopify.js` file, where the v5 `Shopify.Context` configuration and the example billing configuration that is currently in `index.js` will be moved:

```js
import '@shopify/shopify-api/adapters/node';
import {
  shopifyApi,
  BillingInterval,
  LATEST_API_VERSION,
  LogSeverity,
} from '@shopify/shopify-api';
let {restResources} = await import(
  `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`
);

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  'My Shopify One-Time Charge': {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: 'USD',
    interval: BillingInterval.OneTime,
  },
};

const apiConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
  hostScheme: process.env.HOST.split('://')[0],
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  ...(process.env.SHOP_CUSTOM_DOMAIN && {
    customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN],
  }),
  billing: undefined, // or replace with billingConfig above to enable example billing
  restResources,
};

const shopify = shopifyApi(apiConfig);
export default shopify;
```

### 5. Update the `gdpr.js` file

This file needs to be updated to use the `shopify` api instance as well as the new parameter structure for the `addHandlers` method. The comments have been removed from the code below for brevity.

:warning: :warning: Note that the new `addHandlers` method is asynchronous and requires an `await` before its call. As a result, the encapsulating `setupGDPRWebHooks` method requires the `async` keyword.

```diff
-import { Shopify } from "@shopify/shopify-api";
+import { DeliveryMethod } from "@shopify/shopify-api"
+import shopify from "./shopify.js";

-export function setupGDPRWebHooks(path) {
-  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
-    path,
-    webhookHandler: async (topic, shop, body) => {
-      const payload = JSON.parse(body);
+export async function setupGDPRWebHooks(path) {
+  await shopify.webhooks.addHandlers({
+    CUSTOMERS_DATA_REQUEST: {
+      deliveryMethod: DeliveryMethod.Http,
+      callbackUrl: path,
+      callback: async (topic, shop, body) => {
+        const payload = JSON.parse(body);
+      },
     },
   });

-  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
-    path,
-    webhookHandler: async (topic, shop, body) => {
-      const payload = JSON.parse(body);
+export async function setupGDPRWebHooks(path) {
+  await shopify.webhooks.addHandlers({
+    CUSTOMERS_REDACT: {
+      deliveryMethod: DeliveryMethod.Http,
+      callbackUrl: path,
+      callback: async (topic, shop, body) => {
+        const payload = JSON.parse(body);
+      },
     },
   });

-  Shopify.Webhooks.Registry.addHandler("SHOP_REDACT", {
-    path,
-    webhookHandler: async (topic, shop, body) => {
-      const payload = JSON.parse(body);
+export async function setupGDPRWebHooks(path) {
+  await shopify.webhooks.addHandlers({
+    SHOP_REDACT: {
+      deliveryMethod: DeliveryMethod.Http,
+      callbackUrl: path,
+      callback: async (topic, shop, body) => {
+        const payload = JSON.parse(body);
+      },
     },
   });
 }
```

### 6. Install the `@shopify/shopify-app-session-storage-sqlite` package

The v6 API library no longer provide session storage adapters to connect to various database/data stores. The storage of session data is now delegated to the application.

The session storage adapters that were in the API library have now been moved to their own individual packages. As the v5 node template uses SQLite by default, let's install the SQLite session storage adapter into the application, using your preferred package manager.

```shell
yarn add @shopify/shopify-app-session-storage-sqlite
# or
npm install @shopify/shopify-app-session-storage-sqlite
# or
pnpm install @shopify/shopify-app-session-storage-sqlite
```

### 7. Create a `sqlite-session-storage.js` file

Create the following file to instantiate and export a SQLite session storage instance.

```ts
import {SQLiteSessionStorage} from '@shopify/shopify-app-session-storage-sqlite';

const dbPath = `${process.cwd()}/database.sqlite`;

export const sqliteSessionStorage = new SQLiteSessionStorage(dbPath);
```

Note that the `DB_PATH` constant from the `index.js` file has moved into this file.

### 8. Update the `app_installations.js` file to use the `sqliteSessionStorage` instance

```diff
-import { Shopify } from "@shopify/shopify-api";
+import { sqliteSessionStorage } from "./sqlite-session-storage.js";

 export const AppInstallations = {
   includes: async function (shopDomain) {
-    const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);
+    const shopSessions = await sqliteSessionStorage.findSessionsByShop(shopDomain);

     if (shopSessions.length > 0) {
       for (const session of shopSessions) {
         if (session.accessToken) return true;
       }
     }

     return false;
   },

   delete: async function (shopDomain) {
-    const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain);
+    const shopSessions = await sqliteSessionStorage.findSessionsByShop(shopDomain);
     if (shopSessions.length > 0) {
-      await Shopify.Context.SESSION_STORAGE.deleteSessions(shopSessions.map((session) => session.id));
+      await sqliteSessionStorage.deleteSessions(shopSessions.map((session) => session.id)); }
   },
 };
```

### 9. Update the `middleware/auth.js` file to use the `shopify` instance and the `sqliteSessionStorage` instance

Whereas the `v5` version of the API library saved the session returned by the auth callback method on behalf of the app, the `v6` library only returns the session. The application must store the returned session in its session storage.

```diff
-import { Shopify } from "@shopify/shopify-api";
-import { gdprTopics } from "@shopify/shopify-api/dist/webhooks/registry.js";
+import shopify from "../shopify.js";
+import {
+  gdprTopics,
+  InvalidOAuthError,
+  CookieNotFound,
+} from "@shopify/shopify-api";
+import { sqliteSessionStorage } from "../sqlite-session-storage.js";

 import ensureBilling from "../helpers/ensure-billing.js";
 import redirectToAuth from "../helpers/redirect-to-auth.js";

-export default function applyAuthMiddleware(
-  app,
-  { billing = { required: false } } = { billing: { required: false } }
-) {
+export default function applyAuthMiddleware(app) {
   app.get("/api/auth", async (req, res) => {
-    return redirectToAuth(req, res, app)
+    return redirectToAuth(req, res, app);
   });

   app.get("/api/auth/callback", async (req, res) => {
     try {
-      const session = await Shopify.Auth.validateAuthCallback(
-        req,
-        res,
-        req.query
-      );
+      const callbackResponse = await shopify.auth.callback({
+        rawRequest: req,
+        rawResponse: res,
+      });

+      // save the session
+      if ((await sqliteSessionStorage.storeSession(callbackResponse.session)) == false) {
+        console.log(`Failed to store session ${callbackResponse.session.id}`);
+      }
+
-      const responses = await Shopify.Webhooks.Registry.registerAll({
-        shop: session.shop,
-        accessToken: session.accessToken,
+      const responses = await shopify.webhooks.register({
+        session: callbackResponse.session,
       });

-      Object.entries(responses).map(([topic, response]) => {
-        // The response from registerAll will include errors for the GDPR topics.  These can be safely ignored.
+      Object.entries(responses).map(([topic, responsesForTopic]) => {
+        // The response from register will include the GDPR topics - these can be safely ignored.
         // To register the GDPR topics, please set the appropriate webhook endpoint in the
         // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
-        if (!response.success && !gdprTopics.includes(topic)) {
-          if (response.result.errors) {
-            console.log(
-              `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
-            );
-          } else {
-            console.log(
-              `Failed to register ${topic} webhook: ${
-                JSON.stringify(response.result.data, undefined, 2)
-              }`
-            );
-          }
+
+        // If there are no entries in the response array, there was no change in webhook
+        // registrations for that topic.
+        if (!gdprTopics.includes(topic) && responsesForTopic.length > 0) {
+          // Check the result of each response for errors
+          responsesForTopic.map((response) => {
+            if (!response.success) {
+              if (response.result.errors) {
+                console.log(
+                  `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
+                );
+              } else {
+                console.log(
+                  `Failed to register ${topic} webhook: ${JSON.stringify(
+                    response.result.data,
+                    undefined,
+                    2
+                  )}`
+                );
+              }
+            }
+          });
         }
       });

       // If billing is required, check if the store needs to be charged right away to minimize the number of redirects.
-      if (billing.required) {
-        const [hasPayment, confirmationUrl] = await ensureBilling(
-          session,
-          billing
-        );
+      const [hasPayment, confirmationUrl] = await ensureBilling(
+        callbackResponse.session
+      );

-        if (!hasPayment) {
-          return res.redirect(confirmationUrl);
-        }
+      if (!hasPayment) {
+        return res.redirect(confirmationUrl);
       }

```

:warning: :warning: The `v6` version of `getEmbeddedAppUrl` is an asynchronous method ... don't forget to add the `await` keyword before the method call.

```diff
-      const host = Shopify.Utils.sanitizeHost(req.query.host);
-      const redirectUrl = Shopify.Context.IS_EMBEDDED_APP
-        ? Shopify.Utils.getEmbeddedAppUrl(req)
-        : `/?shop=${session.shop}&host=${encodeURIComponent(host)}`;
+      const host = shopify.utils.sanitizeHost(req.query.host);
+      const redirectUrl = shopify.config.isEmbeddedApp
+        ? await shopify.auth.getEmbeddedAppUrl({
+            rawRequest: req,
+            rawResponse: res,
+          })
+        : `/?shop=${callbackResponse.session.shop}&host=${encodeURIComponent(host)}`;

       res.redirect(redirectUrl);
     } catch (e) {
       console.warn(e);
       switch (true) {
-        case e instanceof Shopify.Errors.InvalidOAuthError:
+        case e instanceof InvalidOAuthError:
           res.status(400);
           res.send(e.message);
           break;
-        case e instanceof Shopify.Errors.CookieNotFound:
-        case e instanceof Shopify.Errors.SessionNotFound:
+        case e instanceof CookieNotFound:
           // This is likely because the OAuth session cookie expired before the merchant approved the request
           return redirectToAuth(req, res, app);
           break;
         default:
           res.status(500);
           res.send(e.message);
           break;
       }
     }
   });
 }
```

### 10. Update the `middleware/verify-request.js` file to use the `shopify` instance and the `sqliteSessionStorage` instance

Whereas `v5` of the API library had a `loadCurrentSession` method to provide the current session, `v6` now provides the session id that the app then uses to retrieve the session details from the app's session storage.

```diff
-import { Shopify } from "@shopify/shopify-api";
-import ensureBilling, {
-  ShopifyBillingError,
-} from "../helpers/ensure-billing.js";
+import { BillingError, HttpResponseError } from "@shopify/shopify-api";
+import shopify from "../shopify.js";
+import { sqliteSessionStorage } from "../sqlite-session-storage.js";
+import ensureBilling from "../helpers/ensure-billing.js";
 import redirectToAuth from "../helpers/redirect-to-auth.js";

 import returnTopLevelRedirection from "../helpers/return-top-level-redirection.js";

 const TEST_GRAPHQL_QUERY = `
 {
   shop {
     name
   }
 }`;

-export default function verifyRequest(
-  app,
-  { billing = { required: false } } = { billing: { required: false } }
-) {
+export default function verifyRequest(app) {
   return async (req, res, next) => {
-    const session = await Shopify.Utils.loadCurrentSession(
-      req,
-      res,
-      app.get("use-online-tokens")
-    );
+    const sessionId = await shopify.session.getCurrentId({
+      rawRequest: req,
+      rawResponse: res,
+      isOnline: app.get("use-online-tokens"),
+    });

+    const session = await sqliteSessionStorage.loadSession(sessionId);
+
-    let shop = Shopify.Utils.sanitizeShop(req.query.shop);
+    let shop = shopify.utils.sanitizeShop(req.query.shop);
     if (session && shop && session.shop !== shop) {
       // The current request is for a different shop. Redirect gracefully.
       return redirectToAuth(req, res, app);
     }

```

:warning: :warning: The `isActive` method of a `Session` class in the `v6` library now takes a `scopes` parameter (to check if the application scopes have changed since the session was used).

```diff
-    if (session?.isActive()) {
+    if (session && session.isActive(shopify.config.scopes)) {
       try {
-        if (billing.required) {
-          // The request to check billing status serves to validate that the access token is still valid.
-          const [hasPayment, confirmationUrl] = await ensureBilling(
-            session,
-            billing
-          );
+        // The request to check billing status serves to validate that the access token is still valid.
+        const [hasPayment, confirmationUrl] = await ensureBilling(session);

-          if (!hasPayment) {
-            returnTopLevelRedirection(req, res, confirmationUrl);
-            return;
-          }
+        if (!hasPayment) {
+          returnTopLevelRedirection(req, res, confirmationUrl);
+          return;
         } else {
           // Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
-          const client = new Shopify.Clients.Graphql(
-            session.shop,
-            session.accessToken
-          );
+          const client = new shopify.clients.Graphql({ session });
           await client.query({ data: TEST_GRAPHQL_QUERY });
         }
         return next();
       } catch (e) {
-        if (
-          e instanceof Shopify.Errors.HttpResponseError &&
-          e.response.code === 401
-        ) {
+        if (e instanceof HttpResponseError && e.response.code === 401) {
           // Re-authenticate if we get a 401 response
-        } else if (e instanceof ShopifyBillingError) {
+        } else if (e instanceof BillingError) {
           console.error(e.message, e.errorData[0]);
           res.status(500).end();
           return;
         } else {
           throw e;
         }
       }
     }

     const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/);
     if (bearerPresent) {
       if (!shop) {
         if (session) {
           shop = session.shop;
-        } else if (Shopify.Context.IS_EMBEDDED_APP) {
+        } else if (shopify.config.isEmbeddedApp) {
           if (bearerPresent) {
```

:warning: :warning: The `v6` version of `decodeSessionToken` is now an asynchronous method ... don't forget to put the `await` keyword before its call.

```diff
-            const payload = Shopify.Utils.decodeSessionToken(bearerPresent[1]);
+            const payload = await shopify.session.decodeSessionToken(bearerPresent[1]);
             shop = payload.dest.replace("https://", "");
           }
         }
       }
     }

     returnTopLevelRedirection(
       req,
       res,
       `/api/auth?shop=${encodeURIComponent(shop)}`
     );
   };
 }
```

### 11. Update the billing helper

Because version 6 of the api library now includes support for checking and making billing requests, replace the `helpers/ensure-billing.js` file with the following code.

```ts
import shopify from '../shopify.js';

/**
 * You may want to charge merchants for using your app. This helper provides that function by checking if the current
 * merchant has an active one-time payment or subscription named `chargeName`. If no payment is found,
 * this helper requests it and returns a confirmation URL so that the merchant can approve the purchase.
 *
 * Learn more about billing in our documentation: https://shopify.dev/docs/apps/billing
 */
export default async function ensureBilling(
  session,
  isProdOverride = process.env.NODE_ENV === 'production',
) {
  let hasPayment = true;
  let confirmationUrl = null;

  if (shopify.config.billing) {
    hasPayment = await shopify.billing.check({
      session,
      plans: Object.keys(shopify.config.billing),
      isTest: !isProdOverride,
    });

    if (!hasPayment) {
      // Realistically, if there are more than one plan to choose from, you should redirect to
      // a page that allows the merchant to choose a plan.
      // For this example, we'll just redirect to the first plan
      confirmationUrl = await shopify.billing.request({
        session,
        plan: Object.keys(shopify.config.billing)[0],
        isTest: !isProdOverride,
      });
    }
  }

  return [hasPayment, confirmationUrl];
}
```

### 12. Update the `helpers/product-creater.js` file to use the `shopify` instance

Note that the `ADJECTIVES` and `NOUN` constants remain the same but have been collapsed/hidden below for brevity.

```diff
-import { Shopify } from "@shopify/shopify-api";
+import { GraphqlQueryError } from "@shopify/shopify-api";
+import shopify from "../shopify.js";

 const ADJECTIVES = [ ...
 ];

 const NOUNS = [ ...
 ];

 export const DEFAULT_PRODUCTS_COUNT = 5;
 const CREATE_PRODUCTS_MUTATION = `
   mutation populateProduct($input: ProductInput!) {
     productCreate(input: $input) {
       product {
         id
       }
     }
   }
 `;

 export default async function productCreator(session, count = DEFAULT_PRODUCTS_COUNT) {
-  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
+  const client = new shopify.clients.Graphql({ session });

   try {
     for (let i = 0; i < count; i++) {
       await client.query({
         data: {
           query: CREATE_PRODUCTS_MUTATION,
           variables: {
             input: {
               title: `${randomTitle()}`,
               variants: [{ price: randomPrice() }],
             },
           },
         },
       });
     }
   } catch (error) {
-    if (error instanceof Shopify.Errors.GraphqlQueryError) {
+    if (error instanceof GraphqlQueryError) {
       throw new Error(`${error.message}\n${JSON.stringify(error.response, null, 2)}`);
     } else {
       throw error;
     }
   }
 }

 function randomTitle() {
   const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
   const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
   return `${adjective} ${noun}`;
 }

 function randomPrice() {
   return Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100;
 }
```

### 13. Update the `helpers/redirect-to-auth.js` file to use the `shopify` instance

```diff
-import { Shopify } from "@shopify/shopify-api";
+import shopify from "../shopify.js";

 export default async function redirectToAuth(req, res, app) {
   if (!req.query.shop) {
     res.status(500);
     return res.send("No shop provided");
   }

   if (req.query.embedded === "1") {
     return clientSideRedirect(req, res);
   }

   return await serverSideRedirect(req, res, app);
 }

 function clientSideRedirect(req, res) {
-  const shop = Shopify.Utils.sanitizeShop(req.query.shop);
+  const shop = shopify.utils.sanitizeShop(req.query.shop);
   const redirectUriParams = new URLSearchParams({
     shop,
     host: req.query.host,
   }).toString();
   const queryParams = new URLSearchParams({
     ...req.query,
     shop,
-    redirectUri: `https://${Shopify.Context.HOST_NAME}/api/auth?${redirectUriParams}`,
+    redirectUri: `https://${shopify.config.hostName}/api/auth?${redirectUriParams}`,
   }).toString();

   return res.redirect(`/exitiframe?${queryParams}`);
 }

```

:warning: :warning: Note that the `shopify.auth.begin` method performs the redirection on the apps behalf - the app does not need to call `res.redirect` after the `shopify.auth.begin` call any more.

```diff
 async function serverSideRedirect(req, res, app) {
-  const redirectUrl = await Shopify.Auth.beginAuth(
-    req,
-    res,
-    req.query.shop,
-    "/api/auth/callback",
-    app.get("use-online-tokens")
-  );
-
-  return res.redirect(redirectUrl);
+  await shopify.auth.begin({
+    rawRequest: req,
+    rawResponse: res,
+    shop: req.query.shop,
+    callbackPath: "/api/auth/callback",
+    isOnline: app.get("use-online-tokens"),
+  });
 }
```

### 14. Update the `index.js` file

Pulling it all together!

```diff
 import { join } from "path";
 import { readFileSync } from "fs";
 import express from "express";
 import cookieParser from "cookie-parser";
-import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
+import { DeliveryMethod } from "@shopify/shopify-api";

+import shopify from "./shopify.js";
 import applyAuthMiddleware from "./middleware/auth.js";
 import verifyRequest from "./middleware/verify-request.js";
 import { setupGDPRWebHooks } from "./gdpr.js";
 import productCreator from "./helpers/product-creator.js";
 import redirectToAuth from "./helpers/redirect-to-auth.js";
-import { BillingInterval } from "./helpers/ensure-billing.js";
 import { AppInstallations } from "./app_installations.js";
+import { sqliteSessionStorage } from "./sqlite-session-storage.js";

 const USE_ONLINE_TOKENS = false;

 const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

 // TODO: There should be provided by env vars
 const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
 const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

-const DB_PATH = `${process.cwd()}/database.sqlite`;
-
-Shopify.Context.initialize({
-  API_KEY: process.env.SHOPIFY_API_KEY,
-  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
-  SCOPES: process.env.SCOPES.split(","),
-  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
-  HOST_SCHEME: process.env.HOST.split("://")[0],
-  API_VERSION: LATEST_API_VERSION,
-  IS_EMBEDDED_APP: true,
-  // This should be replaced with your preferred storage strategy
-  // See note below regarding using CustomSessionStorage with this template.
-  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
-  ...(process.env.SHOP_CUSTOM_DOMAIN && {CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN]}),
-});
-
-// NOTE: If you choose to implement your own storage strategy using
-// Shopify.Session.CustomSessionStorage, you MUST implement the optional
-// findSessionsByShopCallback and deleteSessionsCallback methods.  These are
-// required for the app_installations.js component in this template to
-// work properly.
-
```

:warning: :warning: **Note** the use of `await` before the call to `shopify.webhooks.addHandlers`.

```diff
-Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
-  path: "/api/webhooks",
-  webhookHandler: async (_topic, shop, _body) => {
-    await AppInstallations.delete(shop);
+await shopify.webhooks.addHandlers({
+  APP_UNINSTALLED: {
+    deliveryMethod: DeliveryMethod.Http,
+    callbackUrl: "/api/webhooks",
+    callback: async (_topic, shop, _body) => {
+      await AppInstallations.delete(shop);
+    },
   },
 });

-// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
-// See the ensureBilling helper to learn more about billing in this template.
-const BILLING_SETTINGS = {
-  required: false,
-  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
-  // chargeName: "My Shopify One-Time Charge",
-  // amount: 5.0,
-  // currencyCode: "USD",
-  // interval: BillingInterval.OneTime,
-};
-
 // This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
 // in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
 // the code when you store customer data.
 //
 // More details can be found on shopify.dev:
 // https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks
 setupGDPRWebHooks("/api/webhooks");

 // export for test use only
 export async function createServer(
   root = process.cwd(),
-  isProd = process.env.NODE_ENV === "production",
-  billingSettings = BILLING_SETTINGS
+  isProd = process.env.NODE_ENV === "production"
 ) {
   const app = express();

   app.set("use-online-tokens", USE_ONLINE_TOKENS);
-  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
+  app.use(cookieParser(shopify.config.apiSecretKey));

-  applyAuthMiddleware(app, {
-    billing: billingSettings,
-  });
+  applyAuthMiddleware(app);
```

:warning: :warning: **Note** the use of a plain text bodyparser for the `/api/webhooks` endpoint - this sets `req.body` to a plain text version of the body that is expected by the webhook handlers.

```diff
-  // Do not call app.use(express.json()) before processing webhooks with
-  // Shopify.Webhooks.Registry.process().
-  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/guides/webhooks.md#note-regarding-use-of-body-parsers
-  // for more details.
-  app.post("/api/webhooks", async (req, res) => {
+  app.post("/api/webhooks", express.text({ type: "*/*" }), async (req, res) => {
     try {
-      await Shopify.Webhooks.Registry.process(req, res);
+      await shopify.webhooks.process({
+        rawBody: req.body,
+        rawRequest: req,
+        rawResponse: res,
+      });
       console.log(`Webhook processed, returned status code 200`);
     } catch (e) {
       console.log(`Failed to process webhook: ${e.message}`);
       if (!res.headersSent) {
         res.status(500).send(e.message);
       }
     }
   });

+  // All endpoints after this point will have access to a request.body
+  // attribute, as a result of the express.json() middleware
+  app.use(express.json());
+
   // All endpoints after this point will require an active session
-  app.use(
-    "/api/*",
-    verifyRequest(app, {
-      billing: billingSettings,
-    })
-  );
+  app.use("/api/*", verifyRequest(app));

   app.get("/api/products/count", async (req, res) => {
-    const session = await Shopify.Utils.loadCurrentSession(
-      req,
-      res,
-      app.get("use-online-tokens")
-    );
+    const sessionId = await shopify.session.getCurrentId({
+      rawRequest: req,
+      rawResponse: res,
+      isOnline: app.get("use-online-tokens"),
+    });
+    const session = await sqliteSessionStorage.loadSession(sessionId);

-    const { Product } = await import(
-      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
-    );

-    const countData = await Product.count({ session });
+    const countData = await shopify.rest.Product.count({ session });
     res.status(200).send(countData);
   });

   app.get("/api/products/create", async (req, res) => {
-    const session = await Shopify.Utils.loadCurrentSession(
-      req,
-      res,
-      app.get("use-online-tokens")
-    );
+    const sessionId = await shopify.session.getCurrentId({
+      rawRequest: req,
+      rawResponse: res,
+      isOnline: app.get("use-online-tokens"),
+    });
+
+    const session = await sqliteSessionStorage.loadSession(sessionId);
     let status = 200;
     let error = null;

     try {
       await productCreator(session);
     } catch (e) {
       console.log(`Failed to process products/create: ${e.message}`);
       status = 500;
       error = e.message;
     }
     res.status(status).send({ success: status === 200, error });
   });

-  // All endpoints after this point will have access to a request.body
-  // attribute, as a result of the express.json() middleware
-  app.use(express.json());
-
   app.use((req, res, next) => {
-    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
-    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
+    const shop = shopify.utils.sanitizeShop(req.query.shop);
+    if (shopify.config.isEmbeddedApp && shop) {
       res.setHeader(
         "Content-Security-Policy",
         `frame-ancestors https://${encodeURIComponent(
           shop
         )} https://admin.shopify.com;`
       );
     } else {
       res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
     }
     next();
   });

   if (isProd) {
     const compression = await import("compression").then(
       ({ default: fn }) => fn
     );
     const serveStatic = await import("serve-static").then(
       ({ default: fn }) => fn
     );
     app.use(compression());
     app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
   }

   app.use("/*", async (req, res, next) => {
     if (typeof req.query.shop !== "string") {
       res.status(500);
       return res.send("No shop provided");
     }

-    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
+    const shop = shopify.utils.sanitizeShop(req.query.shop);
     const appInstalled = await AppInstallations.includes(shop);

     if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
       return redirectToAuth(req, res, app);
     }

```

:warning: :warning: **Note** the use of `await` before the call to `getEmbeddedAppUrl`.

```diff
-    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
-      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);
+    if (shopify.config.isEmbeddedApp && req.query.embedded !== "1") {
+      const embeddedUrl = await shopify.auth.getEmbeddedAppUrl({
+        rawRequest: req,
+        rawResponse: res,
+      });

       return res.redirect(embeddedUrl + req.path);
     }

     const htmlFile = join(
       isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
       "index.html"
     );

     return res
       .status(200)
       .set("Content-Type", "text/html")
       .send(readFileSync(htmlFile));
   });

   return { app };
 }

 createServer().then(({ app }) => app.listen(PORT));
```
