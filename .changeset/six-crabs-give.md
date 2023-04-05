---
'@shopify/shopify-api': major
---

The logger is now synchronous. This removes unnecessary `await`'s from functions that use the logger but functionally don't need to `await` anything else.  `webhooks.addHandlers` is the main impacted public method (it was `async` only because of the logging mechanism).

Apps that use the default logging methods (which send to `console`) will not be impacted by this change.  Apps that implement their own loggers _may_ be impacted; async logging functions can still be used but they need to be handled as promises.

```ts
// BEFORE
const myLogFunction = async (severity, message) => {
  try {
    await MyService.log(severity, message);
    // After external call
  } catch {
    // Handle error
  }
};

// AFTER
const myLogFunction = (severity, message) => {
  MyService.log(severity, message)
    .then(() => {
      // After external call
    })
    .catch(() => {
      // Handle error
    });
};
```

