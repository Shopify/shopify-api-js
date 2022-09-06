import {shopify} from '../../__tests__/test-helper';
import * as ShopifyErrors from '../../error';

test('safeCompare returns correct boolean value for comparisons', () => {
  const valueA = 'some value';
  const valueB = 'some value';
  const valueC = 'some other value';

  expect(shopify.utils.safeCompare(valueA, valueB)).toBe(true);
  expect(shopify.utils.safeCompare(valueB, valueC)).toBe(false);
});

test('works on all appropriate data types (strings, arrays, objects)', () => {
  const string1 = 'string';
  const string2 = 'string';
  const stringResult = shopify.utils.safeCompare(string1, string2);

  const numberArray1 = [1, 2];
  const numberArray2 = [1, 2];
  const numberArrayResult = shopify.utils.safeCompare(
    numberArray1,
    numberArray2,
  );

  const stringArray1 = ['alice', 'bob', 'charlie'];
  const stringArray2 = ['alice', 'bob', 'charlie'];
  const stringArrayResult = shopify.utils.safeCompare(
    stringArray1,
    stringArray2,
  );

  const obj1 = {key: 'val'};
  const obj2 = {key: 'val'};
  const objResult = shopify.utils.safeCompare(obj1, obj2);

  expect(stringResult).toBe(true);
  expect(numberArrayResult).toBe(true);
  expect(stringArrayResult).toBe(true);
  expect(objResult).toBe(true);
});

test('appropriately returns false for mismatched values on all data types', () => {
  const string1 = 'a string';
  const string2 = 'a different string';
  const stringResult = shopify.utils.safeCompare(string1, string2);

  const array1 = ['one fish', 'two fish'];
  const array2 = ['red fish', 'blue fish'];
  const arrayResult = shopify.utils.safeCompare(array1, array2);

  const obj1 = {thing: 'one'};
  const obj2 = {thing: 'two'};
  const objResult = shopify.utils.safeCompare(obj1, obj2);

  expect(stringResult).toBe(false);
  expect(arrayResult).toBe(false);
  expect(objResult).toBe(false);
});

test('args of different types throw SafeCompareError', () => {
  const arg1 = 'hello';
  const arg2 = ['world'];

  expect(() => {
    shopify.utils.safeCompare(arg1, arg2);
  }).toThrowError(ShopifyErrors.SafeCompareError);
});
