import {
  createGraphQLClient,
  CustomFetchApi,
  RequestParams as GQLClientRequestParams,
  getCurrentSupportedApiVersions,
  validateApiVersion,
} from "@shopify/graphql-client";

import {
  AdminApiClient,
  AdminApiClientConfig,
  AdminApiClientRequestOptions,
} from "./types";
import {
  DEFAULT_CONTENT_TYPE,
  ACCESS_TOKEN_HEADER,
  CLIENT,
  DEFAULT_CLIENT_VERSION,
} from "./constants";
import {
  validateRequiredStoreDomain,
  validateRequiredAccessToken,
  validateServerSideUsage,
} from "./validations";

const httpRegEx = new RegExp("^(https?:)?//");

export function createAdminApiClient({
  storeDomain,
  apiVersion,
  accessToken,
  userAgentPrefix,
  customFetchApi: clientFetchApi,
}: {
  storeDomain: string;
  apiVersion: string;
  accessToken: string;
  userAgentPrefix?: string;
  customFetchApi?: CustomFetchApi;
}): AdminApiClient {
  const currentSupportedApiVersions = getCurrentSupportedApiVersions();

  validateServerSideUsage();
  validateRequiredStoreDomain(storeDomain);
  validateApiVersion({
    client: CLIENT,
    currentSupportedApiVersions,
    apiVersion,
  });
  validateRequiredAccessToken(accessToken);

  const trimmedStoreDomain = storeDomain.trim();
  const cleanedStoreDomain = httpRegEx.test(trimmedStoreDomain)
    ? trimmedStoreDomain.substring(trimmedStoreDomain.indexOf("//") + 2)
    : trimmedStoreDomain;

  const generateApiUrl = (version?: string) => {
    if (version) {
      validateApiVersion({
        client: CLIENT,
        currentSupportedApiVersions,
        apiVersion: version,
      });
    }

    const urlApiVersion = (version ?? apiVersion).trim();

    return `https://${cleanedStoreDomain}${
      cleanedStoreDomain.endsWith("/") ? "" : "/"
    }admin/api/${urlApiVersion}/graphql.json`;
  };

  const config: AdminApiClientConfig = {
    storeDomain: trimmedStoreDomain,
    apiVersion,
    accessToken,
    headers: {
      "Content-Type": DEFAULT_CONTENT_TYPE,
      Accept: DEFAULT_CONTENT_TYPE,
      [ACCESS_TOKEN_HEADER]: accessToken,
      "User-Agent": `${
        userAgentPrefix ? `${userAgentPrefix} | ` : ""
      }${CLIENT} v${DEFAULT_CLIENT_VERSION}`,
    },
    apiUrl: generateApiUrl(),
    userAgentPrefix,
  };

  const graphqlClient = createGraphQLClient({
    headers: config.headers,
    url: config.apiUrl,
    fetchApi: clientFetchApi,
  });

  const getHeaders: AdminApiClient["getHeaders"] = (customHeaders) => {
    return customHeaders
      ? { ...customHeaders, ...config.headers }
      : config.headers;
  };

  const getApiUrl: AdminApiClient["getApiUrl"] = (propApiVersion?: string) => {
    return propApiVersion ? generateApiUrl(propApiVersion) : config.apiUrl;
  };

  const getGQLClientRequestProps = (
    operation: string,
    options?: AdminApiClientRequestOptions
  ): GQLClientRequestParams => {
    const props: GQLClientRequestParams = [operation];

    if (options) {
      const { variables, apiVersion: propApiVersion, customHeaders } = options;

      props.push({
        variables,
        headers: customHeaders ? getHeaders(customHeaders) : undefined,
        url: propApiVersion ? getApiUrl(propApiVersion) : undefined,
      });
    }

    return props;
  };

  const fetch: AdminApiClient["fetch"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.fetch(...requestProps);
  };

  const request: AdminApiClient["request"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.request(...requestProps);
  };

  const client: AdminApiClient = {
    config,
    getHeaders,
    getApiUrl,
    fetch,
    request,
  };

  return Object.freeze(client);
}
