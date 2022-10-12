/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion, Shopify} from '../../../../lib/base-types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-07';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.July22,
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
    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636125, "amount": "5.00", "description": "application credit for refund", "test": true}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = 5.0;
    application_credit.test = true;
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": 5.0, "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"application_credit": {"id": 1031636127, "amount": "5.00", "description": "application credit for refund", "test": null}}));

    const application_credit = new shopify.rest.ApplicationCredit({session: session});
    application_credit.description = "application credit for refund";
    application_credit.amount = 5.0;
    await application_credit.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/application_credits.json',
      query: '',
      headers,
      data: { "application_credit": {"description": "application credit for refund", "amount": 5.0} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"application_credits": [{"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null}]}));

    await shopify.rest.ApplicationCredit.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/application_credits.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"application_credit": {"id": 140583599, "amount": "5.00", "description": "credit for application refund", "test": null}}));

    await shopify.rest.ApplicationCredit.find({
      session: session,
      id: 140583599,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/application_credits/140583599.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
