import { generateHttpFetch } from "./http-fetch";
import {
  ClientOptions,
  CustomFetchApi,
  GraphQLClient,
  ClientResponse,
  ClientConfig,
  Logger,
  LogContentTypes,
} from "./types";
import {
  CLIENT,
  GQL_API_ERROR,
  UNEXPECTED_CONTENT_TYPE_ERROR,
  NO_DATA_OR_ERRORS_ERROR,
  CONTENT_TYPES,
  RETRY_WAIT_TIME,
} from "./constants";
import {
  getErrorMessage,
  validateRetries,
  getKeyValueIfValid,
  formatErrorMessage,
} from "./utilities";

export function createGraphQLClient({
  headers,
  url,
  fetchApi = fetch,
  retries = 0,
  logger,
}: ClientOptions): GraphQLClient {
  validateRetries({ client: CLIENT, retries });

  const config: ClientConfig = {
    headers,
    url,
    retries,
  };

  const clientLogger = generateClientLogger(logger);
  const httpFetch = generateHttpFetch({
    fetchApi,
    clientLogger,
    defaultRetryWaitTime: RETRY_WAIT_TIME,
  });
  const fetch = generateFetch(httpFetch, config);
  const request = generateRequest(fetch);

  return {
    config,
    fetch,
    request,
  };
}

export function generateClientLogger(logger?: Logger): Logger {
  return (logContent: LogContentTypes) => {
    if (logger) {
      logger(logContent);
    }
  };
}

async function processJSONResponse<TData = any>(
  response: any,
): Promise<ClientResponse<TData>> {
  const { errors, data, extensions } = await response.json();

  return {
    ...getKeyValueIfValid("data", data),
    ...getKeyValueIfValid("extensions", extensions),
    ...(errors || !data
      ? {
          errors: {
            networkStatusCode: response.status,
            message: formatErrorMessage(
              errors ? GQL_API_ERROR : NO_DATA_OR_ERRORS_ERROR,
            ),
            ...getKeyValueIfValid("graphQLErrors", errors),
            response,
          },
        }
      : {}),
  };
}

function generateFetch(
  httpFetch: ReturnType<typeof generateHttpFetch>,
  { url, headers, retries }: ClientConfig,
): GraphQLClient["fetch"] {
  return async (operation, options = {}) => {
    const {
      variables,
      headers: overrideHeaders,
      url: overrideUrl,
      retries: overrideRetries,
    } = options;

    const body = JSON.stringify({
      query: operation,
      variables,
    });

    validateRetries({ client: CLIENT, retries: overrideRetries });

    const flatHeaders = Object.fromEntries(
      Object.entries({ ...headers, ...overrideHeaders }).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(", ") : value.toString(),
      ]),
    );

    const fetchParams: Parameters<CustomFetchApi> = [
      overrideUrl ?? url,
      {
        method: "POST",
        headers: flatHeaders,
        body,
      },
    ];

    return httpFetch(fetchParams, 1, overrideRetries ?? retries);
  };
}

function generateRequest(
  fetch: ReturnType<typeof generateFetch>,
): GraphQLClient["request"] {
  return async (...props) => {
    try {
      const response = await fetch(...props);
      const { status, statusText } = response;
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        return {
          errors: {
            networkStatusCode: status,
            message: formatErrorMessage(statusText),
            response,
          },
        };
      }

      if (!contentType.includes(CONTENT_TYPES.json)) {
        return {
          errors: {
            networkStatusCode: status,
            message: formatErrorMessage(
              `${UNEXPECTED_CONTENT_TYPE_ERROR} ${contentType}`,
            ),
            response,
          },
        };
      }

      return processJSONResponse(response);
    } catch (error) {
      return {
        errors: {
          message: getErrorMessage(error),
        },
      };
    }
  };
}
