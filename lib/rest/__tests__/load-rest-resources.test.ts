import {RestResourceError} from '../../error';
import {testConfig} from '../../__tests__/test-helper';
import {ApiVersion, LATEST_API_VERSION} from '../../base-types';
import {shopifyApi} from '../..';

import {restResources} from './test-resources';

describe('Load REST resources', () => {
  it('throws an error if the API versions mismatch', async () => {
    expect(() =>
      shopifyApi({
        ...testConfig,
        apiVersion: 'wrong version' as any as ApiVersion,
        restResources,
      }),
    ).toThrowError(
      new RestResourceError(
        `Current API version 'wrong version' does not match resource API version '${LATEST_API_VERSION}'`,
      ),
    );
  });

  it('sets up objects with a client', async () => {
    const shopify = shopifyApi({
      ...testConfig,
      restResources,
    });

    expect(shopify.rest).toHaveProperty('FakeResource');
    expect(shopify.rest.FakeResource.CLIENT).toBeDefined();
  });
});
