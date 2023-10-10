/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-10';

describe('ApplicationCredit resource', () => {
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
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credit": {"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}}));

    await shopify.rest.ApplicationCredit.find({
      session: session,
      id: 140583599,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/application_credits/140583599.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credits": [{"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}]}));

    await shopify.rest.ApplicationCredit.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/application_credits.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
