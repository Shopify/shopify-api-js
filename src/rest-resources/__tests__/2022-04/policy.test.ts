import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Policy} from '../../2022-04';

describe('Policy resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"policies": [{"body": "You have 30 days to get a refund", "created_at": "2022-04-05T13:05:51-04:00", "updated_at": "2022-04-05T13:05:51-04:00", "handle": "refund-policy", "title": "Refund policy", "url": "https://jsmith.myshopify.com/548380009/policies/878590288"}]}));

    await Policy.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/policies.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
