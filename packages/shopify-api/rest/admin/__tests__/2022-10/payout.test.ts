/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('Payout resource', () => {
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

    queueMockResponse(JSON.stringify({"payouts": [{"id": 854088011, "status": "scheduled", "date": "2013-11-01", "currency": "USD", "amount": "43.12", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "45.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 512467833, "status": "failed", "date": "2013-11-01", "currency": "USD", "amount": "43.12", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "45.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 39438702, "status": "in_transit", "date": "2013-11-01", "currency": "USD", "amount": "43.12", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "45.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 710174591, "status": "paid", "date": "2012-12-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 974708905, "status": "paid", "date": "2012-11-13", "currency": "CAD", "amount": "51.69", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "6.46", "charges_gross_amount": "58.15", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 917000993, "status": "failed", "date": "2012-11-13", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 867808544, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 725076685, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 714327683, "status": "failed", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 631321250, "status": "scheduled", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 623721858, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}]}));

    await shopify.rest.Payout.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/shopify_payments/payouts.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payouts": [{"id": 867808544, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 725076685, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 714327683, "status": "failed", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 631321250, "status": "scheduled", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}, {"id": 623721858, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}]}));

    await shopify.rest.Payout.all({
      session: session,
      date_max: "2012-11-12",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/shopify_payments/payouts.json',
      query: 'date_max=2012-11-12',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payout": {"id": 623721858, "status": "paid", "date": "2012-11-12", "currency": "USD", "amount": "41.90", "summary": {"adjustments_fee_amount": "0.12", "adjustments_gross_amount": "2.13", "charges_fee_amount": "1.32", "charges_gross_amount": "44.52", "refunds_fee_amount": "-0.23", "refunds_gross_amount": "-3.54", "reserved_funds_fee_amount": "0.00", "reserved_funds_gross_amount": "0.00", "retried_payouts_fee_amount": "0.00", "retried_payouts_gross_amount": "0.00"}}}));

    await shopify.rest.Payout.find({
      session: session,
      id: 623721858,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/shopify_payments/payouts/623721858.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
