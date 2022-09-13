# Session Storage

This folder contains implementations of the `SessionStorage` interface that works with the most common databases.

## SQLite (default for Node)

```js
import '@shopify/shopify-api/adapters/node';
import {shopifyApi} from '@shopify/shopify-api';
import {SQLiteSessionStorage} from '@shopify/shopify-api/session-storage/sqlite';

const shopify = shopifyApi({
  sessionStorage: new SQLiteSessionStorage("/path/to/your.db"),
  ...
});
```

Note that [SQLite] is a local, file-based SQL database. It persists all tables to a single file on your local disk. As such, it’s simple to set up and is a great choice for getting started with Shopify App development. However, it won’t work when your app getting scaled across multiple instances because they would each create their own database.

## MySQL

```js
import {shopifyApi} from '@shopify/shopify-api';
import {MySQLSessionStorage} from '@shopify/shopify-api/session-storage/mysql';

const shopify = shopifyApi({
  sessionStorage: new MySQLSessionStorage("mysql://username:password@host/database"),
  ...
});

// OR

const shopify = shopifyApi({
  sessionStorage: MySQLSessionStorage.withCredentials({
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
import {shopifyApi} from '@shopify/shopify-api';
import {PostgreSQLSessionStorage} from '@shopify/shopify-api/session-storage/postgresql';

const shopify = shopifyApi({
  sessionStorage: new PostgreSQLSessionStorage("postgres://username:password@host/database"),
  ...
});

// OR

const shopify = shopifyApi({
  sessionStorage: PostgreSQLSessionStorage.withCredentials(
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
import {shopifyApi} from '@shopify/shopify-api';
import {MongoDBSessionStorage} from '@shopify/shopify-api/session-storage/mongodb';

const shopify = shopifyApi({
  sessionStorage: new MongoDBSessionStorage("mongodb://username:password@host/", "database"),
  ...
});

// OR

const shopify = shopifyApi({
  sessionStorage: MongoDBSessionStorage.withCredentials(
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
import {shopifyApi} from '@shopify/shopify-api';
import {RedisSessionStorage} from '@shopify/shopify-api/session-storage/redis';

const shopify = shopifyApi({
  sessionStorage: new RedisSessionStorage("redis://username:password@host/database"),
  ...
});

// OR

const shopify = shopifyApi({
  sessionStorage: RedisSessionStorage.withCredentials(
    "host.com",
    "thedatabase",
    "username",
    "password",
  ),
  ...
});
```

## In-Memory

```js
import {shopifyApi} from '@shopify/shopify-api';
import {MemorySessionStorage} from '@shopify/shopify-api/session-storage/memory';

const shopify = shopifyApi({
  sessionStorage: new MemorySessionStorage(),
  ...
});
```

**Note**: all sessions will be lost if the app process gets restarted or redeployed. This session storage model is for local development only.

## Custom

```ts
import {shopifyApi, SessionInterface} from '@shopify/shopify-api';
import {CustomSessionStorage} from '@shopify/shopify-api/session-storage/custom';

const shopify = shopifyApi({
  sessionStorage: new CustomSessionStorage(
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
