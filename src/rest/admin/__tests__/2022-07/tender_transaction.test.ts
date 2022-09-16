/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../session/session';
import {testConfig, queueMockResponse} from '../../../../__tests__/test-helper';
import {ApiVersion, Shopify} from '../../../../base-types';
import {shopifyApi} from '../../../..';

import {restResources} from '../../2022-07';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.July22,
    restResources,
  });
});

describe('TenderTransaction resource', () => {
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
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222856, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}, {"id": 1011222855, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222858, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
      since_id: "1011222857",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: 'since_id=1011222857',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222860, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
      processed_at_min: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: 'processed_at_min=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222861, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
      processed_at_max: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: 'processed_at_max=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222863, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
      processed_at_max: "2005-08-05 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: 'processed_at_max=2005-08-05+10%3A22%3A51+-0400',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"tender_transactions": [{"id": 1011222865, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}, {"id": 1011222866, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await shopify.rest.TenderTransaction.all({
      session: session,
      order: "processed_at ASC",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/tender_transactions.json',
      query: 'order=processed_at+ASC',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
