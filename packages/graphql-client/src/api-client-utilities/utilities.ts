import { RequestParams } from "../graphql-client/types";

import {
  AllOperations,
  ApiClient,
  ApiClientConfig,
  ApiClientRequestOptions,
} from "./types";

export function generateGetHeaders(
  config: ApiClientConfig,
): ApiClient["getHeaders"] {
  return (customHeaders) => {
    return { ...(customHeaders ?? {}), ...config.headers };
  };
}

export function generateGetGQLClientParams<
  Operations extends AllOperations = AllOperations,
>({ getHeaders, getApiUrl }: Pick<ApiClient, "getHeaders" | "getApiUrl">) {
  return <Operation extends keyof Operations>(
    operation: Operation,
    options?: ApiClientRequestOptions<Operation, Operations>,
  ): RequestParams => {
    const props: RequestParams = [operation as string];

    if (options && Object.keys(options).length > 0) {
      const {
        variables,
        apiVersion: propApiVersion,
        headers,
        retries,
      } = options;

      props.push({
        ...(variables ? { variables } : {}),
        ...(headers ? { headers: getHeaders(headers) } : {}),
        ...(propApiVersion ? { url: getApiUrl(propApiVersion) } : {}),
        ...(retries ? { retries } : {}),
      });
    }

    return props;
  };
}
