import { CLIENT } from "../constants";
import {
  formatErrorMessage,
  getErrorMessage,
  validateRetries,
  getKeyValueIfValid,
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
