import { createServer, IncomingMessage, ServerResponse } from 'http';
// import Shopify from '../../../../../index-node';
import {setAbstractFetchFunc} from '../../../../../adapters/abstract-http';
import * as nodeAdapter from '../../../../../adapters/node-adapter';
import {DataType} from '../../../types';
import {HttpClient} from '../../../http_client';
import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

setAbstractFetchFunc(nodeAdapter.abstractFetch);

const api_server: string = 'localhost:3000';
const port = 8787;
const client = new HttpClient(api_server);

const server = createServer(async (request: IncomingMessage, appResponse: ServerResponse) => {
  /**
   * Process test request from e2e-runner
   */
  if (request.method === 'POST' ) {
    const testConfig: TestConfig = await getJSONDataFromRequestStream<TestConfig>(request);
    const testRequest: TestRequest = testConfig.testRequest;
    const expectedResponse: ExpectedResponse = testConfig.expectedResponse;
    let testPassed = false;
    let testFailedDebug = '';
    let response = undefined;
    // console.log(`TestRequest: ${JSON.stringify(testRequest, null, 2)}`);
    // console.log(`ExpectedResponse: ${JSON.stringify(expectedResponse, null, 2)}`);

    switch(testRequest.method.toLowerCase()) {
      case 'get':
        let tries = testRequest.tries || 1;
        try {
          response = await client.get({path: testRequest.url, tries: tries, extraHeaders: testRequest.headers});
          // console.log(`response from http_server = ${JSON.stringify(response.body)}`);

          testPassed = JSON.stringify(response.body) === expectedResponse.body;
        } catch(error) {
          testPassed = error.constructor.name.startsWith(expectedResponse.errorType);
          if (expectedResponse.errorType === 'HttpResponseError') {
            const codePropertyPresent = 'code' in error && error.code === expectedResponse.statusCode;
            const statusTextPropertyPresent = 'statusText' in error && error.statusText === expectedResponse.statusText;
            testPassed = testPassed && codePropertyPresent && statusTextPropertyPresent;
          }
          if ('expectRequestId' in expectedResponse) {
            testPassed = testPassed && error.message.includes(expectedResponse.expectRequestId)
          }
          if ('errorMessage' in expectedResponse) {
            testPassed = testPassed && error.message === expectedResponse.errorMessage;
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
        const postParams = {
          path: testRequest.url,
          type: testRequest.bodyType as DataType,
          data: JSON.stringify(testRequest.body),
        };
        response = await client.post(postParams);
        // console.log(`response from http_server = ${JSON.stringify(response.body)}`);

        testPassed = JSON.stringify(response.body) === expectedResponse.body;
        break;

      case 'put':
        const putParams = {
          path: testRequest.url,
          type: testRequest.bodyType as DataType,
          data: JSON.stringify(testRequest.body),
        };

        response = await client.put(putParams);
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
      appResponse.end('Test passed :)');
    } else {
      appResponse.statusCode = 500;
      appResponse.setHeader('Content-Type', 'application/json');
      appResponse.end(testFailedDebug);
    }
  } else {
    appResponse.statusCode = 500;
    appResponse.end('Not a POST request');
  }
});

function getJSONDataFromRequestStream<T>(request: IncomingMessage): Promise<T> {
  return new Promise(resolve => {
    const chunks: any = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      resolve(
        JSON.parse(
          Buffer.concat(chunks).toString()
        )
      )
    });
  })
}
// eslint-disable-next-line no-unused-vars
function handle(_signal: any): void {
  process.exit(0);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

// eslint-disable-next-line no-empty-function
server.listen(port, () => {});
