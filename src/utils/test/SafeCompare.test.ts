import safeCompare from '../safeCompare';

test('SafeCompare returns a boolean value', () => {
  let valueA = 'some value';
  let valueB = 'some value';
  let result = safeCompare(valueA, valueB);

  expect(typeof result).toBe('boolean');
});

test('returns false for mismatched values', () => {
  let valueA = 'some value';
  let valueB = 'some other value';
  let result = safeCompare(valueA, valueB);

  expect(result).toBe(false);
});

test('returns true for matching values', () => {
  let valueA = 'some value';
  let valueB = 'some value';
  let result = safeCompare(valueA, valueB);

  expect(result).toBe(true);
});

test('works on all appropriate data types (strings, arrays, objects)', () => {
  let string1 = 'string';
  let string2 = 'string';
  let stringResult = safeCompare(string1, string2);

  let array1 = [1, 2, 'fish'];
  let array2 = [1, 2, 'fish'];
  let arrayResult = safeCompare(array1, array2);

  let obj1 = { key: 'val' };
  let obj2 = { key: 'val' };
  let objResult = safeCompare(obj1, obj2);

  expect(stringResult).toBe(true);
  expect(arrayResult).toBe(true);
  expect(objResult).toBe(true);
});

test('converts objects to strings for comparison', () => {
  let obj1 = { key: 'val' };
  let obj2 = { key: 'val' };

  let objResult = safeCompare(obj1, obj2);
  expect(objResult).toBe(true);
});

test('args of different types return false', () => {
  let arg1 = 'hello';
  let arg2 = ['world'];
  let result = safeCompare(arg1, arg2);

  expect(result).toBe(false);
});

test('works on an array of objects', () => {
  let objArray = [
    {
      test: 'test',
    },
    {
      hello: 'world',
    },
  ];
  let objArrayCopy = [
    {
      test: 'test',
    },
    {
      hello: 'world',
    },
  ];
  let result = safeCompare(objArray, objArrayCopy);

  expect(result).toBe(true);
});
