import { RequestParams } from "../graphql-client/types";

import { ApiClient, ApiClientConfig, ApiClientRequestOptions } from "./types";

export function generateGetHeaders(
  config: ApiClientConfig
): ApiClient["getHeaders"] {
  return (customHeaders) => {
    return { ...(customHeaders ?? {}), ...config.headers };
  };
}

export function generateGetGQLClientParams({
  getHeaders,
  getApiUrl,
}: {
  getHeaders: ApiClient["getHeaders"];
  getApiUrl: ApiClient["getApiUrl"];
}) {
  return (
    operation: string,
    options?: ApiClientRequestOptions
  ): RequestParams => {
    const props: RequestParams = [operation];

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
