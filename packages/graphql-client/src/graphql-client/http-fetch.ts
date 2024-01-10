import { CLIENT, RETRIABLE_STATUS_CODES, RETRY_WAIT_TIME } from "./constants";
import { CustomFetchApi, GraphQLClient, Logger } from "./types";
import { formatErrorMessage, getErrorMessage } from "./utilities";

interface GenerateHttpFetchOptions {
  clientLogger: Logger;
  customFetchApi?: CustomFetchApi;
  client?: string;
  defaultRetryWaitTime?: number;
  retriableCodes?: number[];
}

export function generateHttpFetch({
  clientLogger,
  customFetchApi = fetch,
  client = CLIENT,
  defaultRetryWaitTime = RETRY_WAIT_TIME,
  retriableCodes = RETRIABLE_STATUS_CODES,
}: GenerateHttpFetchOptions) {
  const httpFetch = async (
    requestParams: Parameters<CustomFetchApi>,
    count: number,
    maxRetries: number,
  ): ReturnType<GraphQLClient["fetch"]> => {
    const nextCount = count + 1;
    const maxTries = maxRetries + 1;
    let response: Response | undefined;

    try {
      response = await customFetchApi(...requestParams);

      clientLogger({
        type: "HTTP-Response",
        content: {
          requestParams,
          response,
        },
      });

      if (
        !response.ok &&
        retriableCodes.includes(response.status) &&
        nextCount <= maxTries
      ) {
        throw new Error();
      }

      return response;
    } catch (error) {
      if (nextCount <= maxTries) {
        const retryAfter = response?.headers.get("Retry-After");
        await sleep(
          retryAfter ? parseInt(retryAfter, 10) : defaultRetryWaitTime,
        );

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
          client,
        ),
      );
    }
  };

  return httpFetch;
}

async function sleep(waitTime: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}
