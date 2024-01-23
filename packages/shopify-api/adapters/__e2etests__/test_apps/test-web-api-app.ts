import '../../web-api';
import {Headers} from '../../../runtime/http';
import {
  DataType,
  PutRequestParams,
  PostRequestParams,
} from '../../../lib/clients/types';
import {Session} from '../../../lib';
import {restClientClass} from '../../../lib/clients/admin';
import {config, matchHeaders, session} from '../utils';
import {
  TestResponse,
  TestConfig,
  TestRequest,
  RestTestRequest,
  TestType,
} from '../test_config_types';
import {handleGraphqlTest} from '../test_handle_graphql';

/* Codes for different Colours */
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[39m';

const RestClient = restClientClass({
  config: {...config, hostScheme: 'http'},
  formatPaths: false,
});

const defaultRetryTimer = RestClient.RETRY_WAIT_TIME;
let testCount = 0;

function params(
  testRequest: RestTestRequest,
): PutRequestParams | PostRequestParams {
  return {
    path: testRequest.url,
    type: testRequest.bodyType as DataType,
    data: JSON.stringify(testRequest.body),
  };
}

function setRestClientRetryTime(time: number) {
  (RestClient as any).RETRY_WAIT_TIME = time;
}

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  async fetch(req: any, env: any, _ctx: any) {
    const apiServerPort: number = parseInt(env.HTTP_SERVER_PORT || '3000', 10);
    const apiServer = `localhost:${apiServerPort}`;
    const client = new RestClient({
      session: new Session({...session, shop: apiServer}),
    });

    if (req.method === 'POST') {
      const testConfig: TestConfig = await req.json();
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: TestResponse = testConfig.expectedResponse;
      let testPassed = false;
      let testFailedDebug = '';
      let response;

      setRestClientRetryTime(defaultRetryTimer);

      testCount++;
      console.log(
        `[webApi] testRequest #${testCount} = ${JSON.stringify(
          testRequest,
          undefined,
          2,
        )}\n`,
      );

      if (testRequest.type === TestType.Graphql) {
        const result = await handleGraphqlTest({
          apiServer,
          testRequest,
          expectedResponse,
        });

        testPassed = result.testPassed;
        testFailedDebug = result.testFailedDebug;

        console.log(
          `[webApi] testPassed=${testPassed}, testFailedDebug=${testFailedDebug}\n`,
        );
      } else {
        const tries = testRequest.tries || 1;
        let timedOut = false;
        let retryTimeout;

        if (typeof testRequest.retryTimeoutTimer !== 'undefined') {
          setRestClientRetryTime(testRequest.retryTimeoutTimer);
          console.log(
            `[webApi] RETRY_TIME_WAIT (BEFORE) = ${RestClient.RETRY_WAIT_TIME}\n`,
          );
          if (testRequest.retryTimeoutTimer !== 0) {
            console.log(
              `[webApi] setting setTimeout @ ${RestClient.RETRY_WAIT_TIME} ms\n`,
            );

            retryTimeout = setTimeout(() => {
              try {
                throw new Error(
                  'Request was not retried within the interval defined by Retry-After, test failed',
                );
              } catch (error) {
                console.log(
                  `[webApi] ${RED}setTimeout fired!${RESET} @ ${RestClient.RETRY_WAIT_TIME}\n`,
                );
                testFailedDebug = JSON.stringify({
                  errorMessageReceived: error.message,
                });
                timedOut = true;
              }
            }, testRequest.retryTimeoutTimer);
          }
        }

        switch (testRequest.method.toLowerCase()) {
          case 'get':
            try {
              response = await client.get({
                path: testRequest.url,
                tries,
                extraHeaders: testRequest.headers,
              });
              if (timedOut) {
                console.log(
                  `[webApi] timedOut=${timedOut}, testPassed=${testPassed}, testFailedDebug=${testFailedDebug}\n`,
                );
              } else {
                testPassed =
                  matchHeaders(
                    response.headers,
                    expectedResponse.headers as Headers,
                  ) && JSON.stringify(response.body) === expectedResponse.body;

                testFailedDebug = JSON.stringify({
                  bodyExpected: expectedResponse.body,
                  bodyReceived: response.body,
                  headersExpected: expectedResponse.headers,
                  headersReceived: response.headers,
                });
              }
            } catch (error) {
              testPassed = error.constructor.name.startsWith(
                expectedResponse.errorType,
              );
              if (expectedResponse.errorType === 'HttpResponseError') {
                testPassed =
                  testPassed &&
                  'response' in error &&
                  'code' in error.response &&
                  error.response.code === expectedResponse.statusCode &&
                  'statusText' in error.response &&
                  error.response.statusText === expectedResponse.statusText;
              }
              if ('expectRequestId' in expectedResponse) {
                testPassed =
                  testPassed &&
                  error.message.includes(expectedResponse.expectRequestId);
              }
              if ('errorMessage' in expectedResponse) {
                testPassed =
                  testPassed && error.message === expectedResponse.errorMessage;
              }
              testFailedDebug = JSON.stringify({
                statusCodeExpected: expectedResponse.statusCode,
                statusCodeReceived: error.code,
                statusTextExpected: expectedResponse.statusText,
                statusTextReceived: error.statusText,
                errorTypeExpected: expectedResponse.errorType,
                errorTypeReceived: error.constructor.name,
                errorMessageExpected: expectedResponse.errorMessage,
                errorMessageReceived: error.message,
              });
            }
            break;
          case 'post':
            response = await client.post(params(testRequest));
            testPassed =
              JSON.stringify(response.body) === expectedResponse.body;
            break;

          case 'put':
            response = await client.put(params(testRequest));
            testPassed =
              JSON.stringify(response.body) === expectedResponse.body;
            break;

          case 'delete':
            response = await client.delete({path: testRequest.url});
            testPassed =
              JSON.stringify(response.body) === expectedResponse.body;
            break;

          default:
            testPassed = false;
        }

        if (
          typeof testRequest.retryTimeoutTimer !== 'undefined' &&
          testRequest.retryTimeoutTimer !== 0 &&
          typeof retryTimeout !== 'undefined'
        ) {
          clearTimeout(retryTimeout);
        }
      }

      console.log(
        `[webApi] test #${testCount} passed=${
          testPassed ? GREEN : RED
        }${testPassed}${RESET}, debug=${JSON.stringify(
          testFailedDebug,
          undefined,
          2,
        )}\n`,
      );

      if (testPassed) {
        return new Response('Test passed!', {status: 200});
      } else {
        return new Response(testFailedDebug, {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } else {
      return new Response('Ready!', {status: 200});
    }
  },
};
