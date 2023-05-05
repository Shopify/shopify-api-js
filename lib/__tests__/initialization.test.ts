import {LogSeverity} from '../types';
import {shopifyApi, Shopify} from '..';
import {abstractRuntimeString} from '../../runtime/platform';

import {testConfig} from './test-helper';

let shopify: Shopify;
let testRuntimeString = '';

jest.mock('../../runtime/platform', () => ({
  abstractRuntimeString: jest.fn(() => testRuntimeString),
}));

describe('shopifyApi', () => {
  afterAll(() => {
    jest.resetModules();
  });

  [
    {
      version: 'Mock Adapter',
      deprecated: false,
    },
    {
      version: 'Cloudflare Worker',
      deprecated: false,
    },
    {
      version: 'Node v14.0.0',
      deprecated: true,
    },
    {
      version: 'Node v16.0.0',
      deprecated: false,
    },
    {
      version: 'Node v18.0.0',
      deprecated: false,
    },
    {
      version: 'Node v20.0.0',
      deprecated: false,
    },
  ].forEach(({version, deprecated}) => {
    test(`${
      deprecated ? 'logs' : 'does not log'
    } deprecation if ${version}`, () => {
      testRuntimeString = version;
      shopify = shopifyApi(testConfig);
      expect(abstractRuntimeString()).toStrictEqual(version);
      const localExpect = deprecated
        ? expect(shopify.config.logger.log)
        : expect(shopify.config.logger.log).not;
      localExpect.toHaveBeenLastCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('[Deprecated | 8.0.0] Support for'),
      );
    });
  });
});
