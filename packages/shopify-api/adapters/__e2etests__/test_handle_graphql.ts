// eslint-disable-next-line import/no-extraneous-dependencies
import {createGraphQLClient, Headers} from '@shopify/graphql-client';

import {abstractFetch} from '../../runtime';

import {GraphqlTestRequest, TestResponse} from './test_config_types';

interface HandleGraphqlTestOptions {
  apiServer: string;
  testRequest: GraphqlTestRequest;
  expectedResponse: TestResponse;
}

function graphqlClientFactory(apiServer: string) {
  return createGraphQLClient({
    url: `http://${apiServer}`,
    headers: {},
    customFetchApi: abstractFetch,
  });
}

export const handleGraphqlTest = async ({
  apiServer,
  testRequest,
  expectedResponse,
}: HandleGraphqlTestOptions) => {
  const graphqlClient = graphqlClientFactory(apiServer);

  let operation: string;
  let variables: Record<string, any> | undefined;
  try {
    const bodyJSON = JSON.parse(testRequest.body!);
    operation = bodyJSON.query;
    variables = bodyJSON.variables;
  } catch (error) {
    operation = testRequest.body!;
  }

  const headers = Object.entries(testRequest.headers).reduce(
    (acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? value : value.join(', ');
      return acc;
    },
    {} as Headers,
  );

  let testPassed = false;
  let testFailedDebug = '';
  try {
    const response = await graphqlClient.fetch(operation, {
      url: testRequest.url
        ? `http://${apiServer}${testRequest.url}`
        : undefined,
      variables,
      headers,
      retries: testRequest.retries,
    });

    testPassed =
      expectedResponse.statusCode === response.status &&
      expectedResponse.statusText === response.statusText;

    testFailedDebug = JSON.stringify({
      errorMessageReceived: undefined,
      statusCodeExpected: expectedResponse.statusCode,
      statusCodeReceived: response.status,
      statusTextExpected: expectedResponse.statusText,
      statusTextReceived: response.statusText,
    });
  } catch (error) {
    testFailedDebug = JSON.stringify({
      errorMessageReceived: error.message,
    });
  }

  return {testPassed, testFailedDebug};
};
