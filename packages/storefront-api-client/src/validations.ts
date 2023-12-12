import { CLIENT } from "./constants";

export function validatePrivateAccessTokenUsage(
  privateAccessToken: string | undefined,
) {
  if (privateAccessToken && typeof window !== "undefined") {
    throw new Error(
      `${CLIENT}: private access tokens and headers should only be used in a server-to-server implementation. Use the public API access token in nonserver environments.`,
    );
  }
}

export function validateRequiredAccessTokens(
  publicAccessToken: string | undefined,
  privateAccessToken: string | undefined,
) {
  if (!publicAccessToken && !privateAccessToken) {
    throw new Error(
      `${CLIENT}: a public or private access token must be provided`,
    );
  }

  if (publicAccessToken && privateAccessToken) {
    throw new Error(
      `${CLIENT}: only provide either a public or private access token`,
    );
  }
}
