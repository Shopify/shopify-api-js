/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Currency} from '../../2022-07';

describe('Currency resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"currencies": [{"currency": "CAD", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}, {"currency": "EUR", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}, {"currency": "JPY", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}]}));

    await Currency.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/currencies.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
