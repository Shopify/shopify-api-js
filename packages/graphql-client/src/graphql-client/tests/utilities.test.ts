import { CLIENT } from "../constants";
import {
  formatErrorMessage,
  getErrorMessage,
  validateRetries,
  getKeyValueIfValid,
  getErrorCause,
  combineErrors,
  buildCombinedDataObject,
  buildDataObjectByPath,
} from "../utilities";

describe("formatErrorMessage()", () => {
  it("returns a message that includes client prefix when the provided message does not include it", () => {
    const message = "Test error";

    expect(formatErrorMessage(message)).toBe(`GraphQL Client: ${message}`);
  });

  it("returns a message that includes client prefix when the provided message includes it", () => {
    const message = "GraphQL Client: Test error";

    expect(formatErrorMessage(message)).toBe(message);
  });
});

describe("getErrorMessage()", () => {
  it("returns the message from the provided error object", () => {
    const message = "Test error";

    expect(getErrorMessage(new Error(message))).toBe(message);
  });

  it("returns the stringified JSON of the provided object when it is not an Error object", () => {
    const object = { message: "Test error" };

    expect(getErrorMessage(object)).toBe(JSON.stringify(object));
  });
});

describe("getErrorCause()", () => {
  it("returns the cause object if its available in the provided error object", () => {
    const message = "Test error";
    const cause = { status: 500 };
    const params = [message, { cause }] as any;

    expect(getErrorCause(new Error(...params))).toBe(cause);
  });

  it("returns an undefined if there is no cause object in the provided error object", () => {
    const message = "Test error";

    expect(getErrorCause(new Error(message))).toBeUndefined();
  });

  it("returns an undefined if the provided object is not an error object", () => {
    expect(getErrorCause({ message: "test" })).toBeUndefined();
  });
});

describe("combineErrors()", () => {
  it("returns a flat array of errors from multiple error arrays", () => {
    const error1 = { message: "Error 1" };
    const error2 = { message: "Error 2" };
    const error3 = { message: "Error 3" };

    const dataArray = [
      { data: {} },
      { errors: [] },
      { errors: [error1] },
      { errors: [error2, error3] },
    ];

    expect(combineErrors(dataArray)).toEqual([error1, error2, error3]);
  });

  it("returns an empty array when data array objects do not include errors", () => {
    const dataArray = [{ data: {} }, { data: {} }];

    expect(combineErrors(dataArray).length).toBe(0);
  });

  it("returns an empty array when data array objects include empty errors arrays", () => {
    const dataArray = [{ data: {}, errors: [] }, { data: {} }, { errors: [] }];

    expect(combineErrors(dataArray).length).toBe(0);
  });
});

describe("validateRetries()", () => {
  const client = CLIENT;

  it("does not throw an error when retries is undefined", () => {
    expect(() =>
      validateRetries({ client, retries: undefined }),
    ).not.toThrowError();
  });

  it("does not throw an error when retries is between 0 and 3", () => {
    expect(() => validateRetries({ client, retries: 0 })).not.toThrowError();
    expect(() => validateRetries({ client, retries: 1 })).not.toThrowError();
    expect(() => validateRetries({ client, retries: 2 })).not.toThrowError();
    expect(() => validateRetries({ client, retries: 3 })).not.toThrowError();
  });

  it("throws an error when retries is not a number", () => {
    const retries = "1";
    expect(() =>
      validateRetries({ client, retries: retries as any }),
    ).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
    );
  });

  it("throws an error when retries is less than 0", () => {
    const retries = -1;
    expect(() => validateRetries({ client, retries })).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
    );
  });

  it("throws an error when retries is greater than 3", () => {
    const retries = 4;
    expect(() => validateRetries({ client, retries })).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
    );
  });
});

