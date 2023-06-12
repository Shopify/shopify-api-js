import {compare} from 'compare-versions';

import '../adapters/mock';
import {mockTestRequests} from '../adapters/mock/mock_test_requests';
import {canonicalizeHeaders} from '../runtime/http';

import {SHOPIFY_API_LIBRARY_VERSION} from './version';

beforeEach(() => {
  mockTestRequests.reset();
});

afterEach(() => {
  const remainingResponses = mockTestRequests.getResponses();
  if (remainingResponses.length) {
    throw new Error(
      `Test did not check all expected responses, responses: ${JSON.stringify(
        remainingResponses,
        undefined,
        2,
      )}`,
    );
  }
});

interface AssertHttpRequestParams {
  method: string;
  domain: string;
  path: string;
  query?: string;
  headers?: {[key: string]: unknown};
  data?: string | {[key: string]: unknown} | null;
  attempts?: number;
}

expect.extend({
  /**
   * Checks if two dates in the form of numbers are within seconds of each other
   *
   * @param received First date
   * @param compareDate Second date
   * @param seconds The number of seconds the first and second date should be within
   */
  toBeWithinSecondsOf(received: number, compareDate: number, seconds: number) {
    if (
      received &&
      compareDate &&
      Math.abs(received - compareDate) <= seconds * 1000
    ) {
      return {
        message: () =>
          `expected ${received} not to be within ${seconds} seconds of ${compareDate}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within ${seconds} seconds of ${compareDate}`,
        pass: false,
      };
    }
  },
  toMatchMadeHttpRequest({
    method,
    domain,
    path,
    query = '',
    headers = {},
    data = undefined,
    attempts = 1,
  }: AssertHttpRequestParams) {
    const searchHeaders = canonicalizeHeaders(headers as any);
    const searchUrl = new URL(
      `https://${domain}${path}${query ? `?${query}` : ''}`,
    );

    // We compare the sorted query items, so we can expect arguments in a different order
    const searchQueryItems = Array.from(
      searchUrl.searchParams.entries(),
    ).sort();
    const cleanSearchUrl = searchUrl.toString().split('?')[0];

    for (let i = 0; i < attempts; i++) {
      const matchingRequest = mockTestRequests.getRequest();
      if (!matchingRequest) {
        throw new Error(
          `No request was made, but expected ${JSON.stringify(
            {method, domain, path},
            undefined,
            2,
          )}`,
        );
      }

      const requestUrl = new URL(matchingRequest!.url);
      const requestQueryItems = Array.from(
        requestUrl.searchParams.entries(),
      ).sort();
      const cleanRequestUrl = requestUrl.toString().split('?')[0];

      expect(matchingRequest).not.toBeNull();
      expect(matchingRequest!.method).toEqual(method);
      expect(matchingRequest!.headers).toMatchObject(searchHeaders);
      expect(cleanRequestUrl).toEqual(cleanSearchUrl);
      expect(requestQueryItems).toEqual(searchQueryItems);

      if (data) {
        if (
          typeof data === 'string' ||
          data.constructor.name === 'StringContaining'
        ) {
          expect(matchingRequest!.body).toEqual(data);
        } else {
          const requestBody =
            typeof matchingRequest!.body === 'string'
              ? JSON.parse(matchingRequest!.body)
              : matchingRequest!.body;
          expect(requestBody).toMatchObject(data);
        }
      } else {
        expect(matchingRequest!.body).toBeFalsy();
      }
    }

    return {
      message: () => `expected to have seen the right HTTP requests`,
      pass: true,
    };
  },
  toBeWithinDeprecationSchedule(version: string) {
    return {
      message: () =>
        `Found deprecation limited to version ${version}, please update or remove it.`,
      pass: compare(SHOPIFY_API_LIBRARY_VERSION, version, '<'),
    };
  },
});
