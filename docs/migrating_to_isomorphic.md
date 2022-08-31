# Migrating from the Node.js-only version

We've extended the functionality of this library so that it can now run on JavaScript runtimes other than Node.js, as long as there is a runtime adapter for it.

To migrate your Node.js app to use this new adaptable version of the API library, you'll need to add an import of the node adapter in your app, _before_ importing the library functions themselves.
Note you only need to import this once in your app.

```js
import '@shopify/shopify-api/adapters/node';
import { ... } from '@shopify/shopify-api';
```

This automatically sets the library up to run on the Node.js runtime.

In addition to making the library compatible with multiple runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
Once you set up your app with the right adapter, you can follow the next sections for instructions on how to upgrade the individual methods that were changed.

## Basic configuration

We've refactored the way objects are exported by this library, to remove the main "static" `Shopify` object with global configs.
The entry point to the library is now a function that returns a separate instance with local settings, which makes it easier to mock for tests.
In general, those changes don't affect any library functionality, unless explicitly mentioned below.
You will probably need to search and replace most of the imports to this library to leverage the new, more idiomatic approach to exporting them.

### Renamed `Shopify.Context` to `shopify.config`

The current `Context` object name doesn't reflect that it mostly just holds configuration settings for the library, has no business logic, and it applies to the library on a global level.
To make it more idiomatic and to better support multiple instances / mocking, we've made the following changes to it:

- The `Shopify.Context.initialize()` method is no longer needed. You will pass in the configuration while setting up your library object.
- You can search / replace instances of `Shopify.Context` with `shopify.config`, as per the example below.
- The config options are now `camelCase` instead of `UPPER_CASE` to better represent them as properties, rather than constants. The settings' names and functionality are still the same, you'll just need to find and replace, e.g., `Shopify.Context.API_KEY` with `shopify.config.apiKey`.
- `Shopify.Context.throwIfUnitialized` and `UninitializedContextError` were removed.

<table>
<tr><th>Old code</th><th>New code</th></tr>
<tr>
<td>

```ts
import {Shopify} from '@shopify/shopify-api';
Shopify.Context.initialize({ API_KEY: '...', ... });
console.log(Shopify.Context.API_KEY);
```

</td>
<td>

```ts
import {shopifyApi} from '@shopify/shopify-api';
const shopify = shopifyApi({ apiKey: '...', ... });
console.log(shopify.config.apiKey);
```

</td>
</tr>
</table>

### Changes to `SessionStorage`

`SessionStorage` is no longer an interface, but an abstract class.
If you're using your own implementation of the interface, you need to replace `implements SessionStorage` with `extends SessionStorage`.

### [WIP] Utility functions

The old `Shopify.Utils` object contained functions that relied on the global configuration object, and in refactoring it to use a local configuration, we've removed all the default exports from it.
Utils functions should always be called through `shopify.utils` now.

- The `Shopify.Utils.storeSession` method was removed since sessions shouldn't be stored using the library unless the library is doing it. Apps can still save data to their sessions as they please, as long as the data is properly exported to the library via the SessionStorage.
