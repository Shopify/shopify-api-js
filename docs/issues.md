# Known issues and caveats

By following this guide, you will have a fully functional Shopify app. However, there are some things you should be aware of before using your new app in a production environment.

## Notes on session handling

Before you start writing your application, please note that the Shopify library stores some information for OAuth in sessions. Since each application may choose a different strategy to store information, the library cannot dictate any specific storage strategy. By default, `Shopify.Context` is initialized with `MemorySessionStorage`, which will enable you to start developing your app by storing sessions in memory. You can quickly get your app set up using it, but please keep the following in mind.

`MemorySessionStorage` is **purposely** designed to be a single-process, development-only solution. It **will leak** memory in most cases and delete all sessions when your app restarts. You should **never** use it in production apps. In order to use your preferred storage choice with the Shopify library, you'll need to perform a few steps:

- Create a new instance of `CustomSessionStorage`, passing in callbacks to store, load, and delete sessions.
- Implement those callbacks so that they perform the necessary actions in your preferred storage method.
- Provide that instance when calling `Shopify.Context.initialize`, for example:

```ts
  // src/my_session_storage.ts
  import { SessionStorage } from '@shopify/shopify-api';

  async function storeCallback(session: Session): Promise<boolean> { ... }
  async function loadCallback(id: string): Promise<Session | Record<string, unknown> | undefined> { ... }
  async function deleteCallback(id: string): Promise<boolean> { ... }

  const mySessionStorage = new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback,
  );

  // src/index.ts
  Shopify.Context.initialize({
    ... // app settings
    SESSION_STORAGE: mySessionStorage(),
  });
```

[Back to guide index](index.md)
