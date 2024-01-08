/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('UsageCharge resource', () => {
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

    queueMockResponse(JSON.stringify({"usage_charge": {"id": 1034618213, "description": "Super Mega Plan 1000 emails", "price": "1.00", "created_at": "2024-01-02T09:31:50-05:00", "currency": "USD", "balance_used": 11.0, "balance_remaining": 89.0, "risk_level": 0}}));

    const usage_charge = new shopify.rest.UsageCharge({session: session});
    usage_charge.recurring_application_charge_id = 455696195;
    usage_charge.description = "Super Mega Plan 1000 emails";
    usage_charge.price = "1.00";
    await usage_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/recurring_application_charges/455696195/usage_charges.json',
      query: '',
      headers,
      data: { "usage_charge": {"description": "Super Mega Plan 1000 emails", "price": "1.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"usage_charges": [{"id": 1034618206, "description": "Super Mega Plan Add-ons", "price": "10.00", "created_at": "2024-01-02T09:31:46-05:00", "currency": "USD", "balance_used": 10.0, "balance_remaining": 90.0, "risk_level": 0}]}));

    await shopify.rest.UsageCharge.all({
      session: session,
      recurring_application_charge_id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/recurring_application_charges/455696195/usage_charges.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"usage_charge": {"id": 1034618211, "description": "Super Mega Plan Add-ons", "price": "10.00", "created_at": "2024-01-02T09:31:49-05:00", "currency": "USD", "balance_used": 10.0, "balance_remaining": 90.0, "risk_level": 0}}));

    await shopify.rest.UsageCharge.find({
      session: session,
      recurring_application_charge_id: 455696195,
      id: 1034618211,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/recurring_application_charges/455696195/usage_charges/1034618211.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
