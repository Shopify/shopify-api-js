/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AndroidPayKey} from '../../2022-07';

describe('AndroidPayKey resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"android_pay_key": {"id": 964811894, "public_key": "BPI5no5liIrAC3knvJnxSoMW09D0KwbJOnv+TaAmd3Fur3wYlD85yFaJABZC\n1qb/14GtM+616y8SrKwaVOSu4U8=\n"}}));

    const android_pay_key = new AndroidPayKey({session: test_session});

    await android_pay_key.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/android_pay_keys.json',
      query: '',
      headers,
      data: { "android_pay_key": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"android_pay_key": {"id": 964811895, "public_key": "BPI5no5liIrAC3knvJnxSoMW09D0KwbJOnv+TaAmd3Fur3wYlD85yFaJABZC\n1qb/14GtM+616y8SrKwaVOSu4U8=\n"}}));

    await AndroidPayKey.find({
      session: test_session,
      id: 964811895,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/android_pay_keys/964811895.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AndroidPayKey.delete({
      session: test_session,
      id: 964811896,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-07/android_pay_keys/964811896.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
