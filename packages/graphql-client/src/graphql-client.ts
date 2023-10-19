import {
  ClientOptions,
  CustomFetchAPI,
  GraphQLClient,
  ClientResponse,
} from "./types";
import { getErrorMessage } from "./utilities";

const ERROR_PREFIX = "GraphQL Client:";
const GQL_API_ERROR = `${ERROR_PREFIX} An error occurred while fetching from the API. Review 'graphQLErrors' for details.`;
const UNEXPECTED_CONTENT_TYPE_ERROR = `${ERROR_PREFIX} Response returned unexpected Content-Type:`;

const CONTENT_TYPES = {
  json: "application/json",
  multipart: "multipart/mixed",
};

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
  if (retries !== undefined && retries < 0) {
    throw new Error(
      `${ERROR_PREFIX}: The provided "retries" value (${retries}) is invalid - it cannot be less than zero.`
    );
  }
}

export function createGraphQLClient<TClientOptions extends ClientOptions>({
  headers,
  url,
  fetchAPI = fetch,
  retries = 0,
}: TClientOptions): GraphQLClient {
  validateRetries(retries);

  const config = {
    headers,
    url,
    retries,
  };

  const httpFetch = async (
    params: Parameters<CustomFetchAPI>,
    count: number,
    maxTries: number
  ): ReturnType<GraphQLClient["fetch"]> => {
    const nextCount = count + 1;
    let resetTime = RETRY_WAIT_TIME;
    try {
      const response = await fetchAPI(...params);
      if (
        !response.ok &&
        RETRIABLE_STATUS_CODES.includes(response.status) &&
        nextCount <= maxTries
      ) {
        const retryAfter = response.headers.get("Retry-After");
        if (typeof retryAfter !== "undefined" && retryAfter !== null) {
          resetTime = parseFloat(retryAfter) * 1000;
        }
        throw new Error();
      }

      return response;
    } catch (error) {
      if (nextCount <= maxTries) {
        await sleep(resetTime);
        return httpFetch(params, nextCount, maxTries);
      }

      throw new Error(
        `${ERROR_PREFIX} Exceeded maximum number of ${maxTries} network tries. Last message - ${getErrorMessage(
          error
        )}`
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
    const maxTries = (overrideRetries ?? retries) + 1;

    return httpFetch(fetchParams, 1, maxTries);
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
