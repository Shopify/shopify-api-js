# Session Storage

This folder contains implementations of the `SessionStorage` interface that works with the most common databases.

## SQLite (default)

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.SQLiteSessionStorage("/path/to/your.db"),
  ...
});
```

Note that [SQLite] is a local, file-based SQL database. It persists all tables to a single file on your local disk. As such, it’s simple to set up and is a great choice for getting started with Shopify App development. However, it won’t work when your app getting scaled across multiple instances.

## MySQL

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.MySQLSessionStorage("mysql://username:password@host/database"),
  ...
});

// OR

Shopify.Context.initialize({
  SESSION_STORAGE: Shopify.Auth.Session.MySQLSessionStorage.withCredentials({
    "host.com",
    "thedatabase",
    "username",
    "password",
  }),
  ...
});
```

## PostgreSQL

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.PostgreSQLSessionStorage("postgres://username:password@host/database"),
  ...
});

// OR

Shopify.Context.initialize({
  SESSION_STORAGE: Shopify.Auth.Session.PostgreSQLSessionStorage.withCredentials(
    "host.com",
    "thedatabase",
    "username",
    "password",
  ),
  ...
});
```

## MongoDB

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.MongoDBSessionStorage("mongodb://username:password@host/", "database"),
  ...
});

// OR

Shopify.Context.initialize({
  SESSION_STORAGE: Shopify.Auth.Session.MongoDBSessionStorage.withCredentials(
    "host.com",
    "thedatabase",
    "username",
    "password",
  ),
  ...
});
```

## Redis

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.RedisSessionStorage("redis://username:password@host/database"),
  ...
});

// OR

Shopify.Context.initialize({
  SESSION_STORAGE: Shopify.Auth.Session.RedisSessionStorage.withCredentials(
    "host.com",
    "thedatabase",
    "username",
    "password",
  ),
  ...
});
```

## In-Memory (legacy)

```js
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.MemorySessionStorage(),
  ...
});
```

Note that all sessions will be lost if the app process gets restarted or redeployed. This session storage modal is for local development only.

## Custom

```ts
import Shopify from '@shopify/shopify-api';

Shopify.Context.initialize({
  SESSION_STORAGE: new Shopify.Auth.Session.CustomSessionStorage(
    async function storeCallback(session: SessionInterface): Promise<boolean> {
      // ..
    },
    async function loadCallback(id: string): Promise<SessionInterface | undefined> {
      // ...
    },
    async function deleteCallback(id: string): Promise<boolean> {
      // ...
    }
  ),
  ...
});
```

While mostly written for automated tests, it can also be used to write ad-hoc `SessionStorage` implementations.

[sqlite]: https://www.sqlite.org/
