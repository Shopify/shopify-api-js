/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('Transaction resource', () => {
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
    queueMockResponse(JSON.stringify({"transactions": [{"id": 179259969, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T12:59:12-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2005-08-05T12:59:12-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "209.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/179259969"}, {"id": 389404469, "order_id": 450789469, "kind": "authorization", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-01T11:57:11-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": null, "processed_at": "2005-08-01T11:57:11-04:00", "device_id": null, "error_code": null, "source_name": "web", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {"testcase": true, "authorization": "123456"}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/389404469"}, {"id": 801038806, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T10:22:51-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2005-08-05T10:22:51-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "250.94", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/801038806"}]}));

    await shopify.rest.Transaction.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"transactions": [{"id": 1068278467, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2023-06-14T14:15:35-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2023-06-14T14:15:35-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278467"}]}));

    await shopify.rest.Transaction.all({
      session: session,
      order_id: 450789469,
      since_id: "801038806",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: 'since_id=801038806',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278471, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2023-06-14T14:15:44-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2023-06-14T14:15:44-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278471"}}));

    const transaction = new shopify.rest.Transaction({session: session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "capture";
    transaction.parent_id = 389404469;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "capture", "parent_id": 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278470, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2023-06-14T14:15:42-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2023-06-14T14:15:42-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278470"}}));

    const transaction = new shopify.rest.Transaction({session: session});
    transaction.order_id = 450789469;
    transaction.kind = "capture";
    transaction.authorization = "authorization-key";
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"kind": "capture", "authorization": "authorization-key"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278465, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2023-06-14T14:15:28-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2023-06-14T14:15:28-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278465"}}));

    const transaction = new shopify.rest.Transaction({session: session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "capture";
    transaction.parent_id = 389404469;
    transaction.test = true;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "capture", "parent_id": 389404469, "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278474, "order_id": 450789469, "kind": "void", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2023-06-14T14:15:57-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2023-06-14T14:15:57-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "0.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278474"}}));

    const transaction = new shopify.rest.Transaction({session: session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "void";
    transaction.parent_id = 389404469;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "void", "parent_id": 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Transaction.count({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"transaction": {"id": 389404469, "order_id": 450789469, "kind": "authorization", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-01T11:57:11-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": null, "processed_at": "2005-08-01T11:57:11-04:00", "device_id": null, "error_code": null, "source_name": "web", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null}, "receipt": {"testcase": true, "authorization": "123456"}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "authorization_expires_at": null, "extended_authorization_attributes": {}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/389404469"}}));

    await shopify.rest.Transaction.find({
      session: session,
      order_id: 450789469,
      id: 389404469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/transactions/389404469.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
