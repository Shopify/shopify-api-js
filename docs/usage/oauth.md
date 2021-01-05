# Performing OAuth

<<<<<<< HEAD
After you set up the library for your project, you'll be able to use it to interact with the APIs, and add your own functionality.
The first thing your app will need to do is to get a token to access the Admin API by performing the OAuth process. Learn more about [OAuth on the Shopify platform](https://shopify.dev/apps/auth/oauth).

To perform OAuth, you will need to create two endpoints in your app:

1. [Start the process](#start-endpoint) by directing the merchant to Shopify to ask for permission to install the app.
1. [Return the merchant to your app](#callback-endpoint) once they approve the app installation, to set up a session with an API access token.

Once you complete the OAuth process, you'll be able to [use the session it creates](#using-sessions) to create API clients.

**Note**: private apps are unable to perform OAuth, because they don't require an access token to interact with API.

## Start endpoint

The route for starting the OAuth process (in this case `/auth`) will use the library's `auth.begin` ([see reference](../reference/auth/begin.md)) method. The method will set up the process and respond by redirecting the user to the Shopify Authentication screen, where the merchant will have to accept the required app scopes.

Example `/auth` endpoint in an Express.js app:

```ts
app.get('/auth', async (req, res) => {
  // The library will automatically redirect the user
  await shopify.auth.begin({
    shop: shopify.utils.sanitizeShop(req.query.shop, true),
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
});
```

Example `/auth` endpoint in a Cloudflare Worker:

```ts
async function handleFetch(request: Request): Promise<Response> {
  const {searchParams} = new URL(request.url);

  // The library will return a Response object
  return shopify.auth.begin({
    shop: shopify.utils.sanitizeShop(searchParams.get('shop'), true),
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: request,
  });
}
```

## Callback endpoint

Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `auth.begin`. Your app can then call `auth.callback` ([see reference](../reference/auth/callback.md)) to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers your app should respond with.

Example `/auth/callback` endpoint in an Express.js app:

```ts
app.get('/auth/callback', async (req, res) => {
  // The library will automatically set the appropriate HTTP headers
  const callback = await shopify.auth.callback({
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });

  // You can now use callback.session to make API requests

  res.redirect('/my-apps-entry-page');
});
```

Example `/auth/callback` endpoint in a Cloudflare Worker:

```ts
async function handleFetch(request: Request): Promise<Response> {
  const callback = await shopify.auth.callback<Headers>({
    isOnline: false,
    rawRequest: request,
  });

  // You can now use callback.session to make API requests

  // The callback returns some HTTP headers, but you can redirect to any route here
  return new Response('', {
    status: 302,
    // Headers are of type [string, string][]
    headers: [...callback.headers, ['Location', '/my-apps-entry-page']],
  });
}
```

## Using sessions

Once you set up both of the above endpoints, you can navigate to `{your ngrok address}/auth` in your browser to begin OAuth. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, for instance [the REST Admin API client](./rest.md).

### Loading a session while handling a request

To load a session while handling a request, you can use `shopify.session.getCurrent` to authenticate a request for both online and offline sessions:

```ts
app.get('/fetch-some-data', async (req, res) => {
  const session = await shopify.session.getCurrent({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  // Build a client and make requests with session.accessToken
  // See the REST, GraphQL, or Storefront API documentation for more information
});
```

> **Note**: this method will rely on cookies for non-embedded apps, and the `Authorization` HTTP header for embedded apps using [App Bridge session tokens](https://shopify.dev/apps/auth/oauth/session-tokens), making all apps safe to use in modern browsers that block 3rd party cookies.

For embedded apps, `shopify.session.getCurrent` will only be able to find a session if you use `authenticatedFetch` from the `@shopify/app-bridge-utils` client-side package. This function behaves like a [normal `fetch` call](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but ensures the appropriate headers are set.

Learn more about [making authenticated requests](https://shopify.dev/apps/auth/oauth/session-tokens/getting-started#step-2-authenticate-your-requests) using App Bridge.

### Loading a session for a background job

If your app needs to access the API while not handling a direct request, for example in a background job, you can use `shopify.session.getOffline` to load an offline access token for your script.

> **Note**: this method **_does not_** perform any validation on the `shop` parameter. You should **_never_** read the shop from user inputs or URLs.

```ts
const session = await shopify.session.getOffline({
  shop: '{exampleshop}.myshopify.com',
});
```

## Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the scopes that were requested from the merchant at the time.

When an app's scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

```ts
const session: Session; // Loaded from one of the methods above

if (!shopify.config.scopes.equals(session.scope)) {
  // Scopes have changed, the app should redirect the merchant to OAuth
}
```

This is useful if you have a middleware or pre-request check in your app to ensure that the session is still valid.

[Back to guide index](../../README.md#features)
=======
Once the library is set up for your project, you'll be able to use it to start adding functionality to your app. The first thing your app will need to do is to obtain an access token to the Admin API by performing the OAuth process.

To do that, you can follow the steps below.

## Add a route to start OAuth

The route for starting the OAuth process (in this case `/login`) will use the library's `beginAuth` method.  The `beginAuth` method takes in the request and response objects (from the `http` module), along with the target shop _(string)_, redirect route _(string)_, and whether or not you are requesting [online access](https://shopify.dev/concepts/about-apis/authentication#api-access-modes) _(boolean)_.  The method will return a URI that will be used for redirecting the user to the Shopify Authentication screen.

### Node.js

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

### Express

```ts
app.get('/login', async (req, res) => {
  let authRoute = await Shopify.Auth.OAuth.beginAuth(req, res, SHOP, '/auth/callback', true);
  return res.redirect(authRoute);
})
```

## Add your OAuth callback route

After the app is authenticated with Shopify, the Shopify platform will send a request back to your app using this route (which you provided as a parameter to `beginAuth`, above). Your app will now use the provided `validateAuthCallback` method to finalize the OAuth process. This method _has no return value_, so you should `catch` any errors it may throw.

### Node.js

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

### Express

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

After process is completed, you can navigate to `{your ngrok address}/oauth/begin` in your browser to begin OAuth. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, as detailed next.

[Back to guide index](../index.md)
>>>>>>> 256689b9 (Splitting getting started guide into docs pages)
