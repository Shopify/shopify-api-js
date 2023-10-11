import {
  buildDataObjectByPath,
  buildCombinedDataObject,
  getErrorMessage,
  getErrorCause,
} from '../utilities';

describe('buildDataObjectByPath()', () => {
  it('returns an object using the provided path array that leads to the data object', () => {
    const path = ['a1', 'b1', 'c1', 'd1'];
    const data = {e1: 'text'};

    const obj = buildDataObjectByPath(path, data);

    expect(obj).toEqual({
      a1: {
        b1: {
          c1: {
            d1: data,
          },
        },
      },
    });
  });

  it('returns the data object if the path array is empty', () => {
    const path: string[] = [];
    const data = {first: 'text'};

    const obj = buildDataObjectByPath(path, data);

    expect(obj).toEqual(data);
  });
});

describe('buildCombinedDataObject()', () => {
  it('returns the only object within the provided array', () => {
    const obj1 = {t1: 'test1'};

    expect(buildCombinedDataObject([obj1])).toEqual({...obj1});
  });

  it('returns an object that is the combination of multiple simple objects', () => {
    const obj1 = {t1: 'test1'};
    const obj2 = {t2: 'test2'};

    expect(buildCombinedDataObject([obj1, obj2])).toEqual({...obj1, ...obj2});
  });

  it('returns an object that is the combination of the multiple complex objects', () => {
    const obj1 = {t1: {t2: {t3: {t4: 'test4', t5: 'test5'}}}};
    const obj2 = {t1: {a1: 'a', t2: {t3: {b1: 'b'}}}};
    const obj3 = {x1: 'x1', x2: [{z0: null}, {z1: 'z1'}]};
    const obj4 = {x2: {1: {y1: 'y1'}}};
    const obj5 = {x2: {0: {y0: 'y0'}}};

    expect(buildCombinedDataObject([obj1, obj2, obj3, obj4, obj5])).toEqual({
      t1: {
        a1: 'a',
        t2: {
          t3: {
            t4: 'test4',
            t5: 'test5',
            b1: 'b',
          },
        },
      },
      x1: 'x1',
      x2: [
        {z0: null, y0: 'y0'},
        {z1: 'z1', y1: 'y1'},
      ],
    });
  });

  it('returns an object that is the combination of an object with an array and an object that has extra data to a specific array item', () => {
    const obj1 = {t1: {t2: [{a1: 'a1'}, {a2: 'a2'}]}};
    const obj2 = {t1: {t2: {0: {b1: 'b1'}}}};

    expect(buildCombinedDataObject([obj1, obj2])).toEqual({
      t1: {
        t2: [{a1: 'a1', b1: 'b1'}, {a2: 'a2'}],
      },
    });
  });
});

describe('getErrorMessage()', () => {
  it('returns the message from the provided error object', () => {
    const message = 'Test error';

    expect(getErrorMessage(new Error(message))).toBe(message);
  });

  it('returns the stringified JSON of the provided object when it is not an Error object', () => {
    const object = {message: 'Test error'};

    expect(getErrorMessage(object)).toBe(JSON.stringify(object));
  });
});

describe('getErrorCause()', () => {
  it('returns the cause object if its available in the provided error object', () => {
    const message = 'Test error';
    const cause = {status: 500};

    expect(getErrorCause(new Error(message, {cause}))).toBe(cause);
  });

  it('returns an empty object if there is no cause object in the provided error object', () => {
    const message = 'Test error';

    expect(getErrorCause(new Error(message))).toEqual({});
  });

  it('returns an empty object if the provided object is not an error object', () => {
    expect(getErrorCause({message: 'test'})).toEqual({});
  });
});
