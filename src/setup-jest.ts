import './adapters/mock';
import {mockTestRequests} from './adapters/mock/mock_test_requests';
import {canonicalizeHeaders} from './runtime/http';

beforeEach(() => {
  mockTestRequests.reset();
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
});
