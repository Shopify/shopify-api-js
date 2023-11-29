import {compare} from 'compare-versions';

import '../adapters/mock';

import {SHOPIFY_API_LIBRARY_VERSION} from './version';
import {toMatchMadeHttpRequest} from './__test-helpers__';

expect.extend({
  toMatchMadeHttpRequest,
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
  toBeWithinDeprecationSchedule(version: string) {
    return {
      message: () =>
        `Found deprecation limited to version ${version}, please update or remove it.`,
      pass: compare(SHOPIFY_API_LIBRARY_VERSION, version, '<'),
    };
  },
});
