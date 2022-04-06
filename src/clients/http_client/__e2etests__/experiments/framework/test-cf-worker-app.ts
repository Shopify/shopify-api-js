// import Shopify from '../../../../../index-cf-worker';
import {setAbstractFetchFunc} from '../../../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../../../adapters/cf-worker-adapter';
import {DataType} from '../../../types';
import {HttpClient} from '../../../http_client';
import {ExpectedResponse, TestConfig, TestRequest} from './test_config_types';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);

const domain: string = 'localhost:3000';

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  /* eslint-disable-next-line no-unused-vars */
  async fetch(req: any, _env: any, _ctx: any) {
    const client = new HttpClient(domain);

    /**
     * Process test request from e2e-runner
     */
    if (req.method === 'POST' ) {
      const testConfig: TestConfig = await req.json();
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
        return new Response('Test passed :)', {status: 200}); // eslint-disable-line no-undef
      } else {
        return new Response(testFailedDebug, {status: 500, headers: { 'Content-Type': 'application/json'}}); // eslint-disable-line no-undef
      }
    } else {
      return new Response('Not a POST request', {status: 500}); // eslint-disable-line no-undef
    }
  },
};
