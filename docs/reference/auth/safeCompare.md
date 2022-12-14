# shopify.auth.safeCompare

Takes a pair of arguments of any of the following types and returns true if they are identical, both in term of type and content.

## Example

```ts
const stringArray1 = ['alice', 'bob', 'charlie'];
const stringArray2 = ['alice', 'bob', 'charlie'];

const stringArrayResult = shopify.auth.safeCompare(stringArray1, stringArray2); // true

const array1 = ['one fish', 'two fish'];
const array2 = ['red fish', 'blue fish'];
const arrayResult = shopify.auth.safeCompare(array1, array2); // false

const arg1 = 'hello';
const arg2 = ['world'];

const argResult = shopify.auth.safeCompare(arg1, arg2); // throws SafeCompareError due to argument type mismatch
```

## Parameters

### value1, value2

```ts
string
{[key: string]: string}
string[]
number[]
```

:exclamation: required

The values to compare.

## Return

`boolean`

Whether the parameters match.

[Back to shopify.auth](./README.md)
