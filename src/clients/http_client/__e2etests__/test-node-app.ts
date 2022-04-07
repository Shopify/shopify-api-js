import {createServer, IncomingMessage, ServerResponse} from 'http';

import {setAbstractFetchFunc} from '../../../adapters/abstract-http';
import * as nodeAdapter from '../../../adapters/node-adapter';
import {DataType} from '../types';
import {HttpClient} from '../http_client';

import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

setAbstractFetchFunc(nodeAdapter.abstractFetch);

/* eslint-disable no-process-env */
const apiServerPort: number = parseInt(
  process.env.HTTP_SERVER_PORT || '3000',
  10,
);
const appPort: number = parseInt(process.env.PORT || '8787', 10);
/* eslint-enable no-process-env */
const apiServer = `localhost:${apiServerPort}`;
const client = new HttpClient(apiServer);

const server = createServer(
  async (request: IncomingMessage, appResponse: ServerResponse) => {
    if (request.method === 'POST') {
      const testConfig: TestConfig =
        await getJSONDataFromRequestStream<TestConfig>(request);
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: ExpectedResponse = testConfig.expectedResponse;
      let testPassed = false;
      let testFailedDebug = '';
      let response;
      const tries = testRequest.tries || 1;
      const params = {
        path: testRequest.url,
        type: testRequest.bodyType as DataType,
        data: JSON.stringify(testRequest.body),
      };

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

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

server.listen(appPort, () => {
  console.log(`Listening on :${appPort}`);
});
