import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Shop} from '../../2022-01';

describe('Shop resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Shop.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shop.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Shop.all({
      session: test_session,
      fields: "address1,address2,city,province,country",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shop.json',
      query: 'fields=address1%2Caddress2%2Ccity%2Cprovince%2Ccountry',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
