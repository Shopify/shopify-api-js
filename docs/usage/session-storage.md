# Implementing session storage

As of v6 of the library, there are no `SessionStorage` implementations included and the responsibility for implementing session storage is now delegated to the application.

The previous implementations of `SessionStorage` are now included in the [`shopify-app-express` package](https://github.com/Shopify/shopify-app-express/tree/main/src/session-storage).  If your app is not an Express app, or you wish not to use the `shopify-app-express` package, you can copy and modify any of the session storage implementations from that package to suit the needs of your app.

## Basics

### What data is in a `Session` object?

   |    Property      |      Type        | Mandatory? |
   | :--------------: | :--------------: | :--------: |
   |       id         |     string       |    yes     |
   |      shop        |     string       |    yes     |
   |     state        |     string       |    yes     |
   |    isOnline      |     boolean      |    yes     |
   |     scope        |     string       |    no      |
   |    expires       |      Date        |    no      |
   |   accessToken    |     string       |    no      |
   | onlineAccessInfo | OnlineAccessInfo |    no      |

   Note 1: These data are the same as the `SessionParams` object that's passed into the `Session` class constructor.
   Note 2: If `isOnline` is `true`, then `expires` and `onlineAccessInfo` will be populated.

### Save a session to storage

   Once OAuth completes using `shopify.auth.callback`, the `callback` response includes the session as an instance of the `Session` class.

   ```ts
   const callbackResponse = shopify.auth.callback({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   // app stores Session in its own storage mechanism
   await addSessionToStorage(callbackResponse.session.toObject());
   ```

   The `Session` class includes a `.toObject` method that returns the data-only properties of the `Session` as a JavaScript object.  This return value is identical to the parameters used to create a `Session` instance.  In other words,

   ```ts
   const callbackResponse = shopify.auth.callback({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   const sessionCopy = new Session(callbackResponse.session.toObject());
   // sessionCopy is an identical copy of the callbackResponse.session instance
   ```

   Now that the app has a JavaScript object containing the data of a `Session`, it can convert the data into whatever means necessary to store it in the apps preferred storage mechanism.  Again, the developer is free to explore various implementations of session storage in the [`shopify-app-express` package](https://github.com/Shopify/shopify-app-express/tree/main/src/session-storage).

   The `Session` class also includes an instance method called `.toPropertyArray` that returns an array of key-value pairs, e.g.,

   ```ts
   const {session, headers} = shopify.auth.callback({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });
   /*
     If session has the following data content...
     {
       id: 'online_session_id',
       shop: 'online-session-shop',
       state: 'online-session-state',
       isOnline: true,
       scope: 'online-session-scope',
       accessToken: 'online-session-token',
       expires: 2022-01-01T05:00:00.000Z,  // Date object
       onlineAccessInfo: {
         expires_in: 1,
         associated_user_scope: 'online-session-user-scope',
         associated_user: {
           id: 1,
           first_name: 'online-session-first-name',
           last_name: 'online-session-last-name',
           email: 'online-session-email',
           locale: 'online-session-locale',
           email_verified: true,
           account_owner: true,
           collaborator: false,
         },
       }
     }
    */

   const sessionProperties = session.toPropertyArray();
   /*
     ... then sessionProperties will have the following data...
     [
       ['id', 'online_session_id'],
       ['shop', 'online-session-shop'],
       ['state', 'online-session-state'],
       ['isOnline', true],
       ['scope', 'online-session-scope'],
       ['accessToken', 'online-session-token'],
       ['expires', 1641013200],  // number, seconds since Jan 1, 1970
       ['onlineAccessInfo', 1],  // only the `id` property of the `associated_user` property is stored
     ]
    */
   ```

### Load a session from storage

   When the app requires a `Session` for any Shopify API library call, it must load the required session from the apps storage mechanism.  The library provides `shopify.session.getCurrentId()` that returns the session id from the network request, that can then be used to find the appropriate `Session` in storage.

   ```ts
   const sessionId = await shopify.session.getCurrentId({
     isOnline: true,
     rawRequest: req,
     rawResponse: res,
   });

   // use sessionId to retrieve session from app's session storage
   // getSessionFromStorage() must be provided by application
   const session = await getSessionFromStorage(sessionId);

   const restClient = await shopify.clients.Rest({session});

   // do something with restClient...
   ```

   Once the `Session` is found, the app must ensure that it converts it from the stored format into the `SessionParams` object, so that a `Session` instance can be instantiated for passing to the library calls.  In the example above, `getSessionFromStorage` will have returned a `Session` object created using `new Session(params)`, where `params` are the values retrieved from storage converted into a `SessionParams` object.

   If the `.toPropertyArray` method was used to obtain the session data, the `Session` class has a `.fromPropertyArray` static method that can be used to convert the array data back into a session.

   ```ts
   const sessionProperties = session.toPropertyArray();
   /*
     if sessionProperties has the following data...
     [
       ['id', 'online_session_id'],
       ['shop', 'online-session-shop'],
       ['state', 'online-session-state'],
       ['isOnline', true],
       ['scope', 'online-session-scope'],
       ['accessToken', 'online-session-token'],
       ['expires', 1641013200],  // example = January 1, 2022, as number of seconds since Jan 1, 1970
       ['onlineAccessInfo', 1],  // only the `id` property of the `associated_user` property is stored
     ]
    */

   const session = Session.fromPropertyArray(sessionProperties);
   /*
     ... then session will have the following data...
     {
       id: 'online_session_id',
       shop: 'online-session-shop',
       state: 'online-session-state',
       isOnline: true,
       scope: 'online-session-scope',
       accessToken: 'online-session-token',
       expires: 2022-01-01T05:00:00.000Z,  // Date object
       onlineAccessInfo: {
         associated_user: {
           id: 1,
         },
       }
     }
    */

   ```
