import { generateHttpFetch } from "./http-fetch";
import {
  ClientOptions,
  CustomFetchApi,
  GraphQLClient,
  ClientResponse,
  ClientConfig,
  Logger,
  LogContentTypes,
  DataChunk,
} from "./types";
import {
  CLIENT,
  GQL_API_ERROR,
  UNEXPECTED_CONTENT_TYPE_ERROR,
  NO_DATA_OR_ERRORS_ERROR,
  CONTENT_TYPES,
  RETRY_WAIT_TIME,
  HEADER_SEPARATOR,
  DEFER_OPERATION_REGEX,
  BOUNDARY_HEADER_REGEX,
  SDK_VARIANT_HEADER,
  SDK_VERSION_HEADER,
  DEFAULT_SDK_VARIANT,
  DEFAULT_CLIENT_VERSION,
} from "./constants";
import {
  formatErrorMessage,
  getErrorMessage,
  validateRetries,
  getKeyValueIfValid,
  buildDataObjectByPath,
  buildCombinedDataObject,
  getErrorCause,
  combineErrors,
} from "./utilities";

export function createGraphQLClient({
  headers,
  url,
  customFetchApi = fetch,
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
    customFetchApi,
    clientLogger,
    defaultRetryWaitTime: RETRY_WAIT_TIME,
  });
  const fetch = generateFetch(httpFetch, config);
  const request = generateRequest(fetch);
  const requestStream = generateRequestStream(fetch);

  return {
    config,
    fetch,
    request,
    requestStream,
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

    const flatHeaders = Object.entries({
      ...headers,
      ...overrideHeaders,
    }).reduce((headers: Record<string, string>, [key, value]) => {
      headers[key] = Array.isArray(value) ? value.join(", ") : value.toString();
      return headers;
    }, {});

    if (!flatHeaders[SDK_VARIANT_HEADER] && !flatHeaders[SDK_VERSION_HEADER]) {
      flatHeaders[SDK_VARIANT_HEADER] = DEFAULT_SDK_VARIANT;
      flatHeaders[SDK_VERSION_HEADER] = DEFAULT_CLIENT_VERSION;
    }

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
    if (DEFER_OPERATION_REGEX.test(props[0])) {
      throw new Error(
        formatErrorMessage(
          "This operation will result in a streamable response - use requestStream() instead.",
        ),
      );
    }

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

async function* getStreamBodyIterator(
  response: Response,
): AsyncIterableIterator<string> {
  const decoder = new TextDecoder();

  // Response body is an async iterator
  if ((response.body as any)![Symbol.asyncIterator]) {
    for await (const chunk of response.body! as any) {
      yield decoder.decode(chunk);
    }
  } else {
    const reader = response.body!.getReader();

    let readResult: ReadableStreamReadResult<DataChunk>;
    try {
      while (!(readResult = await reader.read()).done) {
        yield decoder.decode(readResult.value);
      }
    } finally {
      reader.cancel();
    }
  }
}

function readStreamChunk(
  streamBodyIterator: AsyncIterableIterator<string>,
  boundary: string,
) {
  return {
    async *[Symbol.asyncIterator]() {
      try {
        let buffer = "";

        for await (const textChunk of streamBodyIterator) {
          buffer += textChunk;

          if (buffer.indexOf(boundary) > -1) {
            const lastBoundaryIndex = buffer.lastIndexOf(boundary);
            const fullResponses = buffer.slice(0, lastBoundaryIndex);

            const chunkBodies = fullResponses
              .split(boundary)
              .filter((chunk) => chunk.trim().length > 0)
              .map((chunk) => {
                const body = chunk
                  .slice(
                    chunk.indexOf(HEADER_SEPARATOR) + HEADER_SEPARATOR.length,
                  )
                  .trim();
                return body;
              });

            if (chunkBodies.length > 0) {
              yield chunkBodies;
            }

            buffer = buffer.slice(lastBoundaryIndex + boundary.length);

            if (buffer.trim() === `--`) {
              buffer = "";
            }
          }
        }
      } catch (error) {
        throw new Error(
          `Error occured while processing stream payload - ${getErrorMessage(
            error,
          )}`,
        );
      }
    },
  };
}

function createJsonResponseAsyncIterator(response: Response) {
  return {
    async *[Symbol.asyncIterator]() {
      const processedResponse = await processJSONResponse(response);

      yield {
        ...processedResponse,
        hasNext: false,
      };
    },
  };
}

function getResponseDataFromChunkBodies(chunkBodies: string[]): {
  data: any;
  errors?: any;
  extensions?: any;
  hasNext: boolean;
}[] {
  return chunkBodies
    .map((value) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new Error(
          `Error in parsing multipart response - ${getErrorMessage(error)}`,
        );
      }
    })
    .map((payload) => {
      const { data, incremental, hasNext, extensions, errors } = payload;

      // initial data chunk
      if (!incremental) {
        return {
          data: data || {},
          ...getKeyValueIfValid("errors", errors),
          ...getKeyValueIfValid("extensions", extensions),
          hasNext,
        };
      }

      // subsequent data chunks
      const incrementalArray: { data: any; errors?: any }[] = incremental.map(
        ({ data, path, errors }: any) => {
          return {
            data: data && path ? buildDataObjectByPath(path, data) : {},
            ...getKeyValueIfValid("errors", errors),
          };
        },
      );

      return {
        data:
          incrementalArray.length === 1
            ? incrementalArray[0].data
            : buildCombinedDataObject([
                ...incrementalArray.map(({ data }) => data),
              ]),
        ...getKeyValueIfValid("errors", combineErrors(incrementalArray)),
        hasNext,
      };
    });
}

