import {
  createGraphQLClient,
  CustomFetchAPI,
  RequestParams as GQLClientRequestParams,
} from "@shopify/graphql-client";

import {
  AdminAPIClient,
  AdminAPIClientConfig,
  AdminAPIClientRequestOptions,
} from "./types";
import { DEFAULT_CONTENT_TYPE, ACCESS_TOKEN_HEADER } from "./constants";
import {
  getCurrentSupportedAPIVersions,
  validateRequiredStoreDomain,
  validateRequiredAccessToken,
  validateApiVersion,
  validateServerSideUsage,
} from "./utilities";

const httpRegEx = new RegExp("^(https?:)?//");

export function createAdminAPIClient({
  storeDomain,
  apiVersion,
  accessToken,
  clientName,
  customFetchAPI: clientFetchAPI,
}: {
  storeDomain: string;
  apiVersion: string;
  accessToken: string;
  clientName?: string;
  customFetchAPI?: CustomFetchAPI;
}): AdminAPIClient {
  const currentSupportedAPIVersions = getCurrentSupportedAPIVersions();

  validateServerSideUsage();
  validateRequiredStoreDomain(storeDomain);
  validateApiVersion(currentSupportedAPIVersions, apiVersion);
  validateRequiredAccessToken(accessToken);

  const trimmedStoreDomain = storeDomain.trim();
  const cleanedStoreDomain = httpRegEx.test(trimmedStoreDomain)
    ? trimmedStoreDomain.substring(trimmedStoreDomain.indexOf("//") + 2)
    : trimmedStoreDomain;

  const generateApiUrl = (version?: string) => {
    if (version) {
      validateApiVersion(currentSupportedAPIVersions, version);
    }

    const urlApiVersion = (version ?? apiVersion).trim();

    return `https://${cleanedStoreDomain}${
      cleanedStoreDomain.endsWith("/") ? "" : "/"
    }admin/api/${urlApiVersion}/graphql.json`;
  };

  const config: AdminAPIClientConfig = {
    storeDomain: trimmedStoreDomain,
    apiVersion,
    accessToken,
    headers: {
      "Content-Type": DEFAULT_CONTENT_TYPE,
      Accept: DEFAULT_CONTENT_TYPE,
      [ACCESS_TOKEN_HEADER]: accessToken,
    },
    apiUrl: generateApiUrl(),
    clientName,
  };

  const graphqlClient = createGraphQLClient({
    headers: config.headers,
    url: config.apiUrl,
    fetchAPI: clientFetchAPI,
  });

  const getHeaders: AdminAPIClient["getHeaders"] = (customHeaders) => {
    return customHeaders
      ? { ...customHeaders, ...config.headers }
      : config.headers;
  };

  const getApiUrl: AdminAPIClient["getApiUrl"] = (propApiVersion?: string) => {
    return propApiVersion ? generateApiUrl(propApiVersion) : config.apiUrl;
  };

  const getGQLClientRequestProps = (
    operation: string,
    options?: AdminAPIClientRequestOptions
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

  const fetch: AdminAPIClient["fetch"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.fetch(...requestProps);
  };

  const request: AdminAPIClient["request"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.request(...requestProps);
  };

  const client: AdminAPIClient = {
    config,
    getHeaders,
    getApiUrl,
    fetch,
    request,
  };

  return Object.freeze(client);
}
