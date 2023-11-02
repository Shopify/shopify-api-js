import { ERROR_PREFIX } from "./constants";

export function validateRequiredStoreDomain(storeDomain: string | undefined) {
  if (
    !storeDomain ||
    typeof storeDomain !== "string" ||
    storeDomain.trim().length < 1
  ) {
    throw new Error(`${ERROR_PREFIX} a valid store domain must be provided`);
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
