/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {DeprecatedApiCall} from '../../2022-07';

describe('DeprecatedApiCall resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"data_updated_at": "2020-10-13T00:15:30Z", "deprecated_api_calls": [{"api_type": "REST", "description": "The page filter has been removed from multiple endpoints. Use cursor-based pagination instead.", "documentation_url": "https://shopify.dev/api/usage/pagination-rest", "endpoint": "Product", "last_call_at": "2020-06-12T03:46:18Z", "migration_deadline": "2020-07-02T13:00:00Z", "graphql_schema_name": null, "version": "2019-07"}]}));

    await DeprecatedApiCall.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/deprecated_api_calls.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
