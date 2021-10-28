# Performing OAuth

Once the library is set up for your project, you'll be able to use it to start adding functionality to your app. The first thing your app will need to do is to obtain an access token to the Admin API by performing the OAuth process.

To do that, you can follow the steps below.

## Add a route to start OAuth

The route for starting the OAuth process (in this case `/login`) will use the library's `beginAuth` method. The method will return a URI that will be used for redirecting the user to the Shopify Authentication screen.

| Parameter      | Type                   | Required? | Default Value | Notes                                                                                                       |
| -------------- | ---------------------- | :-------: | :-----------: | ----------------------------------------------------------------------------------------------------------- |
| `request`      | `http.IncomingMessage` |    Yes    |       -       | The HTTP Request.                                                                                           |
| `response`     | `http.ServerResponse`  |    Yes    |       -       | The HTTP Response.                                                                                          |
| `shop`         | `string`               |    Yes    |       -       | A Shopify domain name in the form `{exampleshop}.myshopify.com`.                                            |
| `redirectPath` | `string`               |    Yes    |       -       | The redirect path used for callback with a leading `/`. The route should be allowed under the app settings. |
| `isOnline`     | `bool`                 |    No     |    `true`     | `true` if the session is online and `false` otherwise.                                                      |

<details>
<summary>Node.js</summary>

```typescript
switch (pathName) {
  case '/login':
    // process login action
    try {
      const authRoute = await Shopify.Auth.beginAuth(
        request,
        response,
        SHOP,
        '/auth/callback',
        false,
      );

      response.writeHead(302, {Location: authRoute});
      response.end();
    } catch (e) {
      console.log(e);

      response.writeHead(500);
      if (e instanceof Shopify.Errors.ShopifyError) {
        response.end(e.message);
      } else {
        response.end(`Failed to complete OAuth process: ${e.message}`);
      }
    }
    break;
  // end of if (pathName === '/login')
  default:
}

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
    false,
  );
  return res.redirect(authRoute);
});
```

</details>

## Add your OAuth callback route

After the app is authenticated with Shopify, the Shopify platform will send a request back to your app using this route (which you provided as a parameter to `beginAuth`, above). Your app will now use the provided `validateAuthCallback` method to finalize the OAuth process. This method returns the `session` object.

<details>
<summary>Node.js</summary>

```typescript
  // end of if (pathName === '/login')
  case "/auth/callback":
    try {
      const session = await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);
      ACTIVE_SHOPIFY_SHOPS[SHOP] = session.scope;

      console.log(session.accessToken);
      // all good, redirect to '/'
      const searchParams = new URLSearchParams(request.url);
      const host = searchParams.get("host");
      const shop = searchParams.get("shop");
      response.writeHead(302, { Location: `/?host=${host}&shop=${shop}` });
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
    break;
  // end of if (pathName === '/auth/callback'')
  default:
}

http.createServer(onRequest).listen(3000);
```

</details>

<details>
<summary>Express</summary>

```ts
app.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted
    ACTIVE_SHOPIFY_SHOPS[SHOP] = session.scope;
    console.log(session.accessToken);
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`); // wherever you want your user to end up after OAuth completes
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
