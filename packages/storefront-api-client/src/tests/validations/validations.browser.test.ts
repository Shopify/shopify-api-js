import { validatePrivateAccessTokenUsage } from "../../validations";

describe("validatePrivateAccessTokenUsage(): Browser", () => {
  it("throws an error when a private token is provided within a browser environment (window is defined)", () => {
    const privateAccessToken = "private-token";

    expect(() => validatePrivateAccessTokenUsage(privateAccessToken)).toThrow(
      new Error(
        "Storefront API Client: private access tokens and headers should only be used in a server-to-server implementation. Use the public API access token in nonserver environments.",
      ),
    );
  });
});
