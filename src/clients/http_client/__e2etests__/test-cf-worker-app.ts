import {setAbstractFetchFunc} from '../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../adapters/cf-worker-adapter';
import {DataType, PostRequestParams, PutRequestParams} from '../types';
import {HttpClient} from '../http_client';

import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

/* Codes for different Colours */
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[39m';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);
const defaultRetryTimer = HttpClient.RETRY_WAIT_TIME;
let testCount = 0;

function params(
  testRequest: TestRequest,
): PutRequestParams | PostRequestParams {
  return {
    path: testRequest.url,
    type: testRequest.bodyType as DataType,
    data: JSON.stringify(testRequest.body),
  };
}

function setRestClientRetryTime(time: number) {
  // We de-type HttpClient here so we can alter its readonly time property
  (HttpClient as unknown as {[key: string]: number}).RETRY_WAIT_TIME = time;
}

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  async fetch(req: any, env: any, _ctx: any) {
    const apiServerPort: number = parseInt(env.HTTP_SERVER_PORT || '3000', 10);
    const client = new HttpClient(`localhost:${apiServerPort}`);

    if (req.method === 'POST') {
      const testConfig: TestConfig = await req.json();
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: ExpectedResponse = testConfig.expectedResponse;
      const tries = testRequest.tries || 1;
      let testPassed = false;
      let timedOut = false;
      let retryTimeout;
      let testFailedDebug = '';
      let response;

      setRestClientRetryTime(defaultRetryTimer);

      testCount++;
      console.log(
        `[cfWorker] testRequest #${testCount} = ${JSON.stringify(
          testRequest,
          undefined,
          2,
        )}\n`,
      );

      if (typeof testRequest.retryTimeoutTimer !== 'undefined') {
        setRestClientRetryTime(testRequest.retryTimeoutTimer);
        console.log(
          `[cfWorker] RETRY_TIME_WAIT (BEFORE) = ${HttpClient.RETRY_WAIT_TIME}\n`,
        );
        if (testRequest.retryTimeoutTimer !== 0) {
          console.log(
            `[cfWorker] setting setTimeout @ ${HttpClient.RETRY_WAIT_TIME} ms\n`,
          );

          retryTimeout = setTimeout(() => {
            try {
              throw new Error(
                'Request was not retried within the interval defined by Retry-After, test failed',
              );
            } catch (error) {
              console.log(
                `[cfWorker] ${RED}setTimeout fired!${RESET} @ ${HttpClient.RETRY_WAIT_TIME}\n`,
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
                `[cfWorker] timedOut=${timedOut}, testPassed=${testPassed}, testFailedDebug=${testFailedDebug}\n`,
              );
            } else {
              testPassed =
                JSON.stringify(response.body) === expectedResponse.body;
              testFailedDebug = JSON.stringify({
                bodyExpected: expectedResponse.body,
                bodyReceived: response.body,
              });
            }
          } catch (error) {
            testPassed = error.constructor.name.startsWith(
              expectedResponse.errorType,
            );
            if (expectedResponse.errorType === 'HttpResponseError') {
              testPassed =
                testPassed &&
                'code' in error &&
                error.code === expectedResponse.statusCode &&
                'statusText' in error &&
                error.statusText === expectedResponse.statusText;
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
          testPassed = JSON.stringify(response.body) === expectedResponse.body;
          break;

        case 'put':
          response = await client.put(params(testRequest));
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
        `[cfWorker] test #${testCount} passed=${
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
          },
        });
      }
    } else {
      return new Response('Ready!', {status: 200});
    }
  },
};
