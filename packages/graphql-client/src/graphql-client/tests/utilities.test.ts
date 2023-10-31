import { CLIENT } from "../constants";
import { getErrorMessage, validateRetries } from "../utilities";

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
      validateRetries({ client, retries: undefined })
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
      validateRetries({ client, retries: retries as any })
    ).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
    );
  });

  it("throws an error when retries is less than 0", () => {
    const retries = -1;
    expect(() => validateRetries({ client, retries })).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
    );
  });

  it("throws an error when retries is greater than 3", () => {
    const retries = 4;
    expect(() => validateRetries({ client, retries })).toThrowError(
      `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`
    );
  });
});
