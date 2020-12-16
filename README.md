# `@shopify/shopify-api`

<!-- ![Build Status]() -->
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
<!-- [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fshopify-api) -->

TypeScript API supporting authentication, graphql and REST client, and registration/receipt of webhooks for [Shopify](https://www.shopify.ca/) applications.

## Installation

```bash
$ yarn add @shopify/shopify-api
```

## Usage

### Express:
_This usage guide assumes a basic understanding of Express_

**Required Dependencies:** 
```shell
$ yarn add @shopify/shopify-api express
$ yarn add --dev dotenv typescript @types/express
```

**Setup ENV**: 

Begin by placing the following in an `.env` file at the root of your project: 
- Your API secret 
- Your API secret key
- Your app's host, without the protocol prefix (in this case we used an `ngrok` tunnel to provide a secure connection to our localhost) 
- Your test store url 
- Your app's required scopes 
  ```
  SHOP={dev store url}
  API_KEY={api key}
  API_SECRET_KEY={api secret key}
  SCOPES={scopes}
  HOST={your app's host, we used ngrok}
  ```
  
**Setup Base Files**: 

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
    "build": "tsc",
    "prestart": "yarn run build",
    "start": "node dist/index.js"
  },
  ```
- Create `src/index.ts`

**Add imports, ENV variables, and setup `Context`**: 

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

// the rest the example code goes here 

app.listen(3000, () => {
  console.log('your app is now listening on port 3000')
})
```

**Add a route to start OAuth**: 

- This route will be used to begin the OAuth process, by using the library's built-in method and redirecting to the returned URL 
- The `beginAuth` function takes in the `request` and `response` objects, along with the target shop _(string)_, redirect route _(string)_, and whether or not you are requesting "online access" _(boolean)_
- Your route callback should be `async` in order to `await` the return value, since `beginAuth` returns a `Promise` 
  ```ts
  app.get('/oauth/begin', async (req, res) => {
    let authRoute = await Shopify.Auth.OAuth.beginAuth(req, res, SHOP, '/auth/callback', true)
    return res.redirect(authRoute)
  })
  ```

**Add your OAuth callback route**:

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

**Make a REST API call**: 

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

**Make a GraphQL API call**: 
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

  **Running your app**:
  - Start your `ngrok` tunnel to your specified `localhost`, and add it to the app setup in your admin, along with the redirect route
  - Run `yarn start` and you should have your app running on your specified `localhost` 
  - In your browser, navigate to `{your ngrok address}/oauth/begin` to begin OAuth
  - When OAuth completes, navigate to your REST and GraphQL endpoints to see the requested data being returned
