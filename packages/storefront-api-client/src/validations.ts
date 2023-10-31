import { ERROR_PREFIX } from "./constants";

export function validatePrivateAccessTokenUsage(
  privateAccessToken: string | undefined
) {
  if (privateAccessToken && window) {
    throw new Error(
      `${ERROR_PREFIX} private access tokens and headers should only be used in a server-to-server implementation. Use the API public access token in nonserver environments.`
    );
  }
}

export function validateRequiredAccessTokens(
  publicAccessToken: string | undefined,
  privateAccessToken: string | undefined
) {
  if (!publicAccessToken && !privateAccessToken) {
    throw new Error(
      `${ERROR_PREFIX} a public or private access token must be provided`
    );
  }

  if (publicAccessToken && privateAccessToken) {
    throw new Error(
      `${ERROR_PREFIX} only provide either a public or private access token`
    );
  }
}
