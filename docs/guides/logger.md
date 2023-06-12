# logger

v6 of the library adds logging capability that can aid debugging in the development and production environments.

## Configuration

These are the `logger`-related configuration values that `shopifyApi` supports. The `logger` property in the configuration is an object:

```ts
import {shopifyApi, LogSeverity} from '@shopify/shopify-api';

const shopify = shopifyApi({
  // other configuration settings
  logger: {
    level: LogSeverity.Debug,
    timestamps: true,
    httpRequests: true,
    log: async (severity, message) => {},
  },
});
```

This object supports the following values:

| Value        | Type            | Required |        Default        | Description                                                                                                                                                                 |
| ------------ | --------------- | :------: | :-------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| level        | `LogSeverity`   |    No    |  `LogSeverity.Info`   | Minimum severity for which to trigger the log function                                                                                                                      |
| timestamps   | `boolean`       |    No    |        `false`        | Whether to add the current timestamp to every log call                                                                                                                      |
| httpRequests | `boolean`       |    No    |        `false`        | Whether to log **ALL** HTTP requests made by the package. Only works if `level` is `Debug`                                                                                  |
| log          | `Function`      |    No    | `() => void`          | Callback function used for logging, which takes in a `LogSeverity` value and a formatted `message`. Defaults to using `console` calls matching the severity parameter |

## Adjusting level of log output

Four levels of logging are supported:

```ts
export enum LogSeverity {
  Error, // errors that prevent app from functioning properly, e.g., oauth errors
  Warning, // notices that don't prevent app from functioning propertly, e.g., deprecation notices
  Info, // information useful for monitoring library processing (default)
  Debug, // information useful for debugging library processing
}
```

`LogSeverity.Info` is the default logging level. To see more information, change the `logger.level` property in the configuration to `LogSeverity.Debug`, e.g.,

```ts
const shopify = shopifyApi({
  // other config values
  logger: {
    level: LogSeverity.Debug,
  },
});
```

For production environments, `LogSeverity.Info` may be too verbose, so consider adjusting the production environment configuration to `LogSeverity.Error` or `LogSeverity.Warning`.

## Adding timestamp information to log messages

By default, a typical log message looks like this (`LogSeverity.Info` example):

```text
[shopify-api/INFO] Completing OAuth | {shop: my-test-shop.myshopify.com, isOnline: false}
```

The following configuration adds timestamps to the messages logged:

```ts
const shopify = shopifyApi({
  // other config values
  logger: {
    timestamps: true,
  },
});
```

Using the same log message example above, it would now look like:

```text
[2022-11-10T22:15:51Z] [shopify-api/INFO] Completing OAuth | {shop: my-test-shop.myshopify.com, isOnline: false}
```

## Debugging HTTP requests

To enable additional debug messages that indicate the sending and receiving of HTTP requests/responses by the library, set the following configuration:

```ts
const shopify = shopifyApi({
  // other config values
  logger: {
    level: LogSeverity.Debug,
    httpRequests: true,
  },
});
```

This will result in messages like the following examples being logged.

```text
[shopify-api/DEBUG] Making HTTP request  -  GET https://my-test-shop.myshopify.com/admin/api/2022-10/products/count.json  -  Headers: {"X-Shopify-Access-Token":["a-really-fake-example-access-token"],"User-Agent":["Shopify API Library v6.0.0 | Node v18.7.0"]}
[shopify-api/DEBUG] Completed HTTP request, received 200 OK
```

**Note**: Setting `httpRequests: true` will only have effect if the logging level is set to `LogSeverity.Debug`.

## Changing the logging function

With the default configuration, the following calls are equivalent.

| `logger` call                                                 | default behaviour                                       |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| `shopify.logger.log(LogSeverity.Error, "error message")`      | `console.error("[shopify-api/ERROR] error message")`    |
| `shopify.logger.log(LogSeverity.Warning, "warning message")`  | `console.warn("[shopify-api/WARNING] warning message")` |
| `shopify.logger.log(LogSeverity.Info, "information message")` | `console.log("[shopify-api/INFO] information message")` |
| `shopify.logger.log(LogSeverity.Debug, "debug message")`      | `console.debug("[shopify-api/DEBUG] debug message")`    |

Setting the `log` property of the `logger` configuration object to an `async` function that accepts two arguments - a `severity` (of type `LogSeverity`) and a formatted `message` (of type `string`) - allows the developer to redirect the log messages as they see fit, e.g., to a file or a log capture service.

### Example of changing the logging function

The following example writes all messages to a log file `application.log`, and `LogSeverity.Error`-only messages to `error.log`.

```ts
import {shopifyApi} from '@shopify/shopify-api';
import {writeFileSync} from 'fs';

const errorLogFile = './error.log';
const appLogFile = './application.log';

const myLoggingFunction = (severity, message) => {
  writeFileSync(appLogFile, `${message}\n`, {flag: 'a'});
  if (severity == LogSeverity.Error) {
    writeFileSync(errorLogFile, `${message}\n`, {flag: 'a'});
  }
};

const shopify = shopifyApi({
  // other config values
  logger: {
    log: myLoggingFunction,
  },
});
```

[Back to guide index](../../README.md#guides)
