import { CLIENT, MAX_RETRIES, MIN_RETRIES } from "./constants";

export function formatErrorMessage(message: string, client = CLIENT) {
  return message.startsWith(`${client}`) ? message : `${client}: ${message}`;
}

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

export function getKeyValueIfValid(key: string, value?: any) {
  return value &&
    (typeof value !== "object" ||
      Array.isArray(value) ||
      (typeof value === "object" && Object.keys(value).length > 0))
    ? { [key]: value }
    : {};
}
