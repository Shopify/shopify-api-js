import { validateRequiredAccessTokens } from "../../validations";

describe("validateRequiredAccessToken()", () => {
  it("throws an error when both public and private tokens are undefined", () => {
    const publicAccessToken = undefined;
    const privateAccessToken = undefined;

    expect(() =>
      validateRequiredAccessTokens(publicAccessToken, privateAccessToken),
    ).toThrow(
      new Error(
        "Storefront API Client: a public or private access token must be provided",
      ),
    );
  });
});
