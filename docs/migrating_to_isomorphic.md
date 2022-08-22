# Migrating from the Node.js-only version

We've extended the functionality of this library so that can now run on more JavaScript runtimes other than just Node.js, as long as there is a runtime adapter for it.

The first thing you'll need to do is import the node adapter in your app, _before_ importing the library functions itself.
Note you only need to import this once in your app.

```js
import '@shopify/shopify-api/adapters/node';
import { ... } from '@shopify/shopify-api';
```

This automatically sets the library up to run on the Node.js runtime.

In addition to making the library compatible with multiple runtimes, we've also improved its public interface to make it easier for apps to load only the features they need from the library.
Once you set up your app with the right adapter, you can follow the next sections for instructions on how to upgrade the individual methods that were changed.
