# `@shopify/shopify-api`

<!-- ![Build Status]() -->
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
<!-- [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api) -->

TypeScript API supporting authentication, GraphQL and REST client, and registration/receipt of webhooks for [Shopify](https://www.shopify.ca/) applications.

# Usage and examples

**Requirements**

To follow these usage guides, you will need to:
- have a basic understanding of [Node](https://nodejs.org) and of [TypeScript](https://typescriptlang.org)
- have a Shopify Partner account and development store
- _OR_ have a test store where you can create a private app
- have a private or custom app already set up in your test store or partner account
- use [ngrok](https://ngrok.com), in order to create a secure tunnel to your app running on your localhost
- add the `ngrok` URL and the appropriate redirect for your OAuth callback route to your app settings

**Environment**

You'll need your application to load the API secret and API secret key (found when you create an app in your Partner Account). The mechanism is entirely up to you. For example, you could use a library like `dotenv` to read them from a `.env` file, or set environment variables with the values. However you do it, be sure to NOT save the API secret and key in GitHub or other code repository where others can view them.

## Express

For this guide, basic understanding of the [Express](https://expressjs.com/) app framework is required.

**Install dependencies**
- This step will generate your app's `package.json` and install the following necessary dependencies:
  - `@shopify/shopify-api` - this library
  - `express` - the Express framework
  - `dotenv` - tool to read from `.env` files
  - `typescript` - TypeScript language
  - `@types/express` - Express types

```shell
$ yarn init -y
$ yarn add @shopify/shopify-api express
$ yarn add --dev dotenv typescript @types/express
```

**Set up environment**

Begin by placing the following in an `.env` file at the root of your project:
- Your API secret
- Your API secret key
- Your app's host, without the protocol prefix (in this case we used an `ngrok` tunnel to provide a secure connection to our localhost)
- Your test store URL
- Your app's required scopes
  ```
  SHOP={dev store url}
  API_KEY={api key}
  API_SECRET_KEY={api secret key}
  SCOPES={scopes}
  HOST={your app's host, we used ngrok}
  ```

**Set up base files**

- Add the following `tsconfig.json` in the root of your project:
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
- Add the following `scripts` to your `package.json`:
  ```json
  "scripts": {
    "build": "npx tsc",
    "prestart": "yarn run build",
    "start": "node dist/index.js"
  },
  ```
- Create `src/index.ts`

**Add imports, environment variables, and set up `Context`**

```ts
// src/index.ts
import express from 'express';
import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
require('dotenv').config()

const app = express()

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: {boolean},
  API_VERSION: ApiVersion.{version} // all supported versions are available, as well as "unstable" and "unversioned"
})

// the rest of the example code goes here

app.listen(3000, () => {
  console.log('your app is now listening on port 3000')
})
```

**Add a route to start OAuth**

- This route will be used to begin the OAuth process, by using the library's built-in method and redirecting to the returned URL
- The `beginAuth` function takes in the `request` and `response` objects, along with the target shop _(string)_, redirect route _(string)_, and whether or not you are requesting "online access" _(boolean)_
- Your route callback should be `async` in order to `await` the return value, since `beginAuth` returns a `Promise`
  ```ts
  app.get('/oauth/begin', async (req, res) => {
    let authRoute = await Shopify.Auth.OAuth.beginAuth(req, res, SHOP, '/auth/callback', true)
    return res.redirect(authRoute)
  })
  ```

**Add your OAuth callback route**

- This route will use the built-in `validateAuthCallback` method
- This method takes in the `request` and `response` object, as well as the `req.query` object
- This method _has no return value_, so you should `catch` any errors it may throw
- This method also returns a `Promise` so you should use `async/await` here as well
  ```ts
  app.get('/auth/callback', async (req, res) => {
    try {
      await Shopify.Auth.OAuth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted
    } catch (error) {
      console.error(error); // in practice these should be handled more gracefully
    }
    return res.redirect('/'); // wherever you want your user to end up after OAuth completes
  })
  ```

**Make a REST API call**

- Once OAuth is complete, we can use the built-in `RestClient` to make an API call
- Create an instance of `RestClient` using the current shop URL and session `accessToken`
- Use `client.get` to request some `products`
  ```ts
  app.get('/shopify/rest-call', async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res) // load the current session to get the `accessToken`
    const client = new Shopify.Clients.Rest.RestClient(session.shop, session.accessToken) // create a new client for the specified shop
    const products = await client.get({ // use client.get to request the REST endpoint you need, in this case "products"
       path: 'products'
    })
    res.send(products) // do something with the returned data
  })
  ```

**Make a GraphQL API call**

- You can also use the `GraphQLClient` to make requests to the GraphQL API in a similar way
- Create an instance of `GraphQLClient` using the current shop URL and session `accessToken`
- Use `client.query` to make your request, passing your query as `data`
  ```ts
    app.get('/shopify/graphql-call', async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res) // load the current session to get the `accessToken`
    const client = new Shopify.Clients.Graphql.GraphqlClient(session.shop, session.accessToken) // GraphQLClient accepts the same arguments as RestClient
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
    })
    res.send(products) // do something with the returned data
  })
  ```

**Running your app**

- Start your `ngrok` tunnel and add the displayed `ngrok` URL to the app setup in your admin, along with the redirect route
  ```shell
  $ ngrok http 3000
  ```
- Run `yarn start` and you should have your app running on your specified `localhost`
- In your browser, navigate to `{your ngrok address}/oauth/begin` to begin OAuth
- When OAuth completes, navigate to your REST and GraphQL endpoints to see the requested data being returned

## Node (no framework)

**Install dependencies**

- This step will generate your app's `package.json` and install the following necessary dependencies:
  - `@shopify/shopify-api` - this library
  - `dotenv` - tool to read from `.env` files
  - `typescript` - TypeScript language
  - `@types/node` - Node types

```shell
$ yarn init -y
$ yarn add @shopify/shopify-api
$ yarn add --dev dotenv typescript @types/node
```

**Setup environment**

Begin by placing the following in an `.env` file at the root of your project:
- Your API secret
- Your API secret key
- Your app's host, without the protocol prefix (in this case we used an `ngrok` tunnel to provide a secure connection to our localhost)
- Your test store URL
- Your app's required scopes
  ```
  SHOP={dev store url}
  API_KEY={api key}
  API_SECRET_KEY={api secret key}
  SCOPES={scopes}
  HOST={your app's host, we used ngrok}
  ```

**Set up base files**

- Add the following `tsconfig.json` in the root of your project:
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
- Add the following `scripts` to your `package.json`:
  ```json
  "scripts": {
    "build": "npx tsc",
    "prestart": "yarn run build",
    "start": "node dist/index.js"
  },
  ```
- Create `src/index.ts`

**Add imports, environment variables, and set up `Context`**

```typescript
// src/index.ts
import http from 'http';
import url from 'url';
import querystring from 'querystring';
import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
require('dotenv').config()

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

**Create a basic Node router**

```typescript
:
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

**Add a route to start OAuth**

The route for starting the OAuth process (in this case `/login`) will use the library's `beginAuth` method.  The `beginAuth` method takes in the request and response objects (from the `http` server), along with the target shop (string), redirect route (string), and whether or not you are requesting "online access" (boolean).  The method will return a URI that will be used for redirecting the user to the Shopify Authentication screen.

```typescript
  :
  } // end of if(pathName === '/')

  if (pathName === '/login') {
    // process login action
    try {
      const authRoute = await Shopify.Auth.OAuth.beginAuth(request, response, SHOP, callbackPath);

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

**Add your OAuth callback route**

After the app is authenticated with Shopify, the Shopify platform will send a request back to your app using this route (which you provided as a parameter to `beginAuth`, above).  Your app will now use the provided `validateAuthCallback` method to finalize the OAuth process.

```typescript
  :
  } // end of if (pathName === '/login')

  if (pathName === callbackPath) {
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
  } // end of if (pathName === 'callbackPath')
}  // end of onRequest()

http.createServer(onRequest).listen(3000);
```

**Register a Webhook**

If your application's functionality depends on knowing when events occur on a given store, you need to register a Webhook. You should register your webhooks after the OAuth process completes.

```typescript
  :
  } // end of if (pathName === '/login')

  if (pathName === callbackPath) {
    try {
      await Shopify.Auth.OAuth.validateAuthCallback(request, response, query as AuthQuery);

      // all good, register any required webhooks
      const handleWebhookRequest = (topic: string, shop_domain: string, webhookRequestBody: Buffer) => {
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
      :
```

**Process a Webhook**

To process a webhook, you need to listen on the route(s) you provided during the Webhook registration process, then call the appropriate handler.  The library provides a convenient `process` method which takes care of calling the correct handler for the registered Webhook topics.

```typescript
  :
  } // end of if (pathName === 'callbackPath')

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

**Running your app**

- Start your `ngrok` tunnel and add the displayed `ngrok` URL to the app setup in your admin, along with the redirect route
  ```shell
  $ ngrok http 3000
  ```
- Run `yarn start` and you should have your app running on your specified `localhost`
- In your browser, navigate to `{your ngrok address}/login` to begin OAuth
