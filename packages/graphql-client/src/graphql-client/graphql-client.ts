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
  RETRIABLE_STATUS_CODES,
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
  const httpFetch = generateHttpFetch(fetchApi, clientLogger);
  const fetch = generateFetch(httpFetch, config);
  const request = generateRequest(fetch);

  return {
    config,
    fetch,
    request,
  };
}

async function sleep(waitTime: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
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

function generateHttpFetch(fetchApi: CustomFetchApi, clientLogger: Logger) {
  const httpFetch = async (
    requestParams: Parameters<CustomFetchApi>,
    count: number,
    maxRetries: number,
  ): ReturnType<GraphQLClient["fetch"]> => {
    const nextCount = count + 1;
    const maxTries = maxRetries + 1;
    let response: Response | undefined;

    try {
      response = await fetchApi(...requestParams);

      clientLogger({
        type: "HTTP-Response",
        content: {
          requestParams,
          response,
        },
      });

      if (
        !response.ok &&
        RETRIABLE_STATUS_CODES.includes(response.status) &&
        nextCount <= maxTries
      ) {
        throw new Error();
      }

      return response;
    } catch (error) {
      if (nextCount <= maxTries) {
        await sleep(RETRY_WAIT_TIME);

        clientLogger({
          type: "HTTP-Retry",
          content: {
            requestParams,
            lastResponse: response,
            retryAttempt: count,
            maxRetries,
          },
        });

        return httpFetch(requestParams, nextCount, maxRetries);
      }

      throw new Error(
        formatErrorMessage(
          `${
            maxRetries > 0
              ? `Attempted maximum number of ${maxRetries} network retries. Last message - `
              : ""
          }${getErrorMessage(error)}`,
        ),
      );
    }
  };

  return httpFetch;
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

    const fetchParams: Parameters<CustomFetchApi> = [
      overrideUrl ?? url,
      {
        method: "POST",
        headers: {
          ...headers,
          ...overrideHeaders,
        },
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
