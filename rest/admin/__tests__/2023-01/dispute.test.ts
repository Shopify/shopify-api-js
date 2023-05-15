/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-01';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.January23,
    restResources,
  });
});

describe('Dispute resource', () => {
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
    queueMockResponse(JSON.stringify({"disputes": []}));

    await shopify.rest.Dispute.all({
      session: session,
      initiated_at: "2013-05-03",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/shopify_payments/disputes.json',
      query: 'initiated_at=2013-05-03',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"disputes": [{"id": 1052608616, "order_id": null, "type": "chargeback", "amount": "100.00", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "won", "evidence_due_by": "2013-07-03T19:00:00-04:00", "evidence_sent_on": "2013-07-04T07:00:00-04:00", "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 815713555, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "credit_not_processed", "network_reason_code": "4827", "status": "needs_response", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": null, "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 782360659, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "won", "evidence_due_by": "2013-07-03T19:00:00-04:00", "evidence_sent_on": "2013-07-04T07:00:00-04:00", "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 670893524, "order_id": 625362839, "type": "inquiry", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "needs_response", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": null, "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 598735659, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "needs_response", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": null, "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 85190714, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "under_review", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": "2023-05-08T20:00:00-04:00", "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 35982383, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "subscription_canceled", "network_reason_code": "4827", "status": "needs_response", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": null, "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}]}));

    await shopify.rest.Dispute.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/shopify_payments/disputes.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"disputes": [{"id": 1052608616, "order_id": null, "type": "chargeback", "amount": "100.00", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "won", "evidence_due_by": "2013-07-03T19:00:00-04:00", "evidence_sent_on": "2013-07-04T07:00:00-04:00", "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}, {"id": 782360659, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "won", "evidence_due_by": "2013-07-03T19:00:00-04:00", "evidence_sent_on": "2013-07-04T07:00:00-04:00", "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}]}));

    await shopify.rest.Dispute.all({
      session: session,
      status: "won",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/shopify_payments/disputes.json',
      query: 'status=won',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"dispute": {"id": 598735659, "order_id": 625362839, "type": "chargeback", "amount": "11.50", "currency": "USD", "reason": "fraudulent", "network_reason_code": "4827", "status": "needs_response", "evidence_due_by": "2023-05-21T20:00:00-04:00", "evidence_sent_on": null, "finalized_on": null, "initiated_at": "2013-05-03T20:00:00-04:00"}}));

    await shopify.rest.Dispute.find({
      session: session,
      id: 598735659,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/shopify_payments/disputes/598735659.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
