import Shopify from '../../../../../index-cf-worker';
import {
  setAbstractFetchFunc,
  Response,
  // Headers,
} from '../../../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../../../adapters/cf-worker-adapter';
// import {Context} from '../../../../../context';
import {DataType} from '../../../types';
import {HttpClient} from '../../../http_client';
// import ProcessedQuery from '../../../../../utils/processed-query';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);

const domain: string = 'localhost:3000';
const successResponseBody: string = JSON.stringify({
  message: 'Your HTTP request was successful!',
});

// function setRestClientRetryTime(time) {
//   HttpClient.RETRY_WAIT_TIME = time;
// }

function buildExpectedResponse(body: string): Partial<Response> {
  const expectedResponse = {
    headers: {},
    body: JSON.parse(body),
  };

  return expectedResponse;
}

function logResultToConsole(testDescription: string, passed: boolean) {
  if (passed) {
    /* eslint-disable-next-line no-undef */
    console.log(`\x1b[32mPASSED\x1b[0m: ${testDescription}`);
  } else {
    /* eslint-disable-next-line no-undef */
    console.log(`\x1b[31mFAILED\x1b[0m: ${testDescription}`);
  }
}

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  /* eslint-disable-next-line no-unused-vars */
  async fetch(_req: any, env: any, _ctx: any) {
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
    let allPassed = true;

    /**
     * 1. 'can make GET request'
     */
    let response = await client.get({path: '/url/path'});
    const expectedResponse = buildExpectedResponse(successResponseBody);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    // console.log(expectedResponse.body);
    // console.log(response.body);
    logResultToConsole(
      ' 1. can make GET request',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 2. 'can make POST request with type JSON'
     */
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    let postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: postData,
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 2. can make POST request with type JSON',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 8. 'can make PUT request with type JSON'
     */
    const putData = {
      title: 'Test product',
      amount: 10,
    };

    const putParams = {
      path: '/url/path/123',
      type: DataType.JSON,
      data: putData,
    };

    response = await client.put(putParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    logResultToConsole(
      ' 8. can make PUT request with type JSON',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 9. 'can make DELETE request'
     */
    response = await client.delete({path: '/url/path/123'});
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    logResultToConsole(
      ' 9. can make DELETE request',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * END: Shut down the test server, respond to the triggering request
     */
    await client.get({path: '/url/path/endtest'});

    if (allPassed) {
      /* eslint-disable-next-line no-undef */
      return new Response('All tests passed!', {status: 200});
    } else {
      /* eslint-disable-next-line no-undef */
      return new Response('Tests failed :(', {status: 500});
    }
  },
};
