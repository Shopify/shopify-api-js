import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AndroidPayKey} from '../../2021-04';

describe('AndroidPayKey resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const android_pay_key = new AndroidPayKey({session: test_session});

    await android_pay_key.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/android_pay_keys.json',
      query: '',
      headers,
      data: { "android_pay_key": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AndroidPayKey.find({
      session: test_session,
      id: 964811897,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/android_pay_keys/964811897.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AndroidPayKey.delete({
      session: test_session,
      id: 964811898,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-04/android_pay_keys/964811898.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
