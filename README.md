# `@shopify/shopify-api`

<!-- ![Build Status]() -->
<<<<<<< HEAD

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for the backends of TypeScript/JavaScript [Shopify](https://www.shopify.com) apps to access the [Shopify Admin API](https://shopify.dev/docs/admin-api), by making it easier to perform the following actions:

- Creating [online](https://shopify.dev/apps/auth#online-access) or [offline](https://shopify.dev/apps/auth#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/admin-api/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/admin-api/graphql/reference)
- Register/process webhooks

Once your app has access to the Admin API, you can also access the [Shopify Storefront API](https://shopify.dev/docs/storefront-api) to run GraphQL queries using the `unauthenticated_*` access scopes.

This library can be used in any application that runs on one of the supported runtimes. It doesn't rely on any specific framework, so you can include it alongside your preferred stack and only use the features that you need to build your app.

**Note**: this package will enable your app's backend to work with Shopify APIs, but you'll need to use [Shopify App Bridge](https://shopify.dev/apps/tools/app-bridge) in your frontend if you're planning on embedding your app into the Shopify Admin.
=======
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for TypeScript / JavaScript [Shopify](https://www.shopify.com) Apps to access the [Shopify Admin API](https://shopify.dev/docs/admin-api), by making it easier to perform the following actions:
>>>>>>> d7f82fef (Improve README layout)

- Creating [online](https://shopify.dev/concepts/about-apis/authentication#online-access) or [offline](https://shopify.dev/concepts/about-apis/authentication#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/admin-api/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/admin-api/graphql/reference)
- Register / process webhooks

This library can be used in any application that has a Node.js backend, since it doesn't rely on any specific framework - you can include it alongside your preferred stack and only use the features that you need to build your App.

# Requirements

To follow these usage guides, you will need to:

- have a basic understanding of [TypeScript](https://www.typescriptlang.org/)
- have a Shopify Partner account and development store
- _OR_ have a test store where you can create a private app
- have a private or custom app already set up in your test store or partner account
- use [ngrok](https://ngrok.com), in order to create a secure tunnel to your app running on your localhost
- add the `ngrok` URL and the appropriate redirect for your OAuth callback route to your app settings
- have a JavaScript package manager such as [yarn](https://yarnpkg.com) installed

## Getting started

<<<<<<< HEAD
To install this package, you can run this on your terminal:

```bash
# You can use your preferred Node package manager
yarn add @shopify/shopify-api
=======
# Getting started

Before your App can make any requests to the Shopify backend, you'll need to set up a few environment variables so you can initialize the library.

## Install dependencies

This step will generate your app's `package.json` and install the following necessary dependencies:
- `@shopify/shopify-api` - this library
- `dotenv` - tool to read from `.env` files
- `typescript` - TypeScript language

Furthermore, if using Express you will also need to add the `express` package as a dependency.

Examples:

<details>
  <summary>Node.js</summary>

  ```shell
  $ yarn init -y
  $ yarn add @shopify/shopify-api
  $ yarn add --dev dotenv typescript @types/node
  ```
</details>

<details>
  <summary>Express</summary>

  ```shell
  $ yarn init -y
  $ yarn add @shopify/shopify-api express
  $ yarn add --dev dotenv typescript @types/express
  ```
</details>

## Set up base files

This example app will require at least the following files to work, and their contents are listed below.

```bash
package.json # Created in the previous step
.env
tsconfig.json
src/
  index.ts
>>>>>>> d7f82fef (Improve README layout)
```

**Note**: throughout these docs, we'll provide some examples of how this library may be used in an app using the [Express.js](https://expressjs.com/) framework for simplicity, but you can use it with any framework you prefer, as mentioned before.

The first thing you need to import is the adapter for your app's runtime. This will internally set up the library to use the right defaults and behaviours for the runtime.

<<<<<<< HEAD
<div>Node.js
=======
Add the following `scripts` section to your `package.json` so you can easily build / start your App:
```json
"scripts": {
  "build": "npx tsc",
  "prestart": "yarn run build",
  "start": "node dist/index.js"
},
```

## Set up environment

You'll need your application to load the API secret and API secret key (found when you create an app in your Partner Account). The mechanism for loading these values is entirely up to you - this example uses the `dotenv` library to read them from a `.env` file, but it is common practice to set environment variables with the values in production environments.

However you choose to do it, be sure to NOT save the API secret and key in GitHub or other code repository where others can view them, as that information can be used to forge requests for your Shopify App.

Begin by placing the following in an `.env` file at the root of your project:
  ```yaml
  SHOP={dev store url}            # Your test store URL
  API_KEY={api key}               # Your API secret
  API_SECRET_KEY={api secret key} # Your API secret key
  SCOPES={scopes}                 # Your app's required scopes
  HOST={your app's host}          # Your app's host, without the protocol prefix (in this case we used an `ngrok` tunnel to provide a secure connection to our localhost)
  ```

## Add imports, environment variables, and set up `Context`

First of all, in your `src/index.ts` file, you'll need to set up your application, and initialize the Shopify library. Note that you only need to set up `Context` once when your App is loaded, and the library will automatically use those settings whenever they are needed.

<details>
  <summary>Node.js</summary>

  ```typescript
  // src/index.ts
  import http from 'http';
  import url from 'url';
  import querystring from 'querystring';
  import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
  require('dotenv').config();

  const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env

  Shopify.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: {boolean},
    API_VERSION: ApiVersion.{version} // all supported versions are available, as well as "unstable" and "unversioned"
  });
  ```

  You will also need to set up a basic router to be able to process requests:

  ```typescript
  async function onRequest(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    const { headers, url: req_url } = request;
    const pathName: string | null = url.parse(req_url).pathname;
    const queryString: string = (String)(url.parse(req_url).query);
    const query: Record<string, any> = querystring.parse(queryString);

    if (pathName === '/') {
      // check if we're logged in/authorized
      const currentSession = await Shopify.Utils.loadCurrentSession(request, response);
      if(!currentSession) {
        // not logged in, redirect to login
        response.writeHead(302, { 'Location': `/login` });
        response.end();
      } else {
        // do something amazing with your application!
      }
      return;
    } // end of if(pathName === '/')
  } // end of onRequest()

  http.createServer(onRequest).listen(3000);
  ```
</details>

<details>
  <summary>Express</summary>

  ```ts
  // src/index.ts
  import express from 'express';
  import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
  require('dotenv').config();

  const app = express();

  const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

  Shopify.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: {boolean},
    API_VERSION: ApiVersion.{version} // all supported versions are available, as well as "unstable" and "unversioned"
  });

  // the rest of the example code goes here

  app.listen(3000, () => {
    console.log('your app is now listening on port 3000');
  });
  ```
</details>

## Running your App

- Start your `ngrok` tunnel and add the displayed `ngrok` URL to the app setup in your admin, along with the redirect route
  ```shell
  $ ngrok http 3000
  ```
- Run `yarn start` and you should have your app running on your specified `localhost`
- Access the HTTPS address provided by `ngrok` to reach your app

# Using the library

Now that the library is set up for your project, you'll be able to use it to start adding functionality to your App. In this section you'll find instructions for all the features available in the library.

## Add a route to start OAuth

The route for starting the OAuth process (in this case `/login`) will use the library's `beginAuth` method.  The `beginAuth` method takes in the request and response objects (from the `http` module), along with the target shop _(string)_, redirect route _(string)_, and whether or not you are requesting [online access](https://shopify.dev/concepts/about-apis/authentication#api-access-modes) _(boolean)_.  The method will return a URI that will be used for redirecting the user to the Shopify Authentication screen.

<details>
  <summary>Node.js</summary>

  ```typescript
    :
    } // end of if(pathName === '/')

    if (pathName === '/login') {
      // process login action
      try {
        const authRoute = await Shopify.Auth.OAuth.beginAuth(request, response, SHOP, '/auth/callback');

        response.writeHead(302, { 'Location': authRoute });
        response.end();
      }
      catch (e) {
        console.log(e);

        response.writeHead(500);
        if (e instanceof Shopify.Errors.ShopifyError) {
          response.end(e.message);
        }
        else {
          response.end(`Failed to complete OAuth process: ${e.message}`);
        }
      }
      return;
    } // end of if (pathName === '/login')
  } // end of onRequest()

  http.createServer(onRequest).listen(3000);
  ```
</details>

<details>
  <summary>Express</summary>

  ```ts
  app.get('/login', async (req, res) => {
    let authRoute = await Shopify.Auth.OAuth.beginAuth(req, res, SHOP, '/auth/callback', true);
    return res.redirect(authRoute);
  })
  ```
</details>

## Add your OAuth callback route

After the app is authenticated with Shopify, the Shopify platform will send a request back to your app using this route (which you provided as a parameter to `beginAuth`, above). Your app will now use the provided `validateAuthCallback` method to finalize the OAuth process. This method _has no return value_, so you should `catch` any errors it may throw.

<details>
  <summary>Node.js</summary>

  ```typescript
    } // end of if (pathName === '/login')

    if (pathName === '/auth/callback') {
      try {
        await Shopify.Auth.OAuth.validateAuthCallback(request, response, query as AuthQuery);

        // all good, redirect to '/'
        response.writeHead(302, { 'Location': '/' });
        response.end();
      }
      catch (e) {
        console.log(e);

        response.writeHead(500);
        if (e instanceof Shopify.Errors.ShopifyError) {
          response.end(e.message);
        }
        else {
          response.end(`Failed to complete OAuth process: ${e.message}`);
        }
      }
      return;
    } // end of if (pathName === '/auth/callback'')
  }  // end of onRequest()

  http.createServer(onRequest).listen(3000);
  ```
</details>

<details>
  <summary>Express</summary>

  ```ts
  app.get('/auth/callback', async (req, res) => {
    try {
      await Shopify.Auth.OAuth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted
    } catch (error) {
      console.error(error); // in practice these should be handled more gracefully
    }
    return res.redirect('/'); // wherever you want your user to end up after OAuth completes
  });
  ```
</details>

After process is completed, you can navigate to `{your ngrok address}/oauth/begin` in your browser to begin OAuth. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, as detailed next.

## Make a REST API call

Once OAuth is complete, we can use the library's `RestClient` to make an API call. To do that, you can create an instance of `RestClient` using the current shop URL and session `accessToken` to make requests to the Admin API.

You can run the code below in any endpoint where you have access to a request and response objects.
>>>>>>> d7f82fef (Improve README layout)

```ts
import '@shopify/shopify-api/adapters/node';
```

</div><div>CloudFlare Worker

```ts
import '@shopify/shopify-api/adapters/cf-worker';
```

</div>

Next, configure the library - you'll need some values in advance:

- Your app's API key from [Partners dashboard](https://www.shopify.com/partners)
- Your app's API secret from Partners dashboard
- The [scopes](https://shopify.dev/api/usage/access-scopes) you need for your app

Call `shopifyApi` ([see reference](./docs/reference/shopifyApi.md)) to create your library object before setting up your app itself:

```ts
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'ngrok-tunnel-address',
  ...
});

