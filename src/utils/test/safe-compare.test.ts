import * as ShopifyErrors from '../../error';
import safeCompare from '../safe-compare';

test('safeCompare returns correct boolean value for comparisons', () => {
  const valueA = 'some value';
  const valueB = 'some value';
  const valueC = 'some other value';

  expect(safeCompare(valueA, valueB)).toBe(true);
  expect(safeCompare(valueB, valueC)).toBe(false);
});

test('works on all appropriate data types (strings, arrays, objects)', () => {
  const string1 = 'string';
  const string2 = 'string';
  const stringResult = safeCompare(string1, string2);

  const numberArray1 = [1, 2];
  const numberArray2 = [1, 2];
  const numberArrayResult = safeCompare(numberArray1, numberArray2);

  const stringArray1 = ['alice', 'bob', 'charlie'];
  const stringArray2 = ['alice', 'bob', 'charlie'];
  const stringArrayResult = safeCompare(stringArray1, stringArray2);

  const obj1 = {key: 'val'};
  const obj2 = {key: 'val'};
  const objResult = safeCompare(obj1, obj2);

  expect(stringResult).toBe(true);
  expect(numberArrayResult).toBe(true);
  expect(stringArrayResult).toBe(true);
  expect(objResult).toBe(true);
});

test('appropriately returns false for mismatched values on all data types', () => {
  const string1 = 'a string';
  const string2 = 'a different string';
  const stringResult = safeCompare(string1, string2);

  const array1 = ['one fish', 'two fish'];
  const array2 = ['red fish', 'blue fish'];
  const arrayResult = safeCompare(array1, array2);

  const obj1 = {thing: 'one'};
  const obj2 = {thing: 'two'};
  const objResult = safeCompare(obj1, obj2);

  expect(stringResult).toBe(false);
  expect(arrayResult).toBe(false);
  expect(objResult).toBe(false);
});

test('args of different types throw SafeCompareError', () => {
  const arg1 = 'hello';
  const arg2 = ['world'];

  expect(() => {
    safeCompare(arg1, arg2);
  }).toThrowError(ShopifyErrors.SafeCompareError);
});
