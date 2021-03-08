# Create a `CustomSessionStorage` Solution

This library comes with two session management options: `MemorySessionStorage` and `CustomSessionStorage`.

`MemorySessionStorage` exists as an option to help you get started developing your apps as quickly as possible, and is the default storage option on `Shopify.Context`. It's perfect for working in your development and testing environments. However, this storage solution is not meant to be used in production due to its limitations.

When you're ready to deploy your app and run it in production, you'll need to set up a `CustomSessionStorage`, which you can then use in initializing your `Shopify.Context`. The `CustomSessionStorage` class expects to be initialized with three callbacks that link to your chosen storage solution and map to the `storeSession`, `loadSession`, and `deleteSession` methods on the class.

## Callback Methods

- All of the callbacks used to create a new instance of `CustomSessionStorage` should be `async` functions and return a `Promise` that resolves to a specified type, as outlined below.

| Method           | Arg Type  | Return Type                                                 | Notes                                                                                                                                                                                                                |
| ---------------- | --------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storeCallback`  | `Session` | `Promise<boolean>`                                           | Takes in the `Session` to be stored, returns a `boolean` (`true` if stored successfully).                                                                                                                            |
| `loadCallback`   | `string`  | `Promise<Session \| Record<string, unknown> \| undefined> ` | Takes in the id of the `Session` to load (as a `string`) and returns either an instance of a `Session`, an object to be used to instantiate a `Session`, or `undefined` if no record is found for the specified id. |
| `deleteCallback` | `string`  | `Promise<boolean>`                                           | Takes in the id of the `Session` to load (as a `string`) and returns a  `booelan` (`true` if deleted successfully).                                                                                                  |

## Example Usage

This is an example implementation of a `CustomSessionStorage` solution, using `redis` for storage.

### Dependencies
Before starting this tutorial, please first follow our [Getting Started Guide](../getting_started.md).
Once completed, you will need to add the `redis` package to your project by running:
`$ yarn add redis`

### Create a RedisStore class

Then, create a new class for our `redis` solution in `redis-store.ts`:
```ts
/* redis-store.ts */

// Import the Session type from the library, along with the Node redis package, and `promisify` from Node
import {Session} from '@shopify/shopify-api/dist/auth/session';
import redis from 'redis';
import {promisify} from 'util';

class RedisStore {
  private client: redis.RedisClient;
  private getAsync;

  constructor() {
    // Create a new redis client
    this.client = redis.createClient();
    // Use Node's `promisify` to have redis return a promise from the `get` method
    this.getAsync = promisify(this.client.get).bind(this.client);
  }

  /*
    The storeCallback takes in the Session, and sets a stringified version of it on the redis store
    If the session can be stored, we return true
    Otherwise, return false
  */
  storeCallback = async (session: Session) => {
    try {
      if (this.client.set(session.id, JSON.stringify(session))) {
        return true;
      } else {
        return false
      }
    } catch (err) {
      // throw errors, and handle them gracefully in your application
      throw new Error(err)
    }
  };

  /*
    The loadCallback takes in the id, and uses the getAsync method to access the session data
     If a stored session exists, it's parsed and returned
     Otherwise, we return undefined
  */
  loadCallback = async (id: string) => {
    try {
      let reply = await this.getAsync(id);
      if (reply) {
        return JSON.parse(reply);
      } else {
        return undefined
      }
    } catch (err) {
      throw new Error(err)
    }
  };

  /*
    The deleteCallback takes in the id, and uses the redis `del` method to delete it from the store
    If the session can be deleted, we return true
    Otherwise, we return false
  */
  deleteCallback = async (id: string) => {
    try {
      if (this.client.del(id)) {
        return true;
      } else {
        return false
      }
    } catch (err) {
      throw new Error(err)
    }
  };
}

// Export the class
export default RedisStore;
```

### Create a new `CustomSessionStorage` to use in `Shopify.Context`

Now we can import our custom storage class into our `index.ts` and use it to setup our storage solution in `Shopify.Context`.

```ts
/* index.ts */

import Shopify, {ApiVersion, AuthQuery} from '@shopify/shopify-api/dist';
import {CustomSessionStorage} from '@shopify/shopify-api/dist/auth/session';
// Import our custom storage class
import RedisStore from './redis-store';

require('dotenv').config();

// Create a new instance of the custom storage class
const sessionStorage = new RedisStore();

const {API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST} = process.env;

// Setup Shopify.Context with CustomSessionStorage
Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.unstable,
  // Pass the sessionStorage methods to pass into a new instance of `CustomSessionStorage`
  SESSION_STORAGE: new CustomSessionStorage(
    sessionStorage.storeCallback,
    sessionStorage.loadCallback,
    sessionStorage.deleteCallback,
  ),
});

// Your app will now use your new storage solution to access and manage Sessions

```