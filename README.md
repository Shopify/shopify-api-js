# `@shopify/shopify-api`

<!-- ![Build Status]() -->
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/%40shopify%2Fshopify-api.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api)

This library provides support for TypeScript/JavaScript [Shopify](https://www.shopify.com) apps to access the [Shopify Admin API](https://shopify.dev/docs/admin-api), by making it easier to perform the following actions:

- Creating [online](https://shopify.dev/concepts/about-apis/authentication#online-access) or [offline](https://shopify.dev/concepts/about-apis/authentication#offline-access) access tokens for the Admin API via OAuth
- Making requests to the [REST API](https://shopify.dev/docs/admin-api/rest/reference)
- Making requests to the [GraphQL API](https://shopify.dev/docs/admin-api/graphql/reference)
- Register/process webhooks

This library can be used in any application that has a Node.js backend, since it doesn't rely on any specific framework—you can include it alongside your preferred stack and only use the features that you need to build your app.

# Requirements

To follow these usage guides, you will need to:
- have a basic understanding of [Node.js](https://nodejs.org) and of [TypeScript](https://typescriptlang.org)
- have a Shopify Partner account and development store
- _OR_ have a test store where you can create a private app
- have a private or custom app already set up in your test store or partner account
- use [ngrok](https://ngrok.com), in order to create a secure tunnel to your app running on your localhost
- add the `ngrok` URL and the appropriate redirect for your OAuth callback route to your app settings

This guide will provide instructions on how to create an app using plain Node.js code, or the [Express](https://expressjs.com/) framework. Both examples are written in Typescript.

# Getting started

Before you start building your app, you'll need to perform the steps below. This guide assumes you already have [yarn](https://yarnpkg.com/) installed.

## Install dependencies

This step will generate your app's `package.json` and install the following necessary dependencies:
- `@shopify/shopify-api`—this library
- `dotenv`—tool to read from `.env` files
- `typescript`—TypeScript language

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
```

If your application is in a Git repository, you should make sure to add these files to `.gitignore`:
```
.env
dist
node_modules
```

`tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "*": [
        "node_modules/*"
      ]
    }
  },
  "include": [
    "src/**/*"
  ]
}
```

Add the following `scripts` section to your `package.json` so you can easily build/start your app:
```json
"scripts": {
  "build": "npx tsc",
  "prestart": "yarn run build",
  "start": "node dist/index.js"
},
```

## Set up environment

You'll need your application to load the API key and API secret key (found when you create an app in your Partner Account). The mechanism for loading these values is entirely up to you—this example uses the `dotenv` library to read them from a `.env` file, but it is common practice to set environment variables with the values in production environments.

However you choose to do it, be sure to NOT save the API key and secret key in GitHub or other code repository where others can view them, as that information can be used to forge requests for your Shopify app.

Begin by placing the following in an `.env` file at the root of your project:
  ```yaml
  SHOP={dev store url}            # Your test store URL
  API_KEY={api key}               # Your API key
  API_SECRET_KEY={api secret key} # Your API secret key
  SCOPES={scopes}                 # Your app's required scopes
  HOST={your app's host}          # Your app's host, without the protocol prefix (in this case we used an `ngrok` tunnel to provide a secure connection to our localhost)
  ```

## Add imports, environment variables, and set up `Context`

First of all, in your `src/index.ts` file, you'll need to set up your application, and initialize the Shopify library. Note that you only need to set up `Context` once when your app is loaded, and the library will automatically use those settings whenever they are needed.

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

## Running your app

- Start your `ngrok` tunnel and add the displayed `ngrok` URL to the app setup in your admin, along with the redirect route
  ```shell
  $ ngrok http 3000
  ```
- Run `yarn start` and you should have your app running on your specified `localhost`
- Access the HTTPS address provided by `ngrok` to reach your app

# Using the library

Now that the library is set up for your project, you'll be able to use it to start adding functionality to your app. In this section you'll find instructions for all the features available in the library.

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

```ts
  const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
  const client = new Shopify.Clients.Rest.RestClient(session.shop, session.accessToken); // create a new client for the specified shop
  const products = await client.get({ // use client.get to request the REST endpoint you need, in this case "products"
      path: 'products'
  });

  // do something with the returned data
```

## Make a GraphQL API call

You can also use the `GraphqlClient` to make requests to the GraphQL Admin API in a similar way. To do that, create an instance of `GraphqlClient` using the current shop URL and session `accessToken` in your app's endpoint.

```ts
  const session = await Shopify.Utils.loadCurrentSession(req, res); // load the current session to get the `accessToken`
  const client = new Shopify.Clients.Graphql.GraphqlClient(session.shop, session.accessToken); // GraphQLClient accepts the same arguments as RestClient
  const products = await client.query({ // use client.query and pass your query as `data`
    data: `{
      products (first: 10) {
        edges {
          node {
            id
            title
            bodyHtml
          }
        }
      }
    }`
  });
  // do something with the returned data
```

## Register a Webhook

If your application's functionality depends on knowing when events occur on a given store, you need to register a Webhook. You need an access token to register webhooks, so you should complete the OAuth process beforehand. In this example the webhook is being registered as soon as the authentication is completed.

The Shopify library enables you to handle all Webhooks in a single endpoint (see **Process a Webhook** below), but you are not restricted to a single endpoint. Each topic you register can only be mapped to a single endpoint.

**Note**: The webhooks you register with Shopify are saved in the Shopify platform, but your handlers need to be reloaded whenever your server restarts. It is recommended to store your Webhooks in a persistent manner (for example, in a database) so that you can reload previously registered webhooks when your app restarts.

<details>
  <summary>Node.js</summary>

  ```typescript
    } // end of if (pathName === '/login')

    // Register webhooks after OAuth completes
    if (pathName === '/auth/callback') {
      try {
        await Shopify.Auth.OAuth.validateAuthCallback(request, response, query as AuthQuery);

        const handleWebhookRequest = (topic: string, shop: string, webhookRequestBody: Buffer) => {
          // this handler is triggered when a webhook is sent by the Shopify platform to your application
        }

        const currentSession = await Shopify.Utils.loadCurrentSession(request, response, false);

        const resp = await Shopify.Webhooks.Registry.register({
          path: '/webhooks',
          topic: 'PRODUCTS_CREATE',
          accessToken: currentSession.accessToken,
          shop: currentSession.shop,
          apiVersion: Context.API_VERSION,
          webhookHandler: handleWebhookRequest
        });
        response.writeHead(302, { 'Location': '/' });
        response.end();
      }
      catch (e) {
        ...
  ```
</details>

<details>
  <summary>Express</summary>

  ```ts
  // Register webhooks after OAuth completes
  app.get('/auth/callback', async (req, res) => {
    try {
      await Shopify.Auth.OAuth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted

      const handleWebhookRequest = (topic: string, shop: string, webhookRequestBody: Buffer) => {
        // this handler is triggered when a webhook is sent by the Shopify platform to your application
      }

      const currentSession = await Shopify.Utils.loadCurrentSession(request, response, false);

      const resp = await Shopify.Webhooks.Registry.register({
        path: '/webhooks',
        topic: 'PRODUCTS_CREATE',
        accessToken: currentSession.accessToken,
        shop: currentSession.shop,
        apiVersion: Context.API_VERSION,
        webhookHandler: handleWebhookRequest
      });
    } catch (error) {
      console.error(error); // in practice these should be handled more gracefully
    }
    return res.redirect('/'); // wherever you want your user to end up after OAuth completes
  });
  ```
</details>

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

By following this guide, you will have a fully functional Shopify app. However, there are some things you should be aware of before using your new app in a production environment.

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
