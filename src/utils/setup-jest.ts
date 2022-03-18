// import fetchMock from 'jest-fetch-mock';
import * as jose from 'jose';

import {Context} from '../context';
import {ApiVersion} from '../base-types';
import {MemorySessionStorage} from '../auth/session';
import {JwtPayload} from '../utils/decode-session-token';
import * as mockAdapter from '../adapters/mock-adapter';
import {getHMACKey} from './get-hmac-key';

// fetchMock.enableMocks();

// let currentCall = 0;
beforeEach(() => {
  // We want to reset the Context object on every run so that tests start with a consistent state
  Context.initialize({
    API_KEY: 'test_key',
    API_SECRET_KEY: 'test_secret_key',
    SCOPES: ['test_scope'],
    HOST_NAME: 'test_host_name',
    API_VERSION: ApiVersion.Unstable,
    IS_EMBEDDED_APP: false,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new MemorySessionStorage(),
  });

  // fetchMock.mockReset();

  // currentCall = 0;
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
    headers = {},
    data,
  }: AssertHttpRequestParams) {
    const lastRequest: any = mockAdapter.getLastRequest();
    const parsedURL = new URL(lastRequest.url);
    lastRequest.path = parsedURL.pathname;
    lastRequest.domain = parsedURL.hostname;
    lastRequest.query = parsedURL.search.slice(1);
    lastRequest.data = lastRequest.body;
    expect(lastRequest).toMatchObject({method, headers, body: data});

    return {
      message: () => `expected to have seen the right HTTP requests`,
      pass: true,
    };
  },
});

export async function signJWT(payload: JwtPayload): Promise<string> {
  return await new jose.SignJWT(payload as any)
    .setProtectedHeader({alg: 'HS256'})
    .sign(getHMACKey(Context.API_SECRET_KEY));
}
