# Session Storage

This folder contains implementations of the `SessionStorage` interface that works with the most common databases.

Below is a summary of the options and their runtime compatibility:

| Storage option                  |      Node.js      | CloudFlare Workers |
| ------------------------------- | :---------------: | :----------------: |
| [SQLite](#sqlite)               |  Yes (_default_)  |                    |
| [MySQL](#mysql)                 |        Yes        |                    |
| [PostgreSQL](#postgresql)       |        Yes        |                    |
| [MongoDB](#mongodb)             |        Yes        |                    |
| [Redis](#redis)                 |        Yes        |                    |
| [CloudFlare KV](#cloudflare-kv) |                   |        Yes         |
| [Custom](#custom)               |        Yes        |        Yes         |
| [In-Memory](#in-memory)         | Yes (development) | Yes (development)  |

> **Note**: there is no default for CloudFlare Workers because any production-grade option requires configuration from the app.

## SQLite

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

## CloudFlare KV

CloudFlare's [KV] storage can be used on worker runtimes.
Before using it, you'll need to set up a namespace for your sessions and pass in a `KVNamespace` object.
You can do that either when creating an instance of `KVSessionStorage`, or by calling the `setBucket` method.

```js
import {shopifyApi} from '@shopify/shopify-api';
import {KVSessionStorage} from '@shopify/shopify-api/session-storage/kv';

const shopify = shopifyApi({
  sessionStorage: new KVSessionStorage(),
  ...
});

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    shopify.config.sessionStorage.setBucket(env.MY_KV_BUCKET);

    // Handle request
  },
};

// OR

import {Miniflare} from 'miniflare';

const mf = new Miniflare({
  kvNamespaces: ['MY_KV_BUCKET'],
});
const shopify = shopifyApi({
  sessionStorage: new KVSessionStorage(await mf.getKVNamespace('MY_KV_BUCKET')),
  ...
});
```

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

While mostly written for automated tests, it can also be used to write ad-hoc `SessionStorage` implementations. You can find [an example using Redis here](../docs/usage/customsessions.md).

## In-Memory

```js
import {shopifyApi} from '@shopify/shopify-api';
import {MemorySessionStorage} from '@shopify/shopify-api/session-storage/memory';

const shopify = shopifyApi({
  sessionStorage: new MemorySessionStorage(),
  ...
});
```

> **Note**: This session storage model is for local development only, to make it easier for developers to get started.
> It will delete all sessions if the app process gets restarted or redeployed, and is not meant for production use [due to its limitations](../docs/issues.md).

[sqlite]: https://www.sqlite.org/
[kv]: https://developers.cloudflare.com/workers/runtime-apis/kv/
