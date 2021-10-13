import {enableFetchMocks} from 'jest-fetch-mock';

import {Context} from '../context';
import {ApiVersion} from '../base_types';
import {MemorySessionStorage} from '../auth/session';

enableFetchMocks();

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

  fetchMock.mockRestore();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
    }
  }
}

/**
 * Checks if two dates in the form of numbers are within seconds of each other
 *
 * @param received First date
 * @param compareDate Second date
 * @param seconds The number of seconds the first and second date should be within
*/
expect.extend({
  toBeWithinSecondsOf(received: number, compareDate: number, seconds: number) {
    if (received && compareDate && Math.abs(received - compareDate) <= seconds * 1000) {
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
});
