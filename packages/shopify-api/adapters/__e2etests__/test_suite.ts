import {DataType} from '../../lib/clients/types';
import ProcessedQuery from '../../lib/utils/processed-query';

import {TestType, initTestRequest, initTestResponse} from './test_config_types';

const postData = {
  title: 'Test product',
  amount: 10,
};

const putData = {
  title: 'Test product',
  amount: 10,
};

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

export const testSuite = [
  {
    name: 'can make GraphQL request',
    config: {
      testRequest: initTestRequest({
        type: TestType.Graphql,
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make GraphQL request with errors',
    config: {
      testRequest: initTestRequest({
        type: TestType.Graphql,
        url: '/url/path/400',
      }),
      expectedResponse: initTestResponse({
        statusCode: 400,
        statusText: 'Did not work',
        errorType: 'HttpBadRequestError',
      }),
    },
  },
  {
    name: 'can make GET request',
    config: {
      testRequest: initTestRequest(),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with type JSON',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(postData),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with type JSON and data is already formatted',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(JSON.stringify(postData)),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with zero-length JSON',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.JSON,
        body: JSON.stringify(''),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with form-data type',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.URLEncoded,
        body: JSON.stringify(postData),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with form-data type and data is already formatted',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.URLEncoded,
        body: ProcessedQuery.stringify(postData),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make POST request with GraphQL type',
    config: {
      testRequest: initTestRequest({
        method: 'post',
        bodyType: DataType.GraphQL,
        body: graphqlQuery,
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make PUT request with type JSON',
    config: {
      testRequest: initTestRequest({
        method: 'put',
        url: '/url/path/123',
        bodyType: DataType.JSON,
        body: JSON.stringify(putData),
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'can make DELETE request',
    config: {
      testRequest: initTestRequest({
        method: 'delete',
        url: '/url/path/123',
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'gracefully handles 403 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/403'}),
      expectedResponse: initTestResponse({
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'gracefully handles 404 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/404'}),
      expectedResponse: initTestResponse({
        statusCode: 404,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      }),
    },
  },
  {
    name: 'gracefully handles 429 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/429'}),
      expectedResponse: initTestResponse({
        statusCode: 429,
        statusText: 'Did not work',
        errorType: 'HttpThrottlingError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'gracefully handles 500 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/500'}),
      expectedResponse: initTestResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'gracefully handles 503 error',
    config: {
      testRequest: initTestRequest({url: '/url/path/503'}),
      expectedResponse: initTestResponse({
        statusCode: 503,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        expectRequestId: 'Request id header',
      }),
    },
  },
  {
    name: 'allows custom headers',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/custom',
        headers: {'X-Not-A-Real-Header': 'some_value'},
      }),
      expectedResponse: initTestResponse({
        headers: {'X-Not-A-Real-Header': 'some_value'},
      }),
    },
  },
  {
    name: 'extends User-Agent if it is provided (capitalized)',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/uppercaseua',
        headers: {'User-Agent': 'My agent'},
      }),
      expectedResponse: initTestResponse({
        headers: {'User-Agent': 'My agent'},
      }),
    },
  },
  {
    name: 'extends User-Agent if it is provided (lowercase)',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/lowercaseua',
        headers: {'user-agent': 'My lowercase agent'},
      }),
      expectedResponse: initTestResponse({
        headers: {'user-agent': 'My lowercase agent'},
      }),
    },
  },
  {
    name: 'retries failed requests but returns success',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retries',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'retries failed requests and stops on non-retriable errors',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retrythenfail',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initTestResponse({
        statusCode: 403,
        statusText: 'Did not work',
        errorType: 'HttpResponseError',
      }),
    },
  },
  {
    name: 'stops retrying after reaching the limit',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/maxretries',
        tries: 3,
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initTestResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpMaxRetriesError',
      }),
    },
  },
  {
    name: 'waits for the amount of time defined by the Retry-After header',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/retrythensuccess',
        tries: 2,
        retryTimeoutTimer: 3000,
      }),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'properly encodes strings in the error message',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/error',
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initTestResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage: `Shopify internal error:\n"Something went wrong"`,
      }),
    },
  },
  {
    name: 'properly encodes objects in the error message',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/detailederror',
        retryTimeoutTimer: 0,
      }),
      expectedResponse: initTestResponse({
        statusCode: 500,
        statusText: 'Did not work',
        errorType: 'HttpInternalError',
        errorMessage:
          `Shopify internal error:` +
          `\n{` +
          `\n  "title": "Invalid title",` +
          `\n  "description": "Invalid description"` +
          `\n}`,
      }),
    },
  },
  {
    name: 'adds missing slashes to paths',
    config: {
      testRequest: initTestRequest({url: 'url/path'}),
      expectedResponse: initTestResponse(),
    },
  },
  {
    name: 'properly formats arrays and hashes in query strings',
    config: {
      testRequest: initTestRequest({
        url: '/url/path/query',
        query: JSON.stringify({
          array: ['a', 'b', 'c'],
          // eslint-disable-next-line id-length
          hash: {a: 'b', c: 'd'},
        }),
      }),
      expectedResponse: initTestResponse(),
    },
  },
];
