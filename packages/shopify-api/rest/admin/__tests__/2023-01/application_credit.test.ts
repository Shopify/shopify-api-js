/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

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
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636129, "amount": "5.00", "description": "application credit for refund", "test": null, "currency": "USD"}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = "5.00";
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": "5.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636126, "amount": "5.00", "description": "application credit for refund", "test": true, "currency": "USD"}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = "5.00";
    application_credit.test = true;
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": "5.00", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credits": [{"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}]}));

    await shopify.rest.ApplicationCredit.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/application_credits.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_credit": {"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}}));

    await shopify.rest.ApplicationCredit.find({
      session: session,
      id: 140583599,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/application_credits/140583599.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
