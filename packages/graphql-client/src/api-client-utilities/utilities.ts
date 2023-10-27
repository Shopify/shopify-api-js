export { getErrorMessage } from "../graphql-client/utilities";

export function getDomain(url: string) {
  const { host: domain } = new URL(url);

  return domain;
}
