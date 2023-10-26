import {
  createGraphQLClient,
  CustomFetchAPI,
  RequestParams as GQLClientRequestParams,
} from "@shopify/graphql-client";

import {
  StorefrontAPIClient,
  SFAPIClientConfig,
  SFAPIClientRequestOptions,
} from "./types";
import {
  DEFAULT_SDK_VARIANT,
  DEFAULT_CLIENT_VERSION,
  SDK_VARIANT_HEADER,
  SDK_VARIANT_SOURCE_HEADER,
  SDK_VERSION_HEADER,
  DEFAULT_CONTENT_TYPE,
  PUBLIC_ACCESS_TOKEN_HEADER,
  PRIVATE_ACCESS_TOKEN_HEADER,
} from "./constants";
import {
  getCurrentSupportedAPIVersions,
  validateRequiredStoreDomain,
  validateRequiredAccessTokens,
  validatePrivateAccessTokenUsage,
  validateApiVersion,
} from "./utilities";

const httpRegEx = new RegExp("^(https?:)?//");

export function createStorefrontAPIClient({
  storeDomain,
  apiVersion,
  publicAccessToken,
  privateAccessToken,
  clientName,
  customFetchAPI: clientFetchAPI,
}: {
  storeDomain: string;
  apiVersion: string;
  clientName?: string;
  customFetchAPI?: CustomFetchAPI;
} & (
  | {
      publicAccessToken?: never;
      privateAccessToken: string;
    }
  | {
      publicAccessToken: string;
      privateAccessToken?: never;
    }
)): StorefrontAPIClient {
  const currentSupportedAPIVersions = getCurrentSupportedAPIVersions();

  validateRequiredStoreDomain(storeDomain);
  validateApiVersion(currentSupportedAPIVersions, apiVersion);
  validateRequiredAccessTokens(publicAccessToken, privateAccessToken);
  validatePrivateAccessTokenUsage(privateAccessToken);

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
    }api/${urlApiVersion}/graphql.json`;
  };

  const config: SFAPIClientConfig = {
    storeDomain: trimmedStoreDomain,
    apiVersion,
    publicAccessToken: publicAccessToken ?? null,
    privateAccessToken: privateAccessToken ?? null,
    headers: {
      "Content-Type": DEFAULT_CONTENT_TYPE,
      Accept: DEFAULT_CONTENT_TYPE,
      [SDK_VARIANT_HEADER]: DEFAULT_SDK_VARIANT,
      [SDK_VERSION_HEADER]: DEFAULT_CLIENT_VERSION,
      ...(clientName ? { [SDK_VARIANT_SOURCE_HEADER]: clientName } : {}),
      ...(publicAccessToken
        ? { [PUBLIC_ACCESS_TOKEN_HEADER]: publicAccessToken }
        : { [PRIVATE_ACCESS_TOKEN_HEADER]: privateAccessToken! }),
    },
    apiUrl: generateApiUrl(),
    clientName,
  };

  const graphqlClient = createGraphQLClient({
    headers: config.headers,
    url: config.apiUrl,
    fetchAPI: clientFetchAPI,
  });

  const getHeaders: StorefrontAPIClient["getHeaders"] = (customHeaders) => {
    return customHeaders
      ? { ...customHeaders, ...config.headers }
      : config.headers;
  };

  const getApiUrl: StorefrontAPIClient["getApiUrl"] = (
    propApiVersion?: string
  ) => {
    return propApiVersion ? generateApiUrl(propApiVersion) : config.apiUrl;
  };

  const getGQLClientRequestProps = (
    operation: string,
    options?: SFAPIClientRequestOptions
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

  const fetch: StorefrontAPIClient["fetch"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.fetch(...requestProps);
  };

  const request: StorefrontAPIClient["request"] = (...props) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.request(...requestProps);
  };

  const client: StorefrontAPIClient = {
    config,
    getHeaders,
    getApiUrl,
    fetch,
    request,
  };

  return Object.freeze(client);
}
