# Create a `CustomSessionStorage` solution

This library comes with two session management options: `MemorySessionStorage` and `CustomSessionStorage`.

`MemorySessionStorage` exists as an option to help you get started developing your apps as quickly as possible, and is the default storage option on `Shopify.Context`. It's perfect for working in your development and testing environments. However, this storage solution is not meant to be used in production [due to its limitations](../issues.md).

When you're ready to deploy your app and run it in production, you'll need to set up a `CustomSessionStorage`, which you can then use in initializing your `Shopify.Context`. The `CustomSessionStorage` class expects to be initialized with three callbacks that link to your chosen storage solution and map to the `storeSession`, `loadSession`, and `deleteSession` methods on the class.

## Callback methods
 
- All of the callbacks used to create a new instance of `CustomSessionStorage` should be `async` functions and return a `Promise` that resolves to a specified type, as outlined below.

| Method           | Arg type           | Return type                                                          | Notes                                                                                                                                                                                                               |
| ---------------- | ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storeCallback`  | `SessionInterface` | `Promise<boolean>`                                                   | Takes in the `Session` to be stored or updated, returns a `boolean` (`true` if stored successfully). <br/> This callback is used both to save new a `Session` and to **update an existing `Session`**.              |
| `loadCallback`   | `string`           | `Promise<SessionInterface \| Record<string, unknown> \| undefined> ` | Takes in the id of the `Session` to load (as a `string`) and returns either an instance of a `Session`, an object to be used to instantiate a `Session`, or `undefined` if no record is found for the specified id. |
| `deleteCallback` | `string`           | `Promise<boolean>`                                                   | Takes in the id of the `Session` to load (as a `string`) and returns a `booelan` (`true` if deleted successfully).                                                                                                  |

## Example usage

This is an example implementation of a `CustomSessionStorage` solution, using `redis` for storage.

Before starting this tutorial, please first follow our [getting started guide](../getting_started.md).

### Install `redis` dependencies

First, make sure you have Redis installed on your machine. You can follow their [Quick Start guide](https://redis.io/topics/quickstart) to get up and running, and then come back here to continue with this example.

_(**Tip**: Mac users should be able to just run `brew install redis` to install redis using homebrew)_

Once you have Redis installed globally, you will need to add the `redis` client to your project by running:

```shell
$ yarn add redis
```

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
  private setAsync;
  private delAsync;

  constructor() {
    // Create a new redis client
    this.client = redis.createClient();
    // Use Node's `promisify` to have redis return a promise from the client methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /*
    The storeCallback takes in the Session, and sets a stringified version of it on the redis store
    This callback is used for BOTH saving new Sessions and updating existing Sessions.
    If the session can be stored, return true
    Otherwise, return false
  */
  storeCallback = async (session: Session) => {
    try {
      // Inside our try, we use the `setAsync` method to save our session.
      // This method returns a boolean (true if successful, false if not)
      return await this.setAsync(session.id, JSON.stringify(session));
    } catch (err) {
      // throw errors, and handle them gracefully in your application
      throw new Error(err);
    }
  };

  /*
    The loadCallback takes in the id, and uses the getAsync method to access the session data
     If a stored session exists, it's parsed and returned
     Otherwise, return undefined
  */
  loadCallback = async (id: string) => {
    try {
      // Inside our try, we use `getAsync` to access the method by id
      // If we receive data back, we parse and return it
      // If not, we return `undefined`
      let reply = await this.getAsync(id);
      if (reply) {
        return JSON.parse(reply);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  /*
    The deleteCallback takes in the id, and uses the redis `del` method to delete it from the store
    If the session can be deleted, return true
    Otherwise, return false
  */
  deleteCallback = async (id: string) => {
    try {
      // Inside our try, we use the `delAsync` method to delete our session.
      // This method returns a boolean (true if successful, false if not)
      return await this.delAsync(id);
    } catch (err) {
      throw new Error(err);
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
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    sessionStorage.storeCallback,
    sessionStorage.loadCallback,
    sessionStorage.deleteCallback,
  ),
});

// Your app will now use your new storage solution to access and manage Sessions
```

At this point, you should have a working `CustomSessionStorage` solution that will work seamlessly with this library in your Shopify application.

**Note:** This is only one possible `CustomSessionStorage` solution. As long as your callback methods fit the requirements for argument types and return types, you can use any storage solution or database you're comfortable and/or familiar with.

[Back to guide index](../README.md)