function validateResponseData(
  responseErrors: any[],
  combinedData: ReturnType<typeof buildCombinedDataObject>,
) {
  if (responseErrors.length > 0) {
    throw new Error(GQL_API_ERROR, {
      cause: {
        graphQLErrors: responseErrors,
      },
    });
  }

  if (Object.keys(combinedData).length === 0) {
    throw new Error(NO_DATA_OR_ERRORS_ERROR);
  }
}

function createMultipartResponseAsyncInterator(
  response: Response,
  responseContentType: string,
) {
  const boundaryHeader = (responseContentType ?? "").match(
    BOUNDARY_HEADER_REGEX,
  );
  const boundary = `--${boundaryHeader ? boundaryHeader[1] : "-"}`;

  if (
    !response.body?.getReader &&
    !(response.body as any)![Symbol.asyncIterator]
  ) {
    throw new Error("API multipart response did not return an iterable body", {
      cause: response,
    });
  }

  const streamBodyIterator = getStreamBodyIterator(response);

  let combinedData: Record<string, any> = {};
  let responseExtensions: Record<string, any> | undefined;

  return {
    async *[Symbol.asyncIterator]() {
      try {
        let streamHasNext = true;

        for await (const chunkBodies of readStreamChunk(
          streamBodyIterator,
          boundary,
        )) {
          const responseData = getResponseDataFromChunkBodies(chunkBodies);

          responseExtensions =
            responseData.find((datum) => datum.extensions)?.extensions ??
            responseExtensions;

          const responseErrors = combineErrors(responseData);

          combinedData = buildCombinedDataObject([
            combinedData,
            ...responseData.map(({ data }) => data),
          ]);

          streamHasNext = responseData.slice(-1)[0].hasNext;

          validateResponseData(responseErrors, combinedData);

          yield {
            ...getKeyValueIfValid("data", combinedData),
            ...getKeyValueIfValid("extensions", responseExtensions),
            hasNext: streamHasNext,
          };
        }

        if (streamHasNext) {
          throw new Error(`Response stream terminated unexpectedly`);
        }
      } catch (error) {
        const cause = getErrorCause(error);

        yield {
          ...getKeyValueIfValid("data", combinedData),
          ...getKeyValueIfValid("extensions", responseExtensions),
          errors: {
            message: formatErrorMessage(getErrorMessage(error)),
            networkStatusCode: response.status,
            ...getKeyValueIfValid("graphQLErrors", cause?.graphQLErrors),
            response,
          },
          hasNext: false,
        };
      }
    },
  };
}

function generateRequestStream(
  fetch: ReturnType<typeof generateFetch>,
): GraphQLClient["requestStream"] {
  return async (...props) => {
    if (!DEFER_OPERATION_REGEX.test(props[0])) {
      throw new Error(
        formatErrorMessage(
          "This operation does not result in a streamable response - use request() instead.",
        ),
      );
    }

    try {
      const response = await fetch(...props);

      const { statusText } = response;

      if (!response.ok) {
        throw new Error(statusText, { cause: response });
      }

      const responseContentType = response.headers.get("content-type") || "";

      switch (true) {
        case responseContentType.includes(CONTENT_TYPES.json):
          return createJsonResponseAsyncIterator(response);
        case responseContentType.includes(CONTENT_TYPES.multipart):
          return createMultipartResponseAsyncInterator(
            response,
            responseContentType,
          );
        default:
          throw new Error(
            `${UNEXPECTED_CONTENT_TYPE_ERROR} ${responseContentType}`,
            { cause: response },
          );
      }
    } catch (error) {
      return {
        async *[Symbol.asyncIterator]() {
          const response = getErrorCause(error);

          yield {
            errors: {
              message: formatErrorMessage(getErrorMessage(error)),
              ...getKeyValueIfValid("networkStatusCode", response?.status),
              ...getKeyValueIfValid("response", response),
            },
            hasNext: false,
          };
        },
      };
    }
  };
}
