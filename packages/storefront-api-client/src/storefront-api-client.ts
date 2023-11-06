import {
  createGraphQLClient,
  RequestParams as GQLClientRequestParams,
  getCurrentSupportedApiVersions,
  validateDomainAndGetStoreUrl,
  validateApiVersion,
  ApiClientRequestParams,
  ApiClientRequestOptions,
} from "@shopify/graphql-client";

import {
  StorefrontApiClientOptions,
  StorefrontApiClient,
  StorefrontApiClientConfig,
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
  customFetchApi: clientFetchApi,
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
    baseApiVersionValidationParams
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
    fetchApi: clientFetchApi,
    logger,
  });

  const getHeaders = generateGetHeader(config);
  const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);

  const getGQLClientRequestProps = generateGetGQLClientProps({
    getHeaders,
    getApiUrl,
  });

  const fetch = (...props: ApiClientRequestParams) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.fetch(...requestProps);
  };

  const request = <TData>(...props: ApiClientRequestParams) => {
    const requestProps = getGQLClientRequestProps(...props);
    return graphqlClient.request<TData>(...requestProps);
  };

  const client: StorefrontApiClient = {
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

    return `${storeUrl}/api/${urlApiVersion}/graphql.json`;
  };
}

function generateGetHeader(
  config: StorefrontApiClientConfig
): StorefrontApiClient["getHeaders"] {
  return (customHeaders) => {
    return { ...(customHeaders ?? {}), ...config.headers };
  };
}

function generateGetApiUrl(
  config: StorefrontApiClientConfig,
  apiUrlFormatter: (version?: string) => string
): StorefrontApiClient["getApiUrl"] {
  return (propApiVersion?: string) => {
    return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
  };
}

function generateGetGQLClientProps({
  getHeaders,
  getApiUrl,
}: {
  getHeaders: StorefrontApiClient["getHeaders"];
  getApiUrl: StorefrontApiClient["getApiUrl"];
}) {
  return (
    operation: string,
    options?: ApiClientRequestOptions
  ): GQLClientRequestParams => {
    const props: GQLClientRequestParams = [operation];

    if (options) {
      const {
        variables,
        apiVersion: propApiVersion,
        customHeaders,
        retries,
      } = options;

      props.push({
        variables,
        headers: customHeaders ? getHeaders(customHeaders) : undefined,
        url: propApiVersion ? getApiUrl(propApiVersion) : undefined,
        retries,
      });
    }

    return props;
  };
}
