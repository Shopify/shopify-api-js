import { APIClientLogger } from "./types";

export { validateRetries } from "../graphql-client/utilities";

export function validateRequiredStoreDomain(
  errorPrefix: string,
  storeDomain: string | undefined
) {
  if (
    !storeDomain ||
    typeof storeDomain !== "string" ||
    storeDomain.trim().length < 1
  ) {
    throw new Error(`${errorPrefix} a valid store domain must be provided`);
  }
}

export function validateApiVersion({
  errorPrefix,
  currentSupportedApiVersions,
  apiVersion,
  logger,
}: {
  errorPrefix: string;
  currentSupportedApiVersions: string[];
  apiVersion: string;
  logger?: APIClientLogger;
}) {
  const supportedVerbage = `Current supported API versions: ${currentSupportedApiVersions.join(
    ", "
  )}`;

  if (!apiVersion || typeof apiVersion !== "string") {
    throw new Error(
      `${errorPrefix} the provided \`apiVersion\` (\`${apiVersion}\`) is invalid. ${supportedVerbage}`
    );
  }

  const trimmedApiVersion = apiVersion.trim();

  if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
    if (logger) {
      logger({
        type: "UNSUPPORTED_API_VERSION",
        content: {
          apiVersion,
          supportedApiVersions: currentSupportedApiVersions,
        },
      });
    } else {
      console.warn(
        `${errorPrefix} the provided \`apiVersion\` (\`${apiVersion}\`) is deprecated or not supported. ${supportedVerbage}`
      );
    }
  }
}
