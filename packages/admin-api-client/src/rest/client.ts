import {
  CustomFetchApi,
  LogContentTypes,
  Logger,
  generateHttpFetch,
  getCurrentSupportedApiVersions,
  validateApiVersion,
  validateDomainAndGetStoreUrl,
  validateRetries,
} from "@shopify/graphql-client";

import {
  validateRequiredAccessToken,
  validateServerSideUsage,
} from "../validations";
import {
  ACCESS_TOKEN_HEADER,
  CLIENT,
  DEFAULT_CLIENT_VERSION,
  DEFAULT_CONTENT_TYPE,
  DEFAULT_RETRY_WAIT_TIME,
  RETRIABLE_STATUS_CODES,
} from "../constants";

import {
  AdminRestApiClient,
  AdminRestApiClientOptions,
  DeleteRequestOptions,
  GetRequestOptions,
  HeaderOptions,
  Method,
  PostRequestOptions,
  PutRequestOptions,
  RequestOptions,
  SearchParamFields,
  SearchParams,
} from "./types";

export function createAdminRestApiClient({
  storeDomain,
  apiVersion,
  accessToken,
  userAgentPrefix,
  logger,
  customFetchApi = fetch,
  retries: clientRetries = 0,
  scheme = "https",
  defaultRetryTime = DEFAULT_RETRY_WAIT_TIME,
  formatPaths = true,
}: AdminRestApiClientOptions): AdminRestApiClient {
  const currentSupportedApiVersions = getCurrentSupportedApiVersions();

  const storeUrl = validateDomainAndGetStoreUrl({
    client: CLIENT,
    storeDomain,
  }).replace("https://", `${scheme}://`);

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
  validateRetries({ client: CLIENT, retries: clientRetries });

  const apiUrlFormatter = generateApiUrlFormatter(
    storeUrl,
    apiVersion,
    baseApiVersionValidationParams,
    formatPaths,
  );
  const clientLogger = generateClientLogger(logger);
  const httpFetch = generateHttpFetch({
    customFetchApi,
    clientLogger,
    defaultRetryWaitTime: defaultRetryTime,
    client: CLIENT,
    retriableCodes: RETRIABLE_STATUS_CODES,
  });

  const request = async (
    path: string,
    {
      method,
      data,
      headers: requestHeadersObj,
      searchParams,
      retries = 0,
      apiVersion,
    }: RequestOptions,
  ): ReturnType<CustomFetchApi> => {
    validateRetries({ client: CLIENT, retries });

    const url = apiUrlFormatter(path, searchParams ?? {}, apiVersion);

    const requestHeaders = normalizedHeaders(requestHeadersObj ?? {});
    const userAgent = [
      ...(requestHeaders["user-agent"] ? [requestHeaders["user-agent"]] : []),
      ...(userAgentPrefix ? [userAgentPrefix] : []),
      `${CLIENT} v${DEFAULT_CLIENT_VERSION}`,
    ].join(" | ");

    const headers = normalizedHeaders({
      "Content-Type": DEFAULT_CONTENT_TYPE,
      ...requestHeaders,
      Accept: DEFAULT_CONTENT_TYPE,
      [ACCESS_TOKEN_HEADER]: accessToken,
      "User-Agent": userAgent,
    });

    const body = data && typeof data !== "string" ? JSON.stringify(data) : data;

    return httpFetch(
      [url, { method, headers, ...(body ? { body } : undefined) }],
      1,
      retries ?? clientRetries,
    );
  };

  return {
    get: (path: string, options?: GetRequestOptions) =>
      request(path, { method: Method.Get, ...options }),
    put: (path: string, options?: PutRequestOptions) =>
      request(path, { method: Method.Put, ...options }),
    post: (path: string, options?: PostRequestOptions) =>
      request(path, { method: Method.Post, ...options }),
    delete: (path: string, options?: DeleteRequestOptions) =>
      request(path, { method: Method.Delete, ...options }),
  };
}

function generateApiUrlFormatter(
  storeUrl: string,
  defaultApiVersion: string,
  baseApiVersionValidationParams: Omit<
    Parameters<typeof validateApiVersion>[0],
    "apiVersion"
  >,
  formatPaths = true,
) {
  return (path: string, searchParams: SearchParams, apiVersion?: string) => {
    if (apiVersion) {
      validateApiVersion({
        ...baseApiVersionValidationParams,
        apiVersion,
      });
    }

    function convertValue(
      params: URLSearchParams,
      key: string,
      value: SearchParamFields,
    ) {
      if (Array.isArray(value)) {
        value.forEach((arrayValue) =>
          convertValue(params, `${key}[]`, arrayValue),
        );
        return;
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([objKey, objValue]) =>
          convertValue(params, `${key}[${objKey}]`, objValue),
        );
        return;
      }

      params.append(key, String(value));
    }

    const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
    let cleanPath = path.replace(/^\//, "");
    if (formatPaths) {
      if (!cleanPath.startsWith("admin")) {
        cleanPath = `admin/api/${urlApiVersion}/${cleanPath}`;
      }
      if (!cleanPath.endsWith(".json")) {
        cleanPath = `${cleanPath}.json`;
      }
    }

    const params = new URLSearchParams();
    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        convertValue(params, key, value);
      }
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return `${storeUrl}/${cleanPath}${queryString}`;
  };
}

function generateClientLogger(logger?: Logger): Logger {
  return (logContent: LogContentTypes) => {
    if (logger) {
      logger(logContent);
    }
  };
}

function normalizedHeaders(headersObj: HeaderOptions): Record<string, string> {
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headersObj)) {
    normalizedHeaders[key.toLowerCase()] = Array.isArray(value)
      ? value.join(", ")
      : String(value);
  }
  return normalizedHeaders;
}
