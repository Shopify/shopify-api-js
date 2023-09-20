# Adding custom runtimes

This package provides support for a set of JavaScript runtimes, but it won't cover all possible use cases.
It's designed in a way that can support any runtime, as long as an adapter provides the implementations for runtime-specific functionality.

> **Note**: this is an advanced feature, so using TypeScript and an IDE with intellisense is strongly recommended to help guide you through the implementation.

See the [available adapters](../../adapters/) for some implementation examples.
In general, an adapter needs to teach the library to convert the runtime's own request / response objects into the `NormalizedRequest` and `NormalizedResponse` objects used by the library, and to define some reasonable defaults for the runtime, like an implementation of [the `fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

To create an adapter, you'll need to import the runtime functions to provide implementations.
These are the functions you'll need to create:

- `setAbstractFetchFunc`
- `setAbstractConvertRequestFunc`
- `setAbstractConvertResponseFunc`
- `setAbstractConvertHeadersFunc`
- `setAbstractRuntimeString`

For runtimes that pass in a response object, such as Node.js, you'll also need to create:

- `setAbstractConvertIncomingResponseFunc`

Below is a _very_ simplified example with some functions:

```ts
import {
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
  AbstractRuntimeStringFunc,
  AbstractConvertHeadersFunc,
  Headers,
  AdapterArgs,
} from '@shopify/shopify-api/runtime';

type MyRequestType = any;
type MyResponseType = any;

interface MyRuntimeAdapterArgs extends AdapterArgs {
  rawRequest: MyRequestType;
  rawResponse?: MyResponseType;
}

const myRuntimeStringFunc: AbstractRuntimeStringFunc = () => {
  return `My runtime adapter ${myAdapterVersion}`;
};
setAbstractRuntimeString(myRuntimeStringFunc);

const myRuntimeHeaderFunc: AbstractConvertHeadersFunc = async (
  headers: Headers,
  adapterArgs: MyRuntimeAdapterArgs,
) => {
  return magicHeaderConversion(headers);
};
setAbstractConvertHeadersFunc(myRuntimeHeaderFunc);
```

[Back to guide index](../../README.md#guides)
