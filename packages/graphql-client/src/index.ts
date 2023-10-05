import {ClientOptions, GraphQLClient, ClientResponse} from './types';
import {getErrorMessage} from './utilities';

const ERROR_PREFIX = 'GraphQL Client:';
const GQL_API_ERROR = `${ERROR_PREFIX} An error occurred while fetching from the API. Review 'graphQLErrors' for details.`;
const UNEXPECTED_CONTENT_TYPE_ERROR = `${ERROR_PREFIX} Response returned unexpected Content-Type:`;

const CONTENT_TYPES = {
  json: 'application/json',
  multipart: 'multipart/mixed',
};

async function processJSONResponse<TData = any>(
  response: any
): Promise<ClientResponse<TData>> {
  const {errors, data, extensions} = await response.json();

  const responseExtensions = extensions ? {extensions} : {};

  if (errors || !data) {
    return {
      error: {
        networkStatusCode: response.status,
        message: errors
          ? GQL_API_ERROR
          : `${ERROR_PREFIX} An unknown error has occurred. The API did not return a data object or any errors in its response.`,
        ...(errors ? {graphQLErrors: errors} : {}),
      },
      ...responseExtensions,
    };
  }

  return {
    data,
    ...responseExtensions,
  };
}

export function createGraphQLClient<TClientOptions extends ClientOptions>({
  headers,
  url,
  fetchAPI = fetch,
}: TClientOptions): GraphQLClient {
  const config = {
    headers,
    url,
  };

  const fetch: GraphQLClient['fetch'] = (operation, options = {}) => {
    const {variables, headers: overrideHeaders, url: overrideUrl} = options;

    const body = JSON.stringify({
      query: operation,
      variables,
    });

    return fetchAPI(overrideUrl ?? url, {
      method: 'POST',
      headers: {
        ...headers,
        ...overrideHeaders,
      },
      body,
    });
  };

  const request: GraphQLClient['request'] = async (...props) => {
    try {
      const response = await fetch(...props);
      const {status, statusText} = response;
      const contentType = response.headers.get('content-type') || '';

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
