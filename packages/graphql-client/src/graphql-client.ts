import {
  ClientOptions,
  CustomFetchAPI,
  GraphQLClient,
  ClientResponse,
  LogContentTypes,
  ClientConfig,
} from "./types";
import { getErrorMessage } from "./utilities";

const ERROR_PREFIX = "GraphQL Client:";
const GQL_API_ERROR = `${ERROR_PREFIX} An error occurred while fetching from the API. Review 'graphQLErrors' for details.`;
const UNEXPECTED_CONTENT_TYPE_ERROR = `${ERROR_PREFIX} Response returned unexpected Content-Type:`;

const CONTENT_TYPES = {
  json: "application/json",
  multipart: "multipart/mixed",
};

const MIN_RETRIES = 0;
const MAX_RETRIES = 3;
const RETRY_WAIT_TIME = 1000;
const RETRIABLE_STATUS_CODES = [429, 503];

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

function validateRetries(retries: number | undefined) {
  if (
    retries !== undefined &&
    (retries < MIN_RETRIES || retries > MAX_RETRIES)
  ) {
    throw new Error(
      `${ERROR_PREFIX} The provided "retries" value (${retries}) is invalid - it cannot be less than ${MIN_RETRIES} or greater than ${MAX_RETRIES}`
    );
  }
}

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

  const clientLogger = (logContent: LogContentTypes) => {
    if (logger) {
      logger(logContent);
    }
  };

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

  const fetch: GraphQLClient["fetch"] = async (operation, options = {}) => {
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

  const request: GraphQLClient["request"] = async (...props) => {
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

  return {
    config,
    fetch,
    request,
  };
}
