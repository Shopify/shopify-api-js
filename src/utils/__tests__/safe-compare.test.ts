import '../../__tests__/shopify-global';
import * as ShopifyErrors from '../../error';

test('safeCompare returns correct boolean value for comparisons', () => {
  const valueA = 'some value';
  const valueB = 'some value';
  const valueC = 'some other value';

  expect(global.shopify.utils.safeCompare(valueA, valueB)).toBe(true);
  expect(global.shopify.utils.safeCompare(valueB, valueC)).toBe(false);
});

test('works on all appropriate data types (strings, arrays, objects)', () => {
  const string1 = 'string';
  const string2 = 'string';
  const stringResult = global.shopify.utils.safeCompare(string1, string2);

  const numberArray1 = [1, 2];
  const numberArray2 = [1, 2];
  const numberArrayResult = global.shopify.utils.safeCompare(
    numberArray1,
    numberArray2,
  );

  const stringArray1 = ['alice', 'bob', 'charlie'];
  const stringArray2 = ['alice', 'bob', 'charlie'];
  const stringArrayResult = global.shopify.utils.safeCompare(
    stringArray1,
    stringArray2,
  );

  const obj1 = {key: 'val'};
  const obj2 = {key: 'val'};
  const objResult = global.shopify.utils.safeCompare(obj1, obj2);

  expect(stringResult).toBe(true);
  expect(numberArrayResult).toBe(true);
  expect(stringArrayResult).toBe(true);
  expect(objResult).toBe(true);
});

test('appropriately returns false for mismatched values on all data types', () => {
  const string1 = 'a string';
  const string2 = 'a different string';
  const stringResult = global.shopify.utils.safeCompare(string1, string2);

  const array1 = ['one fish', 'two fish'];
  const array2 = ['red fish', 'blue fish'];
  const arrayResult = global.shopify.utils.safeCompare(array1, array2);

  const obj1 = {thing: 'one'};
  const obj2 = {thing: 'two'};
  const objResult = global.shopify.utils.safeCompare(obj1, obj2);

  expect(stringResult).toBe(false);
  expect(arrayResult).toBe(false);
  expect(objResult).toBe(false);
});

test('args of different types throw SafeCompareError', () => {
  const arg1 = 'hello';
  const arg2 = ['world'];

  expect(() => {
    global.shopify.utils.safeCompare(arg1, arg2);
  }).toThrowError(ShopifyErrors.SafeCompareError);
});
