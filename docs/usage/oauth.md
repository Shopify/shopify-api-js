# Performing OAuth

Once the library is set up for your project, you'll be able to use it to start adding functionality to your app. The first thing your app will need to do is to obtain an access token to the Admin API by performing the OAuth process.

To do that, you can follow the steps below.

## Add a route to start OAuth

The route for starting the OAuth process (in this case `/login`) will use the library's `beginAuth` method. The `beginAuth` method takes in the request and response objects (from the `http` module), along with the target shop _(string)_, redirect route _(string)_, and whether or not you are requesting [online access](https://shopify.dev/concepts/about-apis/authentication#api-access-modes) _(boolean)_. The method will return a URI that will be used for redirecting the user to the Shopify Authentication screen.

<details>
<summary>Node.js</summary>

```typescript
  } // end of if(pathName === '/')

  if (pathName === '/login') {
    // process login action
    try {
      const authRoute = await Shopify.Auth.beginAuth(request, response, SHOP, '/auth/callback');

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
  let authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    SHOP,
    '/auth/callback',
    true,
  );
  return res.redirect(authRoute);
});
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
      await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);

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
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/'); // wherever you want your user to end up after OAuth completes
});
```

</details>

After process is completed, you can navigate to `{your ngrok address}/login` in your browser to begin OAuth. When it completes, you will have a Shopify session that enables you to make requests to the Admin API, as detailed next.

You can use the `Shopify.Utils.loadCurrentSession()` method to load an online session automatically based on the current request. It will use cookies to load online sessions for non-embedded apps, and the `Authorization` header for token-based sessions in embedded apps, making all apps safe to use in modern browsers that block 3rd party cookies.

## Fetching sessions

As mentioned in the previous sections, you can use the OAuth methods to create both offline and online sessions. Once the process is completed, the session will be stored as per your `Context.SESSION_STORAGE` strategy, and can be retrieved with the below utitilies.

- To load a session, you can use the following method. You can load both online and offline sessions from the current request / response objects.

```ts
await Shopify.Utils.loadCurrentSession(request, response, isOnline);
```

- If you need to load a session for a background job, you can get offline sessions directly from the shop.

```ts
await Shopify.Utils.loadOfflineSession(shop);
```

**Note**: the `loadOfflineSession` method does not perform any validations on the `shop` parameter. You should avoid calling it from user inputs or URLs.

## Detecting scope changes

When the OAuth process is completed, the created session has a `scope` field which holds all of the scopes that were requested from the merchant at the time.

When an app's scopes change, it needs to request merchants to go through OAuth again to renew its permissions. The library provides an easy way for you to check whether that is the case at any point in your code:

```ts
const session: Session; // Loaded from one of the utility methods above

if (!Shopify.Context.SCOPES.equals(session.scope)) {
  // Scopes have changed, the app should redirect the merchant to OAuth
}
```

[Back to guide index](../README.md)
