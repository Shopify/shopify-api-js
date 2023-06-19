/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AccessScope} from '../../2022-10';

describe('AccessScope resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"access_scopes": [{"handle": "read_products"}, {"handle": "write_orders"}, {"handle": "read_orders"}]}));

    await AccessScope.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/oauth/access_scopes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
