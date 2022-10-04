import fetchMock from 'jest-fetch-mock';

import {Context} from '../context';
import {ApiVersion} from '../base-types';
import {MemorySessionStorage} from '../auth/session';

fetchMock.enableMocks();

let currentCall = 0;
beforeEach(() => {
  // We want to reset the Context object on every run so that tests start with a consistent state
  Context.initialize({
    API_KEY: 'test_key',
    API_SECRET_KEY: 'test_secret_key',
    SCOPES: ['test_scope'],
    HOST_NAME: 'test_host_name',
    HOST_SCHEME: 'https',
    API_VERSION: ApiVersion.Unstable,
    IS_EMBEDDED_APP: false,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new MemorySessionStorage(),
    CUSTOM_SHOP_DOMAINS: undefined,
    BILLING: undefined,
  });

  fetchMock.mockReset();

  currentCall = 0;
});

interface AssertHttpRequestParams {
  method: string;
  domain: string;
  path: string;
  query?: string;
  headers?: {[key: string]: unknown};
  data?: string | {[key: string]: unknown} | null;
  tries?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/naming-convention */
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }
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
    tries = 1,
  }: AssertHttpRequestParams) {
    const searchUrl = new URL(
      `https://${domain}${path}${
        query ? `?${query.replace(/\+/g, '%20')}` : ''
      }`,
    );

    // We compare the sorted query items, so we can expect arguments in a different order
    const searchQueryItems = Array.from(
      searchUrl.searchParams.entries(),
    ).sort();
    const cleanSearchUrl = searchUrl.toString().split('?')[0];

    const bodyObject = data && typeof data !== 'string';
    const maxCall = currentCall + tries;
    for (let i = currentCall; i < maxCall; i++) {
      currentCall++;

      const mockCall = fetchMock.mock.calls[i];
      expect(mockCall).not.toBeUndefined();

      const requestUrl = new URL(mockCall[0] as string);
      const requestQueryItems = Array.from(
        requestUrl.searchParams.entries(),
      ).sort();
      const cleanRequestUrl = requestUrl.toString().split('?')[0];

      if (bodyObject && mockCall[1]) {
        mockCall[1].body = JSON.parse(mockCall[1].body as string);
      }

      expect(cleanRequestUrl).toEqual(cleanSearchUrl);
      expect(requestQueryItems).toEqual(searchQueryItems);
      expect(mockCall[1]).toMatchObject({method, headers, body: data});
    }

    return {
      message: () => `expected to have seen the right HTTP requests`,
      pass: true,
    };
  },
});
