import {setAbstractFetchFunc} from '../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../adapters/cf-worker-adapter';
import {DataType, PostRequestParams, PutRequestParams} from '../types';
import {HttpClient} from '../http_client';

import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);

function params(
  testRequest: TestRequest,
): PutRequestParams | PostRequestParams {
  return {
    path: testRequest.url,
    type: testRequest.bodyType as DataType,
    data: JSON.stringify(testRequest.body),
  };
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
      let testPassed = false;
      let testFailedDebug = '';
      let response;
      const tries = testRequest.tries || 1;

      switch (testRequest.method.toLowerCase()) {
        case 'get':
          try {
            response = await client.get({
              path: testRequest.url,
              tries,
              extraHeaders: testRequest.headers,
            });

            testPassed =
              JSON.stringify(response.body) === expectedResponse.body;
            testFailedDebug = JSON.stringify({
              bodyExpected: expectedResponse.body,
              bodyReceived: response.body,
            });
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
