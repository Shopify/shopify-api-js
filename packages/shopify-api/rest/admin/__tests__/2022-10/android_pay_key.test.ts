/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('AndroidPayKey resource', () => {
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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"android_pay_key": {"id": 964811894, "public_key": "BPI5no5liIrAC3knvJnxSoMW09D0KwbJOnv+TaAmd3Fur3wYlD85yFaJABZC\n1qb/14GtM+616y8SrKwaVOSu4U8=\n"}}));

    const android_pay_key = new shopify.rest.AndroidPayKey({session: session});

    await android_pay_key.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/android_pay_keys.json',
      query: '',
      headers,
      data: { "android_pay_key": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"android_pay_key": {"id": 964811895, "public_key": "BPI5no5liIrAC3knvJnxSoMW09D0KwbJOnv+TaAmd3Fur3wYlD85yFaJABZC\n1qb/14GtM+616y8SrKwaVOSu4U8=\n"}}));

    await shopify.rest.AndroidPayKey.find({
      session: session,
      id: 964811895,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/android_pay_keys/964811895.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.AndroidPayKey.delete({
      session: session,
      id: 964811896,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/android_pay_keys/964811896.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
