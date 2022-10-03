# Known issues and caveats

By following this guide, you will have a fully functional Shopify app. However, there are some things you should be aware of before using your new app in a production environment.

## Notes on session handling

Before you start writing your application, please note that the Shopify library stores some information in sessions, like the API access token and the approved scopes.

Browsers are making it increasingly more difficult to use 3rd party cookies (e.g. [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies#tracking_protection)), and because embedded apps run in an iframe, their cookies are considered 3rd party cookies. **That means that this library cannot rely on cookies for sessions**, which is what web frameworks typically use for session management.

This library can use your app's data storage to store sessions to work around that issue, using `SessionStorage`.
Each app may choose a different storage strategy, so the library cannot assume any specific strategy will be available, but [we provide some options](../src/session-storage/README.md) to help you quickly set up your app.

- By default, Node.js apps will use `SQLiteSessionStorage`, which will enable you to start developing your app by storing sessions using the file-based SQLite package.
  - It will use a file named `database.sqlite` by default.
  - It's designed to be a single-process solution and _may_ be sufficient for your production needs depending on your application's design and needs.
- For runtimes that don't support file-system access, we also provide `MemorySessionStorage`.
  - This strategy is **purposely** designed to be a single-process, development-only solution. It **will leak** memory in most cases and delete all sessions when your app restarts. You should **never** use it in production apps.
  - We don't default to this strategy for CloudFlare workers, because it only works if you're running all your endpoints on the same worker, which won't always happen.

The other storage adapters cover a variety of production-grade storage options, but require further setup from the app to provide database access.

If you wish to have an alternative storage solution, you must use a `CustomSessionStorage` solution in your production app- you can reference our [usage example with redis](usage/customsessions.md) to get started.

[Back to guide index](../README.md)
