import {LogSeverity} from '../types';
import {shopifyApi, Shopify} from '..';
// import {abstractRuntimeString} from '../../runtime/platform';

import {testConfig} from './test-helper';

let shopify: Shopify;

// need this as the runtimeString is "Mock Adapter"
jest.mock('../../runtime/platform', () => ({
  abstractRuntimeString: jest.fn(() => 'Node'),
}));

describe('shopifyApi', () => {
  afterAll(() => {
    jest.resetModules();
  });

  [
    {
      version: 'v14.0.0',
      deprecated: true,
    },
    {
      version: 'v16.0.0',
      deprecated: false,
    },
    {
      version: 'v18.0.0',
      deprecated: false,
    },
    {
      version: 'v20.0.0',
      deprecated: false,
    },
  ].forEach(({version, deprecated}) => {
    test(`${
      deprecated ? 'logs' : 'does not log'
    } deprecation if Node ${version}`, () => {
      const originalProcess = process;
      Object.defineProperty(process, 'version', {
        value: version,
      });
      expect(process.version).toEqual(version);
      shopify = shopifyApi(testConfig);
      if (deprecated) {
        expect(shopify.config.logger.log).toHaveBeenLastCalledWith(
          LogSeverity.Warning,
          expect.stringContaining('[Deprecated | 8.0.0] Support for'),
        );
      } else {
        expect(shopify.config.logger.log).not.toHaveBeenLastCalledWith(
          LogSeverity.Warning,
          expect.stringContaining('[Deprecated | 8.0.0] Support for'),
        );
      }
      process = originalProcess;
    });
  });
});
