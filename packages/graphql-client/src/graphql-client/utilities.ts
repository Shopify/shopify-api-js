import { MAX_RETRIES, MIN_RETRIES } from "./constants";

export function getErrorMessage(error: any) {
  return error instanceof Error ? error.message : JSON.stringify(error);
}

export function validateRetries({
  client,
  retries,
}: {
  client: string;
  retries?: number;
}) {
  if (
    retries !== undefined &&
    (typeof retries !== "number" ||
      retries < MIN_RETRIES ||
      retries > MAX_RETRIES)
  ) {
    throw new Error(
      `${client}: The provided "retries" value (${retries}) is invalid - it cannot be less than ${MIN_RETRIES} or greater than ${MAX_RETRIES}`,
    );
  }
}
