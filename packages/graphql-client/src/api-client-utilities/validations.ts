import { ApiClientLogger } from "./types";

export function validateDomainAndGetStoreUrl({
  client,
  storeDomain,
}: {
  client: string;
  storeDomain: string | undefined;
}) {
  try {
    if (!storeDomain || typeof storeDomain !== "string") {
      throw new Error();
    }

    const trimmedDomain = storeDomain.trim();

    const protocolUrl = trimmedDomain.match(/^https?:/)
      ? trimmedDomain
      : `https://${trimmedDomain}`;

    const url = new URL(protocolUrl);
    url.protocol = "https";

    return url.origin;
  } catch (_error) {
    throw new Error(
      `${client}: a valid store domain ("${storeDomain}") must be provided`,
    );
  }
}

export function validateApiVersion({
  client,
  currentSupportedApiVersions,
  apiVersion,
  logger,
}: {
  client: string;
  currentSupportedApiVersions: string[];
  apiVersion: string;
  logger?: ApiClientLogger;
}) {
  const versionError = `${client}: the provided apiVersion ("${apiVersion}")`;
  const supportedVersion = `Currently supported API versions: ${currentSupportedApiVersions.join(
    ", ",
  )}`;

  if (!apiVersion || typeof apiVersion !== "string") {
    throw new Error(`${versionError} is invalid. ${supportedVersion}`);
  }

  const trimmedApiVersion = apiVersion.trim();

  if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
    if (logger) {
      logger({
        type: "Unsupported_Api_Version",
        content: {
          apiVersion,
          supportedApiVersions: currentSupportedApiVersions,
        },
      });
    } else {
      console.warn(
        `${versionError} is likely deprecated or not supported. ${supportedVersion}`,
      );
    }
  }
}
