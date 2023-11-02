import { CLIENT } from "./constants";

export function validateRequiredStoreDomain(storeDomain: string | undefined) {
  if (
    !storeDomain ||
    typeof storeDomain !== "string" ||
    storeDomain.trim().length < 1
  ) {
    throw new Error(`${CLIENT}: a valid store domain must be provided`);
  }
}

export function validateRequiredAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error(`${CLIENT}: an access token must be provided`);
  }
}

export function validateServerSideUsage() {
  if (typeof window !== "undefined") {
    throw new Error(`${CLIENT}: this client should not be used in the browser`);
  }
}
