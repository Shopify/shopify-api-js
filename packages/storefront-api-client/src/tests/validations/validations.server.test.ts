import { validatePrivateAccessTokenUsage } from "../../validations";

describe("validatePrivateAccessTokenUsage(): Server", () => {
  it("does not throw an error when only the private token is provided when within a server environment", () => {
    const privateAccessToken = "private-token";

    expect(() =>
      validatePrivateAccessTokenUsage(privateAccessToken),
    ).not.toThrow();
  });
});
