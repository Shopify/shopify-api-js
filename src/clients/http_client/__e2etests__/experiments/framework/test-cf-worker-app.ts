import Shopify from '../../../../../index-cf-worker';
import {
  setAbstractFetchFunc,
  // Response,
  // Headers,
} from '../../../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../../../adapters/cf-worker-adapter';
// import {Context} from '../../../../../context';
import {DataType} from '../../../types';
import {HttpClient} from '../../../http_client';
// import ProcessedQuery from '../../../../../utils/processed-query';
import {ExpectedResponse, TestConfig, TestRequest} from './test_config';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);

const domain: string = 'localhost:3000';
// const successResponseBody: string = JSON.stringify({
//   message: 'Your HTTP request was successful!',
// });

// function setRestClientRetryTime(time) {
//   HttpClient.RETRY_WAIT_TIME = time;
// }

// function buildExpectedResponse(body: string): Partial<Response> {
//   const expectedResponse = {
//     headers: {},
//     body: JSON.parse(body),
//   };

//   return expectedResponse;
// }

// function logResultToConsole(testDescription: string, passed: boolean) {
//   if (passed) {
//     /* eslint-disable-next-line no-undef */
//     console.log(`\x1b[32mPASSED\x1b[0m: ${testDescription}`);
//   } else {
//     /* eslint-disable-next-line no-undef */
//     console.log(`\x1b[31mFAILED\x1b[0m: ${testDescription}`);
//   }
// }

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  /* eslint-disable-next-line no-unused-vars */
  async fetch(req: any, env: any, _ctx: any) {
    /**
     * SETUP
     */
    Shopify.Context.initialize({
      API_KEY: env.API_KEY,
      API_SECRET_KEY: env.API_SECRET_KEY,
      SCOPES: 'write_products,write_customers,write_draft_orders'.split(','),
      HOST_NAME: env.HOST?.replace(/https:\/\//, ''),
      IS_EMBEDDED_APP: true,
      API_VERSION: Shopify.Context.API_VERSION,
    });

    const client = new HttpClient(domain);

    /**
     * Process test request from e2e-runner
     */
    if (req.method === 'POST' ) {
      const testConfig: TestConfig = await req.json();
      const testRequest: TestRequest = testConfig.testRequest;
      const expectedResponse: ExpectedResponse = testConfig.expectedResponse;
      let testPassed = false;
      // console.log(`TestRequest: ${JSON.stringify(testRequest, null, 2)}`);
      // console.log(`ExpectedResponse: ${JSON.stringify(expectedResponse, null, 2)}`);

      switch(testRequest.method.toLowerCase()) {
        case 'get':
          let response = await client.get({path: testRequest.url});
          console.log(`response from http_server = ${JSON.stringify(response.body)}`);

          testPassed = JSON.stringify(response.body) === expectedResponse.body;
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
        return new Response('All tests passed!', {status: 200}); // eslint-disable-line no-undef
      } else {
        return new Response('Tests failed :(', {status: 500}); // eslint-disable-line no-undef
      }
    } else {
      return new Response('Not a POST request', {status: 500}); // eslint-disable-line no-undef
    }
  },
};
