import './adapters/mock';
import {reset, findRequest} from './adapters/mock/adapter';
import {canonicalizeHeaders} from './runtime/http';

beforeEach(() => {
  reset();
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
    data = null,
  }: AssertHttpRequestParams) {
    const searchHeaders = canonicalizeHeaders(headers as any);
    const searchBody =
      data && typeof data !== 'string' ? JSON.stringify(data) : data;
    const searchUrl = `https://${domain}${path}${
      query ? `?${query.replace(/\+/g, '%20')}` : ''
    }`;

    const matchingRequest = findRequest({
      url: searchUrl,
      method,
      headers: searchHeaders,
      body: searchBody!,
    });
    expect(matchingRequest).not.toBeNull();
    expect(matchingRequest!.headers).toMatchObject(searchHeaders);

    return {
      message: () => `expected to have seen the right HTTP requests`,
      pass: true,
    };
  },
});
