import { ERROR_PREFIX } from "../constants";

export function validateRequiredStoreDomain(storeDomain: string | undefined) {
  if (
    !storeDomain ||
    typeof storeDomain !== "string" ||
    storeDomain.trim().length < 1
  ) {
    throw new Error(`${ERROR_PREFIX} a valid store domain must be provided`);
  }
}

export function validateApiVersion(
  currentSupportedApiVersions: string[],
  apiVersion: string
) {
  const supportedVerbage = `Current supported API versions: ${currentSupportedApiVersions.join(
    ", "
  )}`;

  if (!apiVersion || typeof apiVersion !== "string") {
    throw new Error(
      `${ERROR_PREFIX} the provided \`apiVersion\` is invalid. ${supportedVerbage}`
    );
  }

  const trimmedApiVersion = apiVersion.trim();

  if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
    console.warn(
      `${ERROR_PREFIX} the provided \`apiVersion\` (\`${apiVersion}\`) is deprecated or not supported. ${supportedVerbage}`
    );
  }
}

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
