import {createServer, IncomingMessage, ServerResponse} from 'http';

import '../../node';
import {Headers} from '../../../runtime/http';
import {DataType} from '../../../lib/clients/http_client/types';
import {httpClientClass} from '../../../lib/clients/http_client/http_client';
import {config, matchHeaders} from '../utils';
import {TestResponse, TestConfig, TestRequest} from '../test_config_types';

/* Codes for different Colours */
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[39m';

const HttpClient = httpClientClass(config, 'http');

/* eslint-disable no-process-env */
const apiServerPort: number = parseInt(
  process.env.HTTP_SERVER_PORT || '3000',
  10,
);
const appPort: number = parseInt(process.env.PORT || '8787', 10);
/* eslint-enable no-process-env */
const apiServer = `localhost:${apiServerPort}`;
const client = new HttpClient({domain: apiServer});
const defaultRetryTimer = HttpClient.RETRY_WAIT_TIME;
let testCount = 0;

const server = createServer(
  async (request: IncomingMessage, appResponse: ServerResponse) => {
    if (request.method === 'POST') {
      const testConfig: TestConfig =
        await getJSONDataFromRequestStream<TestConfig>(request);
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: TestResponse = testConfig.expectedResponse;
      const tries = testRequest.tries || 1;
      const params = {
        path: testRequest.url,
        type: testRequest.bodyType as DataType,
        data: JSON.stringify(testRequest.body),
      };
      let testPassed = false;
      let timedOut = false;
      let testFailedDebug = '';
      let response;
      let retryTimeout;

      setRestClientRetryTime(defaultRetryTimer);

      testCount++;
      console.log(
        `[node] testRequest #${testCount} = ${JSON.stringify(
          testRequest,
          undefined,
          2,
        )}\n`,
      );

      if (typeof testRequest.retryTimeoutTimer !== 'undefined') {
        setRestClientRetryTime(testRequest.retryTimeoutTimer);
        console.log(
          `[node] RETRY_TIME_WAIT (BEFORE) = ${HttpClient.RETRY_WAIT_TIME} ms\n\n`,
        );

        if (testRequest.retryTimeoutTimer !== 0) {
          console.log(
            `[node] setting setTimeout @ ${HttpClient.RETRY_WAIT_TIME} ms\n`,
          );
          retryTimeout = setTimeout(() => {
            try {
              throw new Error(
                'Request was not retried within the interval defined by Retry-After, test failed',
              );
            } catch (error) {
              console.log(
                `[node] ${RED}setTimeout fired!${RESET} @ ${HttpClient.RETRY_WAIT_TIME}\n`,
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
          testPassed = JSON.stringify(response.body) === expectedResponse.body;
          break;

        case 'put':
          response = await client.put(params);
          testPassed = JSON.stringify(response.body) === expectedResponse.body;
          break;

        case 'delete':
          response = await client.delete({path: testRequest.url});
          testPassed = JSON.stringify(response.body) === expectedResponse.body;
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
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

server.listen(appPort, () => {
  console.log(`Listening on :${appPort}`);
});
