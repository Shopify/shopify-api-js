# Known issues and caveats

By following this guide, you will have a fully functional Shopify app. However, there are some things you should be aware of before using your new app in a production environment.

## Notes on session handling

Before you start writing your application, please note that the Shopify library stores some information for OAuth in sessions. Since each application may choose a different strategy to store information, the library cannot dictate any specific storage strategy. By default, `Shopify.Context` is initialized with `SQLiteSessionStorage`, which will enable you to start developing your app by storing sessions using the file-based SQLite package. You can quickly get your app set up using it, but please keep the following in mind.

`MemorySessionStorage` is **purposely** designed to be a single-process, development-only solution. It **will leak** memory in most cases and delete all sessions when your app restarts. You should **never** use it in production apps.

`SQLiteSessionStorage` (the library default) is designed to be a single-process solution and *may* be sufficient for your production needs depending on your applications design and needs.

The other storage adapters (`MongoDBSessionStorage`, `MySQLSessionStorage`, `PostgreSQLSessionStorage`, `RedisSessionStorage`) cover a variety of production-grade storage options.

If you wish to have an alternative storage solution, you must use a `CustomSessionStorage` solution in your production app- you can reference our [usage example with redis](usage/customsessions.md) to get started.

[Back to guide index](README.md)
