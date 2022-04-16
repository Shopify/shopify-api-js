import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Currency} from '../../2021-10';

describe('Currency resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"currencies": [{"currency": "CAD", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}, {"currency": "EUR", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}, {"currency": "JPY", "rate_updated_at": "2018-01-23T19:01:01-05:00", "enabled": true}]}));

    await Currency.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/currencies.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