const app = express();
```

### Next steps

Once you configure your app, you can use this package to access the Shopify APIs.
See the specific documentation in the [Features section](#features) for instructions on how to get API access tokens and use them to query the APIs.

As a general rule, apps will want to interact with the Admin API to fetch / submit data to Shopify.
To do that, apps will need to:

1. Create an Admin API access token by going through [the OAuth flow](docs/usage/oauth.md).
1. Set up its own endpoints to:
   1. [Fetch the current session](docs/usage/oauth.md#using-sessions) created in the OAuth process.
   1. Create a [REST](docs/usage/rest.md) or [GraphQL](docs/usage/graphql.md) API client.
   1. Use the client to query the appropriate [Admin API](https://shopify.dev/api/admin).

## Features

- [OAuth](docs/usage/oauth.md)
  - [Start endpoint](docs/usage/oauth.md#start-endpoint)
  - [Callback endpoint](docs/usage/oauth.md#callback-endpoint)
  - [Using sessions](docs/usage/oauth.md#using-sessions)
  - [Detecting scope changes](docs/usage/oauth.md#detecting-scope-changes)
- [REST Admin API client](docs/usage/rest.md)
  - [Using REST resources](docs/usage/rest.md#using-rest-resources)
- [GraphQL Admin API client](docs/usage/graphql.md)
- [GraphqL Storefront API client](docs/usage/storefront.md)
- [Webhooks](docs/usage/webhooks.md)
  - [Register a Webhook](docs/usage/webhooks.md#register-a-webhook)
  - [Process a Webhook](docs/usage/webhooks.md#process-a-webhook)
- [Billing](docs/usage/billing.md)
<<<<<<< HEAD
- [Adding custom runtimes](docs/usage/runtimes.md)
=======
>>>>>>> 85c72bea (Add billing support)
- [Known issues and caveats](docs/issues.md)
  - [Notes on session handling](docs/issues.md#notes-on-session-handling)

## Migrating to v6

Before v6, this library only worked on Node.js runtimes. It now supports multiple runtimes through the use of adapters, more of which can be added over time.
If an adapter for the runtime you wish to use doesn't exist, you can create your own adapter by implementing some key functions, or contribute a PR to this repository.

<<<<<<< HEAD
In addition to updating the library to work on different runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
If you're upgrading an existing app on v5 or earlier, please see [the migration guide for v6](docs/migrating-to-v6.md).
=======
## Process a Webhook

To process a webhook, you need to listen on the route(s) you provided during the Webhook registration process, then call the appropriate handler.  The library provides a convenient `process` method which takes care of calling the correct handler for the registered Webhook topics.

<details>
  <summary>Node.js</summary>

  ```typescript
    } // end of if (pathName === '/auth/callback')

    if (Shopify.Webhooks.Registry.isWebhookPath(pathName)) {
      let data: Buffer[] = [];
      request.on('data', function (chunk: Buffer) {
        data.push(chunk)
      }).on('end', function () {
        const buffer: Buffer = Buffer.concat(data);
        try {
          const result = Shopify.Webhooks.Registry.process({ headers: headers, body: buffer });

          response.writeHead(result.statusCode, result.headers);
          response.end();
        }
        catch (e) {
          console.log(e);

          response.writeHead(500);
          if (e instanceof Shopify.Errors.ShopifyError) {
            response.end(e.message);
          }
          else {
            response.end(`Failed to complete webhook processing: ${e.message}`);
          }
        }
      });

      return;
    } // end of if (Shopify.Webhooks.Registry.isWebhookPath(pathName))
  }  // end of onRequest()

  http.createServer(onRequest).listen(3000);
  ```
</details>

<details>
  <summary>Express</summary>

  ```typescript
  app.post('/webhooks', async (req, res) => {
    try {
      const result = Shopify.Webhooks.Registry.process({ headers: req.headers, body: req.body });

      response.writeHead(result.statusCode, result.headers);
      response.end();
    }
    catch (e) {
      console.log(e);

      response.writeHead(500);
      if (e instanceof Shopify.Errors.ShopifyError) {
        response.end(e.message);
      }
      else {
        response.end(`Failed to complete webhook processing: ${e.message}`);
      }
    }
  });
  ```
</details>

# Known issues and caveats

By following this guide, you will have a fully functional Shopify App. However, there are some things you should be aware of before using your new App in a production environment.

## Notes on session handling

Before you start writing your application, please note that the Shopify library stores some information for OAuth in sessions. Since each application may choose a different strategy to store information, the library cannot dictate any specific storage strategy. By default, `Shopify.Context` is initialized with `MemorySessionStorage`, which will enable you to start developing your app by storing sessions in memory. You can quickly get your app set up using it, but please keep the following in mind.

`MemorySessionStorage` is **purposely** designed to be a single-process, development-only solution. It **will leak** memory in most cases and delete all sessions when your app restarts. You should **never** use it in production apps. In order to use your preferred storage choice with the Shopify library, you'll need to perform a few steps:

- Create a class that extends the `SessionStorage` interface, and implements the following methods: `loadSession`, `storeSession`, and `deleteSession`.
- _OR_ Create a new instance of `CustomSessionStorage`, providing callbacks for these methods.
- Implement those methods so that they perform the necessary actions in your app's storage.
- Provide an instance of that class when calling `Shopify.Context.initialize`, for example:
```ts
  // src/my_session_storage.ts
  import { SessionStorage, Session } from '@shopify/shopify-api';

  class MySessionStorage extends SessionStorage {
    public async loadSession(sessionId: string) { ... }
    public async storeSession(session: Session) { ... }
    public async deleteSession(sessionId: string) { ... }
  }

  // src/index.ts
  Shopify.Context.initialize({
    ... // app settings
    SESSION_STORAGE: new MySessionStorage(),
  });
```
>>>>>>> d7f82fef (Improve README layout)
