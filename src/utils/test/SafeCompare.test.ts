import safeCompare from '../SafeCompare';

test('SafeCompare returns a boolean value', () => {
  const valueA = 'some value';
  const valueB = 'some value';
  const result = safeCompare(valueA, valueB);

  expect(typeof result).toBe('boolean');
});

test('returns false for mismatched values', () => {
  const valueA = 'some value';
  const valueB = 'some other value';
  const result = safeCompare(valueA, valueB);

  expect(result).toBe(false);
});

test('returns true for matching values', () => {
  const valueA = 'some value';
  const valueB = 'some value';
  const result = safeCompare(valueA, valueB);

  expect(result).toBe(true);
});

test('works on all appropriate data types (strings, arrays, objects)', () => {
  const string1 = 'string';
  const string2 = 'string';
  const stringResult = safeCompare(string1, string2);

  const array1 = [1, 2, 'fish'];
  const array2 = [1, 2, 'fish'];
  const arrayResult = safeCompare(array1, array2);

  const obj1 = { key: 'val' };
  const obj2 = { key: 'val' };
  const objResult = safeCompare(obj1, obj2);

  expect(stringResult).toBe(true);
  expect(arrayResult).toBe(true);
  expect(objResult).toBe(true);
});

test('converts objects to strings for comparison', () => {
  const obj1 = { key: 'val' };
  const obj2 = { key: 'val' };

  const objResult = safeCompare(obj1, obj2);
  expect(objResult).toBe(true);
});

test('args of different types return false', () => {
  const arg1 = 'hello';
  const arg2 = ['world'];
  const result = safeCompare(arg1, arg2);

  expect(result).toBe(false);
});
