import {
  createGraphQLClient,
  getCurrentSupportedApiVersions,
  validateApiVersion,
  validateDomainAndGetStoreUrl,
  generateGetGQLClientParams,
  generateGetHeaders,
  ApiClientRequestParams,
} from "@shopify/graphql-client";

import {
  AdminApiClientOptions,
  AdminApiClient,
  AdminApiClientConfig,
} from "./types";
import {
  DEFAULT_CONTENT_TYPE,
  ACCESS_TOKEN_HEADER,
  CLIENT,
  DEFAULT_CLIENT_VERSION,
} from "./constants";
import {
  validateRequiredAccessToken,
  validateServerSideUsage,
} from "./validations";

export function createAdminApiClient({
  storeDomain,
  apiVersion,
  accessToken,
  userAgentPrefix,
  retries = 0,
  customFetchApi: clientFetchApi,
  logger,
}: AdminApiClientOptions): AdminApiClient {
  const currentSupportedApiVersions = getCurrentSupportedApiVersions();

  const storeUrl = validateDomainAndGetStoreUrl({
    client: CLIENT,
    storeDomain,
  });

  const baseApiVersionValidationParams = {
    client: CLIENT,
    currentSupportedApiVersions,
    logger,
  };

  validateServerSideUsage();
  validateApiVersion({
    client: CLIENT,
    currentSupportedApiVersions,
    apiVersion,
    logger,
  });
  validateRequiredAccessToken(accessToken);

  const apiUrlFormatter = generateApiUrlFormatter(
    storeUrl,
    apiVersion,
    baseApiVersionValidationParams
  );

  const config: AdminApiClientConfig = {
    storeDomain: storeUrl,
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
    apiUrl: apiUrlFormatter(),
    userAgentPrefix,
  };

  const graphqlClient = createGraphQLClient({
    headers: config.headers,
    url: config.apiUrl,
    retries,
    fetchApi: clientFetchApi,
    logger,
  });

  const getHeaders = generateGetHeaders(config);
  const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);

  const getGQLClientParams = generateGetGQLClientParams({
    getHeaders,
    getApiUrl,
  });

  const fetch = (...props: ApiClientRequestParams) => {
    return graphqlClient.fetch(...getGQLClientParams(...props));
  };

  const request = <TData>(...props: ApiClientRequestParams) => {
    return graphqlClient.request<TData>(...getGQLClientParams(...props));
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

function generateApiUrlFormatter(
  storeUrl: string,
  defaultApiVersion: string,
  baseApiVersionValidationParams: Omit<
    Parameters<typeof validateApiVersion>[0],
    "apiVersion"
  >
) {
  return (apiVersion?: string) => {
    if (apiVersion) {
      validateApiVersion({
        ...baseApiVersionValidationParams,
        apiVersion,
      });
    }

    const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();

    return `${storeUrl}/admin/api/${urlApiVersion}/graphql.json`;
  };
}

function generateGetApiUrl(
  config: AdminApiClientConfig,
  apiUrlFormatter: (version?: string) => string
): AdminApiClient["getApiUrl"] {
  return (propApiVersion?: string) => {
    return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
  };
}
