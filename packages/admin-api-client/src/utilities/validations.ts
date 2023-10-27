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

export function validateRequiredAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error(`${ERROR_PREFIX} an access token must be provided`);
  }
}

export function validateServerSideUsage() {
  if (typeof window !== "undefined") {
    throw new Error(
      `${ERROR_PREFIX} this client should not be used in the browser`
    );
  }
}
