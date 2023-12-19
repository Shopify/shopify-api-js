/* global process */
import {createServer, IncomingMessage, ServerResponse} from 'http';

import {
  Headers,
  NormalizedRequest,
  NormalizedResponse,
} from '../../../runtime/http';
import {initTestRequest, initTestResponse} from '../test_config_types';
import {matchHeaders} from '../utils';

interface Test {
  expectedRequest: NormalizedRequest;
  testResponse: NormalizedResponse;
}

// eslint-disable-next-line no-process-env
const port: number = parseInt(process.env.HTTP_SERVER_PORT || '3000', 10);
const errorStatusText = 'Did not work';
const requestId = 'Request id header';
const tests: Record<string | number, Test> = {
  200: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse(),
  },
  custom: {
    expectedRequest: initTestRequest({
      headers: {'X-Not-A-Real-Header': 'some_value'},
    }),
    testResponse: initTestResponse({
      headers: {'X-Not-A-Real-Header': 'some_value'},
    }),
  },
  lowercaseua: {
    expectedRequest: initTestRequest({
      headers: {'user-agent': 'My lowercase agent'},
    }),
    testResponse: initTestResponse({
      headers: {'user-agent': 'My lowercase agent'},
    }),
  },
  uppercaseua: {
    expectedRequest: initTestRequest({
      headers: {'User-Agent': 'My agent'},
    }),
    testResponse: initTestResponse({
      headers: {'User-Agent': 'My agent'},
    }),
  },
  deprecatedget: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      headers: {
        'X-Shopify-API-Deprecated-Reason':
          'This API endpoint has been deprecated',
      },
      body: JSON.stringify({message: 'Some deprecated request'}),
    }),
  },
  deprecatedpost: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      headers: {
        'X-Shopify-API-Deprecated-Reason':
          'This API endpoint has been deprecated',
      },
      body: JSON.stringify({
        message: 'Some deprecated post request',
        body: {
          query: 'some query',
        },
      }),
    }),
  },
  400: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 400,
      statusText: errorStatusText,
      headers: {'x-request-id': requestId},
      body: JSON.stringify({errors: 'Something went wrong!'}),
    }),
  },
  403: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 403,
      statusText: errorStatusText,
      headers: {'x-request-id': requestId},
      body: JSON.stringify({errors: 'Something went wrong!'}),
    }),
  },
  404: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 404,
      statusText: errorStatusText,
      body: JSON.stringify({}),
    }),
  },
  417: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 417,
      statusText: 'Expectation Failed',
    }),
  },
  429: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 429,
      statusText: errorStatusText,
      headers: {'x-request-id': requestId},
      body: JSON.stringify({errors: 'Something went wrong!'}),
    }),
  },
  wait: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 429,
      statusText: errorStatusText,
      headers: {'Retry-After': (0.1).toString()},
      body: JSON.stringify({errors: 'Something went wrong!'}),
    }),
  },
  500: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 500,
      statusText: errorStatusText,
      headers: {'x-request-id': requestId},
      body: JSON.stringify({}),
    }),
  },
  error: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 500,
      statusText: errorStatusText,
      body: JSON.stringify({errors: 'Something went wrong'}),
    }),
  },
  detailederror: {
    expectedRequest: initTestRequest(),
    testResponse: initTestResponse({
      statusCode: 500,
      statusText: errorStatusText,
      body: JSON.stringify({
        errors: {title: 'Invalid title', description: 'Invalid description'},
      }),
    }),
  },
};

let retryCount = 0;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const lookup = req.url?.match(/^\/url\/path\/([a-z0-9]*)$/);
  const receivedHeaders = req.headers;
  const code = lookup ? lookup[1] : '200';
  const test = tests[code] || tests['200'];
  const expectedRequest = test.expectedRequest;
  let testResponse = test.testResponse;

  if (matchHeaders(receivedHeaders as Headers, expectedRequest.headers)) {
    if (code === 'retries' && retryCount < 2) {
      testResponse = tests['429'].testResponse;
      retryCount += 1;
    }
    if (code === 'retrythenfail') {
      if (retryCount === 0) {
        testResponse = tests['500'].testResponse;
        retryCount = 1;
      } else {
        testResponse = tests['403'].testResponse;
        // this is the end of the test, reset the counter
        retryCount = 0;
      }
    }
    if (code === 'retrythensuccess') {
      if (retryCount === 0) {
        testResponse = tests.wait.testResponse;
        retryCount = 1;
      } else {
        // this is the end of the test, reset the counter; response already defaults to success
        retryCount = 0;
      }
    }
    if (code === 'maxretries') {
      testResponse = tests['500'].testResponse;
    }
  } else {
    // return an "expectation failed" message
    testResponse = tests['417'].testResponse;
    testResponse.body = JSON.stringify({
      errors: {
        message:
          'There was a header mismatch between expected request and received request',
        receivedHeaders,
        expectedHeaders: expectedRequest.headers,
      },
    });
  }

  // console.log(response);
  res.writeHead(
    testResponse.statusCode,
    testResponse.statusText,
    testResponse.headers,
  );
  res.end(testResponse.body);

  // reset counters
  if (code !== 'retries' && retryCount === 2) {
    retryCount = 0;
  }

  if (code === 'endtest') {
    handle(0);
  }
});

function handle(_signal: any): void {
  process.exit(0);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

server.listen(port, () => {
  console.log(`Listening on :${port}`);
});
