import { getErrorMessage } from "../utilities";

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
