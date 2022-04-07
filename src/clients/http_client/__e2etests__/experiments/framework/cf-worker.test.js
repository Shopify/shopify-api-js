import Shopify from '../../../../../index-cf-worker';
import {
  setAbstractFetchFunc,
  // Response as abstractResponse,
  // Headers,
} from '../../../../../adapters/abstract-http';
import * as cfWorkerAdapter from '../../../../../adapters/cf-worker-adapter';
import {Context} from '../../../../../context';
import {DataType} from '../../../types';
import {HttpClient} from '../../../http_client';
import ProcessedQuery from '../../../../../utils/processed-query';

setAbstractFetchFunc(cfWorkerAdapter.abstractFetch);

const domain = 'localhost:3000';
const successResponseBody = JSON.stringify({
  message: 'Your HTTP request was successful!',
});

function setRestClientRetryTime(time) {
  HttpClient.RETRY_WAIT_TIME = time;
}

function buildExpectedResponse(body) {
  const expectedResponse = {
    headers: {},
    body: JSON.parse(body),
  };

  return expectedResponse;
}

function logResultToConsole(testDescription, passed) {
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
  async fetch(_req, env, _ctx) {
    /**
     * SETUP
     */
    Shopify.Context.initialize({
      API_KEY: env.API_KEY,
      API_SECRET_KEY: env.API_SECRET_KEY,
      SCOPES: 'write_products,write_customers,write_draft_orders'.split(','),
      HOST_NAME: env.HOST?.replace(/https:\/\//, ''),
      IS_EMBEDDED_APP: true,
      API_VERSION: Shopify.API_VERSION,
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
     * 3. 'can make POST request with type JSON and data is already formatted'
     */
    postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: JSON.stringify(postData),
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 3. can make POST request with type JSON and data is already formatted',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 4. 'can make POST request with zero-length JSON'
     */
    postParams = {
      path: '/url/path',
      type: DataType.JSON,
      data: '',
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 4. can make POST request with zero-length JSON',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 5. 'can make POST request with form-data type'
     */
    postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: postData,
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 5. can make POST request with form-data type',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 6. 'can make POST request with form-data type and data is already formatted'
     */
    postParams = {
      path: '/url/path',
      type: DataType.URLEncoded,
      data: ProcessedQuery.stringify(postData),
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 6. can make POST request with form-data type and data is already formatted',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 7. 'can make POST request with GraphQL type'
     */
    const graphqlQuery = `
      query {
        webhookSubscriptions(first:5) {
          edges {
            node {
              id
              endpoint
            }
          }
        }
      }
    `;

    postParams = {
      path: '/url/path',
      type: DataType.GraphQL,
      data: graphqlQuery,
    };

    response = await client.post(postParams);
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    logResultToConsole(
      ' 7. can make POST request with GraphQL type',
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
     * 10. 'gracefully handles errors'
     */
    const statusText = 'Did not work';
    const requestId = 'Request id header';

    const testErrorResponse = async (code, expectedError, expectRequestId) => {
      let caught = false;
      let correctError = false;
      let codePropertyPresent = false;
      let statusTextPropertyPresent = false;
      let correctRequestId = false;
      let retVal = true;

      await client.get({path: `/url/path/${code}`}).catch((error) => {
        caught = true;
        correctError = error instanceof expectedError;
        retVal = retVal && caught && correctError;
        if (expectedError === Shopify.Errors.HttpResponseError) {
          codePropertyPresent = 'code' in error && error.code === code;
          statusTextPropertyPresent =
            'statusText' in error && error.statusText === statusText;
          retVal = retVal && codePropertyPresent && statusTextPropertyPresent;
        }
        if (expectRequestId) {
          correctRequestId = error.message.includes(requestId);
          retVal = retVal && correctRequestId;
        }
      });

      return retVal;
    };

    const fourZeroThreePassed = await testErrorResponse(
      403,
      Shopify.Errors.HttpResponseError,
      true,
    );
    const fourZeroFourPassed = await testErrorResponse(
      404,
      Shopify.Errors.HttpResponseError,
      false,
    );
    const fourTwoNinePassed = await testErrorResponse(
      429,
      Shopify.Errors.HttpThrottlingError,
      true,
    );
    const fiveZeroZeroPassed = await testErrorResponse(
      500,
      Shopify.Errors.HttpInternalError,
      true,
    );

    allPassed =
      allPassed &&
      fourZeroThreePassed &&
      fourZeroFourPassed &&
      fourTwoNinePassed &&
      fiveZeroZeroPassed;
    logResultToConsole(
      '10. gracefully handles errors',
      fourZeroThreePassed &&
        fourZeroFourPassed &&
        fourTwoNinePassed &&
        fiveZeroZeroPassed,
    );

    /**
     * 11. 'allows custom headers'
     */
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    let customHeaders = {
      'X-Not-A-Real-Header': 'some_value',
    };

    response = await client.get({
      path: '/url/path/custom',
      extraHeaders: customHeaders,
    });
    const customuaPassed =
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    allPassed = allPassed && customuaPassed;
    logResultToConsole('11. allows custom headers', customuaPassed);

    /**
     * 12. 'extends User-Agent if it is provided'
     */
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    customHeaders = {'User-Agent': 'My agent'};

    response = await client.get({
      path: '/url/path/uppercaseua',
      extraHeaders: customHeaders,
    });
    const uppercaseuaPassed =
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    customHeaders = {'user-agent': 'My lowercase agent'};

    response = await client.get({
      path: '/url/path/lowercaseua',
      extraHeaders: customHeaders,
    });
    const lowercaseuaPassed =
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    allPassed = allPassed && uppercaseuaPassed && lowercaseuaPassed;
    logResultToConsole(
      '12. extends User-Agent if it is provided',
      uppercaseuaPassed && lowercaseuaPassed,
    );

    /**
     * 13. 'extends a User-Agent provided by Context'
     */
    /* eslint-disable-next-line no-warning-comments */
    // FIXME: change http_server.js to check that the headers were actually sent across
    Context.USER_AGENT_PREFIX = 'Context Agent';
    Context.initialize(Context);

    response = await client.get({path: '/url/path/contextua'});
    const contextuaPassed =
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    customHeaders = {'User-Agent': 'Headers Agent'};

    response = await client.get({
      path: '/url/path/contextandheadersua',
      extraHeaders: customHeaders,
    });
    const contextandheadersuaPassed =
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    allPassed = allPassed && contextuaPassed && contextandheadersuaPassed;
    logResultToConsole(
      '13. extends a User-Agent provided by Context',
      contextuaPassed && contextandheadersuaPassed,
    );

    /**
     * 14. 'fails with invalid retry count'
     */
    let caught = false;
    let correctError = false;
    setRestClientRetryTime(0);

    try {
      await client.get({path: '/url/path', tries: -1});
    } catch (error) {
      caught = true;
      correctError = error instanceof Shopify.Errors.HttpRequestError;
    }
    allPassed = allPassed && caught && correctError;
    logResultToConsole(
      '14. fails with invalid retry count',
      caught && correctError,
    );

    /**
     * 15. 'retries failed requests but returns success'
     */
    setRestClientRetryTime(0);

    response = await client.get({path: '/url/path/retries', tries: 3});
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    logResultToConsole(
      '15. retries failed requests but returns success',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 16. 'retries failed requests and stops on non-retriable errors'
     */
    caught = false;
    correctError = false;
    setRestClientRetryTime(0);

    try {
      await client.get({path: '/url/path/retrythenfail', tries: 3});
    } catch (error) {
      caught = true;
      correctError = error instanceof Shopify.Errors.HttpResponseError;
    }
    allPassed = allPassed && caught && correctError;
    logResultToConsole(
      '16. retries failed requests and stops on non-retriable errors',
      caught && correctError,
    );

    /**
     * 17. 'stops retrying after reaching the limit'
     */
    caught = false;
    correctError = false;
    setRestClientRetryTime(0);

    try {
      await client.get({path: '/url/path/maxretries', tries: 3});
    } catch (error) {
      caught = true;
      correctError = error instanceof Shopify.Errors.HttpMaxRetriesError;
    }
    allPassed = allPassed && caught && correctError;
    logResultToConsole(
      '17. stops retrying after reaching the limit',
      caught && correctError,
    );

    /**
     * 18. 'waits for the amount of time defined by the Retry-After header'
     */
    // Default to a lot longer than the time we actually expect to sleep for
    setRestClientRetryTime(4000);

    // If we don't retry within an acceptable amount of time, we assume to be paused for longer than Retry-After
    /* eslint-disable-next-line no-undef */
    const retryTimeout = setTimeout(() => {
      throw new Error(
        '18. Request was not retried within the interval defined by Retry-After, test failed',
      );
    }, 4000);

    response = await client.get({path: '/url/path/retrythensuccess', tries: 2});
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
    logResultToConsole(
      '18. waits for the amount of time defined by the Retry-After header',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );
    /* eslint-disable-next-line no-undef */
    clearTimeout(retryTimeout);

    /**
     * 19. 'logs deprecation headers to the console when they are present'
     */
    //   console.warn = jest.fn();
    //   await client.get({path: '/url/path/deprecatedget'});

    //   expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
    //     message: 'This API endpoint has been deprecated',
    //     path: 'http://localhost:3000/url/path/deprecatedget',
    //   });

    //   await client.post({
    //     path: '/url/path/deprecatedpost',
    //     type: DataType.JSON,
    //     data: {query: 'some query'},
    //   });

    //   expect(console.warn).toHaveBeenCalledWith('API Deprecation Notice:', {
    //     message: 'This API endpoint has been deprecated',
    //     path: 'http://localhost:3000/url/path/deprecatedpost',
    //   });

    /**
     * 20. 'will wait 5 minutes before logging repeat deprecation alerts'
     */
    //   jest.useFakeTimers();
    //   console.warn = jest.fn();

    //   // first call should call console.warn
    //   await client.get({path: '/url/path/deprecatedget'});
    //   // this one should skip it
    //   await client.get({path: '/url/path/deprecatedget'});
    //   // one warn so far
    //   expect(console.warn).toHaveBeenCalledTimes(1);

    //   // use jest.fn() to advance time by 5 minutes
    //   const currentTime = Date.now();
    //   Date.now = jest.fn(() => currentTime + 300000);

    //   // should warn a second time since 5 mins have passed
    //   await client.get({path: '/url/path/deprecatedget'});

    //   expect(console.warn).toHaveBeenCalledTimes(2);

    /**
     * 21. 'writes deprecation notices to log file if one is specified in Context'
     */
    const logs = [];
    /* eslint-disable-next-line require-await */
    Context.LOG_FUNCTION = async (sev, msg) => {
      logs.push([sev, msg]);
    };
    Context.initialize(Context);

    await client.get({path: '/url/path/deprecatedget'});

    // console.log(logs);
    const includesNotice = logs[0][1].includes('API Deprecation Notice');
    const includesMessage = logs[0][1].includes(
      ': {"message":"This API endpoint has been deprecated","path":"http://localhost:3000/url/path/deprecatedget"}',
    );
    const includesStackTrack = logs[0][1].includes(`Stack Trace: Error`);
    allPassed =
      allPassed && includesNotice && includesMessage && includesStackTrack;

    logResultToConsole(
      '21. writes deprecation notices to log file if one is specified in Context',
      includesNotice && includesMessage && includesStackTrack,
    );

    /**
     * 22. 'properly encodes strings in the error message'
     */
    caught = false;
    correctError = false;
    let correctMsg = false;

    try {
      response = await client.get({path: 'url/path/error'});
    } catch (error) {
      caught = true;
      correctError = error instanceof Shopify.Errors.HttpInternalError;
      correctMsg =
        error.message === `Shopify internal error:\n"Something went wrong"`;
    }

    allPassed = allPassed && caught && correctError && correctMsg;

    logResultToConsole(
      '22. properly encodes strings in the error message',
      caught && correctError && correctMsg,
    );

    /**
     * 23. 'properly encodes objects in the error message'
     */
    caught = false;
    correctError = false;
    correctMsg = false;

    try {
      response = await client.get({path: 'url/path/detailederror'});
    } catch (error) {
      caught = true;
      correctError = error instanceof Shopify.Errors.HttpInternalError;
      correctMsg =
        error.message ===
        `Shopify internal error:` +
          `\n{` +
          `\n  "title": "Invalid title",` +
          `\n  "description": "Invalid description"` +
          `\n}`;
    }
    allPassed = allPassed && caught && correctError && correctMsg;

    logResultToConsole(
      '23. properly encodes objects in the error message',
      caught && correctError && correctMsg,
    );

    /**
     * 24. 'adds missing slashes to paths'
     */
    response = await client.get({path: 'url/path'});
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    // console.log(expectedResponse.body);
    // console.log(response.body);
    logResultToConsole(
      '24. adds missing slashes to paths',
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body),
    );

    /**
     * 25. 'properly formats arrays and hashes in query strings'
     */
    response = await client.get({
      path: '/url/path/query',
      query: {
        array: ['a', 'b', 'c'],
        // eslint-disable-next-line id-length
        hash: {a: 'b', c: 'd'},
      },
    });
    allPassed =
      allPassed &&
      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);

    // console.log(expectedResponse.body);
    // console.log(response.body);
    logResultToConsole(
      '25. properly formats arrays and hashes in query strings',
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
