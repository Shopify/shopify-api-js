import {
  validatePrivateAccessTokenUsage,
  validateRequiredAccessTokens,
} from "../validations";

describe("validateRequiredAccessToken()", () => {
  it("throws an error when both public and private tokens are undefined", () => {
    const publicAccessToken = undefined;
    const privateAccessToken = undefined;

    expect(() =>
      validateRequiredAccessTokens(publicAccessToken, privateAccessToken)
    ).toThrow(
      new Error(
        "Storefront API Client: a public or private access token must be provided"
      )
    );
  });
});

describe("validatePrivateAccessTokenUsage()", () => {
  it("throws an error when private token is provided within a browser environment (window is defined)", () => {
    const privateAccessToken = "private-token";

    expect(() => validatePrivateAccessTokenUsage(privateAccessToken)).toThrow(
      new Error(
        "Storefront API Client: private access tokens and headers should only be used in a server-to-server implementation. Use the public API access token in nonserver environments."
      )
    );
  });

  it("does not throw an error when only the private token is provided when within a server environment (window is undefined)", () => {
    const windowSpy = jest
      .spyOn(window, "window", "get")
      .mockImplementation(() => undefined as any);

    const privateAccessToken = "private-token";

    expect(() =>
      validatePrivateAccessTokenUsage(privateAccessToken)
    ).not.toThrow();

    windowSpy.mockRestore();
  });
});
