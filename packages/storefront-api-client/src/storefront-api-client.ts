import {
  createGraphQLClient,
  getCurrentSupportedApiVersions,
  validateDomainAndGetStoreUrl,
  validateApiVersion,
  generateGetGQLClientParams,
  generateGetHeaders,
} from "@shopify/graphql-client";

import {
  StorefrontApiClientOptions,
  StorefrontApiClient,
  StorefrontApiClientConfig,
  StorefrontOperations,
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
  CLIENT,
} from "./constants";
import {
  validateRequiredAccessTokens,
  validatePrivateAccessTokenUsage,
} from "./validations";

export function createStorefrontApiClient({
  storeDomain,
  apiVersion,
  publicAccessToken,
  privateAccessToken,
  clientName,
  retries = 0,
  customFetchApi,
  logger,
}: StorefrontApiClientOptions): StorefrontApiClient {
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

  validateApiVersion({ ...baseApiVersionValidationParams, apiVersion });
  validateRequiredAccessTokens(publicAccessToken, privateAccessToken);
  validatePrivateAccessTokenUsage(privateAccessToken);

  const apiUrlFormatter = generateApiUrlFormatter(
    storeUrl,
    apiVersion,
    baseApiVersionValidationParams,
  );

  const config: StorefrontApiClientConfig = {
    storeDomain: storeUrl,
    apiVersion,
    ...(publicAccessToken
      ? { publicAccessToken }
      : {
          privateAccessToken: privateAccessToken!,
        }),
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
    apiUrl: apiUrlFormatter(),
    clientName,
  };

  const graphqlClient = createGraphQLClient({
    headers: config.headers,
    url: config.apiUrl,
    retries,
    customFetchApi,
    logger,
  });

  const getHeaders = generateGetHeaders(config);
  const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);

  const getGQLClientParams = generateGetGQLClientParams<StorefrontOperations>({
    getHeaders,
    getApiUrl,
  });

  const client: StorefrontApiClient = {
    config,
    getHeaders,
    getApiUrl,
    fetch: (...props) => {
      return graphqlClient.fetch(...getGQLClientParams(...props));
    },
    request: (...props) => {
      return graphqlClient.request(...getGQLClientParams(...props));
    },
    requestStream: (...props) => {
      return graphqlClient.requestStream(...getGQLClientParams(...props));
    },
  };

  return Object.freeze(client);
}

function generateApiUrlFormatter(
  storeUrl: string,
  defaultApiVersion: string,
  baseApiVersionValidationParams: Omit<
    Parameters<typeof validateApiVersion>[0],
    "apiVersion"
  >,
) {
  return (apiVersion?: string) => {
    if (apiVersion) {
      validateApiVersion({
        ...baseApiVersionValidationParams,
        apiVersion,
      });
    }

    const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();

    return `${storeUrl}/api/${urlApiVersion}/graphql.json`;
  };
}

function generateGetApiUrl(
  config: StorefrontApiClientConfig,
  apiUrlFormatter: (version?: string) => string,
): StorefrontApiClient["getApiUrl"] {
  return (propApiVersion?: string) => {
    return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
  };
}
