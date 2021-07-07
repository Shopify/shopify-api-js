# Getting started

Before you start building your app, you'll need to perform the steps below.

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

If your application is in a Git repository, you should **make sure to add these files to `.gitignore`**.

```
.env
dist
node_modules
```

**Important:** If you ever accidentally commit your API secret to GitHub or any other third party, you can follow [this tutorial](https://shopify.dev/tutorials/rotate-revoke-api-credentials) on how to generate new credentials for your application.

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
      "*": ["node_modules/*"]
    }
  },
  "include": ["src/**/*"]
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

## Set up Context

First of all, in your `src/index.ts` file, you'll need to set up your application, and initialize the Shopify library. Note that you only need to set up `Context` once when your app is loaded, and the library will automatically use those settings whenever they are needed.

While setting up `Context`, you'll be able to set [which version of the Admin API](https://shopify.dev/concepts/about-apis/versioning) your app will be using. All supported versions are available in `ApiVersion`, including `'unstable'`. The `Context.API_VERSION` setting will be applied to all requests made by the library.

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
async function onRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<void> {
  const {headers, url: req_url} = request;
  const pathName: string | null = url.parse(req_url).pathname;
  const queryString: string = String(url.parse(req_url).query);
  const query: Record<string, any> = querystring.parse(queryString);

  if (pathName === '/') {
    // check if we're logged in/authorized
    const currentSession = await Shopify.Utils.loadCurrentSession(
      request,
      response,
    );
    if (!currentSession) {
      // not logged in, redirect to login
      response.writeHead(302, {Location: `/login`});
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

Once your files are set up, you can open your app in your browser to start adding features to it.

- Start your `ngrok` tunnel and add the displayed `ngrok` URL to the app setup in your admin, along with the redirect route
  ```shell
  $ ngrok http 3000
  ```
- Run `yarn start` and you should have your app running on your specified `localhost`
- Access the HTTPS address provided by `ngrok` to reach your app

[Back to guide index](README.md)
