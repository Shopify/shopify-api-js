import { MAX_RETRIES, MIN_RETRIES, ERROR_PREFIX } from "./constants";

export function getErrorMessage(error: any) {
  return error instanceof Error ? error.message : JSON.stringify(error);
}

export function validateRetries(retries?: number) {
  if (
    retries !== undefined &&
    (retries < MIN_RETRIES || retries > MAX_RETRIES)
  ) {
    throw new Error(
      `${ERROR_PREFIX} The provided "retries" value (${retries}) is invalid - it cannot be less than ${MIN_RETRIES} or greater than ${MAX_RETRIES}`
    );
  }
}
