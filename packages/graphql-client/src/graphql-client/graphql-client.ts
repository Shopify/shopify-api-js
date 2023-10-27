import {
  ClientOptions,
  CustomFetchAPI,
  GraphQLClient,
  ClientResponse,
  ClientConfig,
  Logger,
  LogContentTypes,
} from "./types";
import { ERROR_PREFIX } from "./constants";
import { getErrorMessage, validateRetries } from "./utilities";

const GQL_API_ERROR = `${ERROR_PREFIX} An error occurred while fetching from the API. Review 'graphQLErrors' for details.`;
const UNEXPECTED_CONTENT_TYPE_ERROR = `${ERROR_PREFIX} Response returned unexpected Content-Type:`;

const CONTENT_TYPES = {
  json: "application/json",
  multipart: "multipart/mixed",
};

const RETRY_WAIT_TIME = 1000;
const RETRIABLE_STATUS_CODES = [429, 503];

export function createGraphQLClient<TClientOptions extends ClientOptions>({
  headers,
  url,
  fetchAPI = fetch,
  retries = 0,
  logger,
}: TClientOptions): GraphQLClient {
  validateRetries(retries);

  const config: ClientConfig = {
    headers,
    url,
    retries,
  };

  const clientLogger = generateClientLogger(logger);
  const httpFetch = generateHttpFetch(fetchAPI, clientLogger);
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

async function processJSONResponse<TData = any>(
  response: any
): Promise<ClientResponse<TData>> {
  const { errors, data, extensions } = await response.json();

  const responseExtensions = extensions ? { extensions } : {};

  if (errors || !data) {
    return {
      error: {
        networkStatusCode: response.status,
        message: errors
          ? GQL_API_ERROR
          : `${ERROR_PREFIX} An unknown error has occurred. The API did not return a data object or any errors in its response.`,
        ...(errors ? { graphQLErrors: errors } : {}),
      },
      ...responseExtensions,
    };
  }

  return {
    data,
    ...responseExtensions,
  };
}
export function generateClientLogger(logger?: Logger): Logger {
  return (logContent: LogContentTypes) => {
    if (logger) {
      logger(logContent);
    }
  };
}

function generateHttpFetch(fetchAPI: CustomFetchAPI, clientLogger: Logger) {
  const httpFetch = async (
    requestParams: Parameters<CustomFetchAPI>,
    count: number,
    maxRetries: number
  ): ReturnType<GraphQLClient["fetch"]> => {
    const nextCount = count + 1;
    const maxTries = maxRetries + 1;
    let response: Response | undefined;

    try {
      response = await fetchAPI(...requestParams);

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
        `${ERROR_PREFIX}${
          maxRetries > 0
            ? ` Attempted maximum number of ${maxRetries} network retries. Last message -`
            : ""
        } ${getErrorMessage(error)}`
      );
    }
  };

  return httpFetch;
}

function generateFetch(
  httpFetch: ReturnType<typeof generateHttpFetch>,
  { url, headers, retries }: ClientConfig
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

    validateRetries(overrideRetries);

    const fetchParams: Parameters<CustomFetchAPI> = [
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
  fetch: ReturnType<typeof generateFetch>
): GraphQLClient["request"] {
  return async (...props) => {
    try {
      const response = await fetch(...props);
      const { status, statusText } = response;
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        return {
          error: {
            networkStatusCode: status,
            message: statusText,
          },
        };
      }

      if (!contentType.includes(CONTENT_TYPES.json)) {
        return {
          error: {
            networkStatusCode: status,
            message: `${UNEXPECTED_CONTENT_TYPE_ERROR} ${contentType}`,
          },
        };
      }

      return processJSONResponse(response);
    } catch (error) {
      return {
        error: {
          message: getErrorMessage(error),
        },
      };
    }
  };
}
