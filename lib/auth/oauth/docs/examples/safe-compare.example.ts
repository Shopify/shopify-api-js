const stringArray1 = ['alice', 'bob', 'charlie'];
const stringArray2 = ['alice', 'bob', 'charlie'];

const stringArrayResult = shopify.auth.safeCompare(stringArray1, stringArray2); // true

const array1 = ['one fish', 'two fish'];
const array2 = ['red fish', 'blue fish'];
const arrayResult = shopify.auth.safeCompare(array1, array2); // false

const arg1 = 'hello';
const arg2 = ['world'];

const argResult = shopify.auth.safeCompare(arg1, arg2); // throws SafeCompareError due to argument type mismatch