describe("getKeyValueIfValid()", () => {
  it("returns an object with the provided key and value if the provided value is a string", () => {
    const key = "data";
    const value = "test";

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value is a number", () => {
    const key = "data";
    const value = 3;

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is a non empty object", () => {
    const key = "data";
    const value = { name: "test" };

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is an array", () => {
    const key = "data";
    const value = ["test"];

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is an empty array", () => {
    const key = "data";
    const value = [];

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an empty object if the provided object exists but is an empty object", () => {
    const key = "data";
    const value = {};

    expect(getKeyValueIfValid(key, value)).toEqual({});
  });

  it("returns an empty object if the provided object is undefined", () => {
    const key = "data";
    const value = undefined;

    expect(getKeyValueIfValid(key, value)).toEqual({});
  });
});

describe("buildDataObjectByPath()", () => {
  it("returns an object using the provided path array that leads to the data object", () => {
    const path = ["a1", "b1", "c1", "d1"];
    const data = { e1: "text" };

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

  it("returns the data object if the path array is empty", () => {
    const path: string[] = [];
    const data = { first: "text" };

    const obj = buildDataObjectByPath(path, data);

    expect(obj).toEqual(data);
  });
});

describe("buildCombinedDataObject()", () => {
  it("returns the only object within the provided array", () => {
    const obj1 = { t1: "test1" };

    expect(buildCombinedDataObject([obj1])).toEqual({ ...obj1 });
  });

  it("returns an object that is the combination of multiple simple objects", () => {
    const obj1 = { t1: "test1" };
    const obj2 = { t2: "test2" };

    expect(buildCombinedDataObject([obj1, obj2])).toEqual({ ...obj1, ...obj2 });
  });

  it("returns an object that is the combination of the multiple complex objects", () => {
    const obj1 = { t1: { t2: { t3: { t4: "test4", t5: "test5" } } } };
    const obj2 = { t1: { a1: "a", t2: { t3: { b1: "b" } } } };
    const obj3 = { x1: "x1", x2: [{ z0: null }, { z1: "z1" }] };
    const obj4 = { x2: { 1: { y1: "y1" } } };
    const obj5 = { x2: { 0: { y0: "y0" } } };

    expect(buildCombinedDataObject([obj1, obj2, obj3, obj4, obj5])).toEqual({
      t1: {
        a1: "a",
        t2: {
          t3: {
            t4: "test4",
            t5: "test5",
            b1: "b",
          },
        },
      },
      x1: "x1",
      x2: [
        { z0: null, y0: "y0" },
        { z1: "z1", y1: "y1" },
      ],
    });
  });

  it("returns an object that is the combination of an object with an array and an object that has extra data to a specific array item", () => {
    const obj1 = { t1: { t2: [{ a1: "a1" }, { a2: "a2" }] } };
    const obj2 = { t1: { t2: { 0: { b1: "b1" } } } };

    expect(buildCombinedDataObject([obj1, obj2])).toEqual({
      t1: {
        t2: [{ a1: "a1", b1: "b1" }, { a2: "a2" }],
      },
    });
  });

  it("returns an object with an array that is the combination of multiple arrays", () => {
    const obj1 = { t1: [{ a1: "a1" }, { a2: "a2" }] };
    const obj2 = { t1: [{ b1: "b1" }, { a3: "a3" }] };

    expect(buildCombinedDataObject([obj1, obj2])).toEqual({
      t1: [
        { a1: "a1", b1: "b1" },
        { a2: "a2", a3: "a3" },
      ],
    });
  });
});

describe("getKeyValueIfValid()", () => {
  it("returns an object with the provided key and value if the provided value is a string", () => {
    const key = "data";
    const value = "test";

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value is a number", () => {
    const key = "data";
    const value = 3;

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is a non empty object", () => {
    const key = "data";
    const value = { name: "test" };

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is an array", () => {
    const key = "data";
    const value = ["test"];

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an object with the provided key and value if the provided value exists and is an empty array", () => {
    const key = "data";
    const value = [];

    expect(getKeyValueIfValid(key, value)).toEqual({ [key]: value });
  });

  it("returns an empty object if the provided object exists but is an empty object", () => {
    const key = "data";
    const value = {};

    expect(getKeyValueIfValid(key, value)).toEqual({});
  });

  it("returns an empty object if the provided object is undefined", () => {
    const key = "data";
    const value = undefined;

    expect(getKeyValueIfValid(key, value)).toEqual({});
  });
});
