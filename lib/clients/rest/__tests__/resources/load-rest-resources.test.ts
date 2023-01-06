import {testConfig} from '../../../../__tests__/test-helper';
import {LogSeverity, ApiVersion, LATEST_API_VERSION} from '../../../../types';
import {shopifyApi} from '../../../..';

import {restResources} from './test-resources';

describe('Load REST resources', () => {
  it('sets up objects with a client', async () => {
    const shopify = shopifyApi({
      ...testConfig,
      restResources,
    });

    expect(shopify.rest).toHaveProperty('FakeResource');
    expect(shopify.rest.FakeResource.CLIENT).toBeDefined();
  });

  it('warns if the API versions mismatch', async () => {
    const shopify = shopifyApi({
      ...testConfig,
      apiVersion: '2020-01' as any as ApiVersion,
      restResources,
    });

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Warning,
      expect.stringContaining(
        `Current API version '2020-01' does not match resource API version '${LATEST_API_VERSION}'`,
      ),
    );

    expect(shopify.rest).toHaveProperty('FakeResource');
    expect(shopify.rest.FakeResource.CLIENT).toBeDefined();
  });
});
