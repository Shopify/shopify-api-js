/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April23,
    restResources,
  });
});

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
    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636128, "amount": "5.00", "description": "application credit for refund", "test": null, "currency": "USD"}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = "5.00";
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": "5.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636127, "amount": "5.00", "description": "application credit for refund", "test": true, "currency": "USD"}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = "5.00";
    application_credit.test = true;
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": "5.00", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"application_credits": [{"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}]}));

    await shopify.rest.ApplicationCredit.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/application_credits.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"application_credit": {"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null, "currency": "USD"}}));

    await shopify.rest.ApplicationCredit.find({
      session: session,
      id: 140583599,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/application_credits/140583599.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
