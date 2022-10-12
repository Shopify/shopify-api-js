# Create a `CustomSessionStorage` solution

This library comes with various session management options, see our [documentation on session storage strategies](../../session-storage/README.md) for more details.

If you wish to use an alternative session storage solution for production, you'll need to set up a `CustomSessionStorage`, which you can then use in initializing your `config`. The `CustomSessionStorage` class expects to be initialized with the following three mandatory callbacks that link to your chosen storage solution and map to the `storeSession`, `loadSession`, and `deleteSession` methods on the class.

## Callback methods

All of the callbacks used to create a new instance of `CustomSessionStorage` should be `async` functions and return a `Promise` that resolves to a specified type, as outlined below.

| Method           | Arg type           | Return type                                                          | Notes                                                                                                                                                                                                               |
| ---------------- | ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storeCallback`  | `SessionInterface` | `Promise<boolean>`                                                   | Takes in the `Session` to be stored or updated, returns a `boolean` (`true` if stored successfully). <br/> This callback is used both to save new a `Session` and to **update an existing `Session`**.              |
| `loadCallback`   | `string`           | `Promise<SessionInterface \| Record<string, unknown> \| undefined> ` | Takes in the id of the `Session` to load (as a `string`) and returns either an instance of a `Session`, an object to be used to instantiate a `Session`, or `undefined` if no record is found for the specified id. |
| `deleteCallback` | `string`           | `Promise<boolean>`                                                   | Takes in the id of the `Session` to load (as a `string`) and returns a `boolean` (`true` if deleted successfully).                                                                                                  |

There are two optional callbacks methods that can also be passed in during initialization. They're not used internally in the library but can be useful to have in your app if you call `shopify.config.sessionStorage.deleteSessions` or `findSessionsByShop`.

| Optional Method              | Arg type   | Return type                    | Notes                                                                                                                                  |
| ---------------------------- | ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `deleteSessionsCallback`     | `string[]` | `Promise<boolean>`             | Takes in an array of ids of `Session`'s to be deleted (as an array of `string`), returns a `boolean` (`true` if deleted successfully). |
| `findSessionsByShopCallback` | `string`   | `Promise<SessionInterface[]> ` | Takes in the shop domain (as a `string`) and returns an array of the sessions of that shop, or an empty array (`[]`) if none found.    |

## Example usage

This is an example implementation of a `CustomSessionStorage` solution, using `redis` for storage (mandatory callbacks only).

Before starting this tutorial, make sure to [set up your app](../../README.md).

### Install `redis` dependencies

First, make sure you have Redis installed on your machine. You can follow their [Quick Start guide](https://redis.io/topics/quickstart) to get up and running, and then come back here to continue with this example.

**Note**: Mac users should be able to just run `brew install redis` to install redis using homebrew

Once you have Redis installed globally, you will need to add the `redis` client to your project by running:

```shell
$ npm install redis@4
```

### Create a RedisStore class

Then, create a new class for our `redis` solution in `redis-store.ts`:

```ts
/* redis-store.ts */

// Import the Node redis package
import {createClient} from 'redis';

class RedisStore {
  constructor() {
    // Create a new redis client and connect to the server
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.connect();
  }

  /*
    The storeCallback takes in the Session, and sets a stringified version of it on the redis store
    This callback is used for BOTH saving new Sessions and updating existing Sessions.
    If the session can be stored, return true
    Otherwise, return false
  */
  async storeCallback(session) {
    try {
      // Inside our try, we use the `setAsync` method to save our session.
      // This method returns a boolean (true if successful, false if not)
      return await this.client.set(session.id, JSON.stringify(session));
    } catch (err) {
      // throw errors, and handle them gracefully in your application
      throw new Error(err);
    }
  }

  /*
    The loadCallback takes in the id, and uses the getAsync method to access the session data
     If a stored session exists, it's parsed and returned
     Otherwise, return undefined
  */
  async loadCallback(id) {
    try {
      // Inside our try, we use `getAsync` to access the method by id
      // If we receive data back, we parse and return it
      // If not, we return `undefined`
      let reply = await this.client.get(id);
      if (reply) {
        return JSON.parse(reply);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /*
    The deleteCallback takes in the id, and uses the redis `del` method to delete it from the store
    If the session can be deleted, return true
    Otherwise, return false
  */
  async deleteCallback(id) {
    try {
      // Inside our try, we use the `delAsync` method to delete our session.
      // This method returns a boolean (true if successful, false if not)
      return await this.client.del(id);
    } catch (err) {
      throw new Error(err);
    }
  }
}

// Export the class
export default RedisStore;
```

### Create a new `CustomSessionStorage` to use in `config`

Now we can import our custom storage class into our `index.ts` and use it to setup our storage solution in `config`.

```ts
/* index.ts */

import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import {CustomSessionStorage} from '@shopify/shopify-api/session-storage/custom';

// Import our custom storage class
import RedisStore from './redis-store';

// Create a new instance of the custom storage class
const redisStore = new RedisStore();

// Setup config with CustomSessionStorage
const shopify = shopifyApi({
  ...
  // Pass the sessionStorage methods to pass into a new instance of `CustomSessionStorage`
  sessionStorage: new CustomSessionStorage(
    redisStore.storeCallback.bind(redisStore),
    redisStore.loadCallback.bind(redisStore),
    redisStore.deleteCallback.bind(redisStore),
  ),
});

// Your app will now use your new storage solution to access and manage Sessions
```

At this point, you should have a working `CustomSessionStorage` solution that will work seamlessly with this library in your Shopify application.

**Note:** This is only one possible `CustomSessionStorage` solution. As long as your callback methods fit the requirements for argument types and return types, you can use any storage solution or database you're comfortable and/or familiar with.

[Back to guide index](../../README.md#features)
