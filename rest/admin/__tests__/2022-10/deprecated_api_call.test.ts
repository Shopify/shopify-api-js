/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-10';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.October22,
    restResources,
  });
});

describe('DeprecatedApiCall resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    queueMockResponse(JSON.stringify({"data_updated_at": "2020-10-13T00:15:30Z", "deprecated_api_calls": [{"api_type": "REST", "description": "The page filter has been removed from multiple endpoints. Use cursor-based pagination instead.", "documentation_url": "https://shopify.dev/api/usage/pagination-rest", "endpoint": "Product", "last_call_at": "2020-06-12T03:46:18Z", "migration_deadline": "2020-07-02T13:00:00Z", "graphql_schema_name": null, "version": "2019-07"}]}));

    await shopify.rest.DeprecatedApiCall.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/deprecated_api_calls.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
