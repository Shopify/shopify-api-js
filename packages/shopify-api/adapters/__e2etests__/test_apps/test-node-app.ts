import {createServer, IncomingMessage, ServerResponse} from 'http';

import '../../node';
import {Session} from '../../../lib';
import {Headers} from '../../../runtime/http';
import {DataType} from '../../../lib/clients/types';
import {restClientClass} from '../../../lib/clients/admin';
import {config, matchHeaders, session} from '../utils';
import {
  TestResponse,
  TestConfig,
  TestRequest,
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

/* eslint-disable no-process-env */
const apiServerPort: number = parseInt(
  process.env.HTTP_SERVER_PORT || '3000',
  10,
);
const appPort: number = parseInt(process.env.PORT || '8787', 10);
/* eslint-enable no-process-env */
const apiServer = `localhost:${apiServerPort}`;
const defaultRetryTimer = RestClient.RETRY_WAIT_TIME;
let testCount = 0;

const server = createServer(
  async (request: IncomingMessage, appResponse: ServerResponse) => {
    if (request.method === 'POST') {
      const testConfig: TestConfig =
        await getJSONDataFromRequestStream<TestConfig>(request);
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: TestResponse = testConfig.expectedResponse;
      let testPassed = false;
      let testFailedDebug = '';
      let response;

      setRestClientRetryTime(defaultRetryTimer);

      testCount++;
      console.log(
        `[node] testRequest #${testCount} = ${JSON.stringify(
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
          `[node] testPassed=${testPassed}, testFailedDebug=${testFailedDebug}\n`,
        );
      } else {
        const client = new RestClient({
          session: new Session({...session, shop: apiServer}),
        });
        let timedOut = false;
        let retryTimeout;

        const tries = testRequest.tries || 1;
        const params = {
          path: testRequest.url,
          type: testRequest.bodyType as DataType,
          data: JSON.stringify(testRequest.body),
        };

        if (typeof testRequest.retryTimeoutTimer !== 'undefined') {
          setRestClientRetryTime(testRequest.retryTimeoutTimer);
          console.log(
            `[node] RETRY_TIME_WAIT (BEFORE) = ${RestClient.RETRY_WAIT_TIME} ms\n\n`,
          );

          if (testRequest.retryTimeoutTimer !== 0) {
            console.log(
              `[node] setting setTimeout @ ${RestClient.RETRY_WAIT_TIME} ms\n`,
            );
            retryTimeout = setTimeout(() => {
              try {
                throw new Error(
                  'Request was not retried within the interval defined by Retry-After, test failed',
                );
              } catch (error) {
                console.log(
                  `[node] ${RED}setTimeout fired!${RESET} @ ${RestClient.RETRY_WAIT_TIME}\n`,
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
                  `[node] timedOut=${timedOut}, testPassed=${testPassed}, testFailedDebug=${testFailedDebug}\n`,
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
            response = await client.post(params);
            testPassed =
              JSON.stringify(response.body) === expectedResponse.body;
            break;

          case 'put':
            response = await client.put(params);
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
        `[node] test #${testCount} passed=${
          testPassed ? GREEN : RED
        }${testPassed}${RESET}, debug=${JSON.stringify(
          testFailedDebug,
          undefined,
          2,
        )}\n`,
      );

      if (testPassed) {
        appResponse.statusCode = 200;
        appResponse.end('Test passed!');
      } else {
        appResponse.statusCode = 500;
        appResponse.setHeader('Content-Type', 'application/json');
        appResponse.end(testFailedDebug);
      }
    } else {
      appResponse.statusCode = 200;
      appResponse.end('Ready!');
    }
  },
);

function getJSONDataFromRequestStream<T>(request: IncomingMessage): Promise<T> {
  return new Promise((resolve) => {
    const chunks: any = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      resolve(JSON.parse(Buffer.concat(chunks).toString()));
    });
  });
}

function handle(_signal: any): void {
  process.exit(0);
}

function setRestClientRetryTime(time: number) {
  (RestClient as any).RETRY_WAIT_TIME = time;
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

server.listen(appPort, () => {
  console.log(`Listening on :${appPort}`);
});
