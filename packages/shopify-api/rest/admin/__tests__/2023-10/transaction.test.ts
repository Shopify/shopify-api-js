/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-10';

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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transactions": [{"id": 179259969, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T12:59:12-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2005-08-05T12:59:12-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "209.00", "currency": "USD", "payment_id": "#1001.3", "total_unsettled_set": {"presentment_money": {"amount": "348.0", "currency": "USD"}, "shop_money": {"amount": "348.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/179259969"}, {"id": 389404469, "order_id": 450789469, "kind": "authorization", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-01T11:57:11-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": null, "processed_at": "2005-08-01T11:57:11-04:00", "device_id": null, "error_code": null, "source_name": "web", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {"testcase": true, "authorization": "123456"}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "payment_id": "#1001.1", "total_unsettled_set": {"presentment_money": {"amount": "348.0", "currency": "USD"}, "shop_money": {"amount": "348.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/389404469"}, {"id": 801038806, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T10:22:51-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2005-08-05T10:22:51-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "250.94", "currency": "USD", "payment_id": "#1001.2", "total_unsettled_set": {"presentment_money": {"amount": "348.0", "currency": "USD"}, "shop_money": {"amount": "348.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/801038806"}]}));

    await shopify.rest.Transaction.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transactions": [{"id": 1068278480, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2024-01-02T08:57:53-05:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2024-01-02T08:57:53-05:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "payment_id": "c901414060.1", "total_unsettled_set": {"presentment_money": {"amount": "338.0", "currency": "USD"}, "shop_money": {"amount": "338.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278480"}]}));

    await shopify.rest.Transaction.all({
      session: session,
      order_id: 450789469,
      since_id: "801038806",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: 'since_id=801038806',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278464, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2024-01-02T08:57:34-05:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2024-01-02T08:57:34-05:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "payment_id": "c901414060.1", "total_unsettled_set": {"presentment_money": {"amount": "588.94", "currency": "USD"}, "shop_money": {"amount": "588.94", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278464"}}));

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
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "capture", "parent_id": 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278463, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2024-01-02T08:57:33-05:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2024-01-02T08:57:33-05:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "payment_id": "c901414060.1", "total_unsettled_set": {"presentment_money": {"amount": "0.0", "currency": "USD"}, "shop_money": {"amount": "0.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278463"}}));

    const transaction = new shopify.rest.Transaction({session: session});
    transaction.order_id = 450789469;
    transaction.kind = "capture";
    transaction.authorization = "authorization-key";
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"kind": "capture", "authorization": "authorization-key"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278474, "order_id": 450789469, "kind": "capture", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2024-01-02T08:57:47-05:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2024-01-02T08:57:47-05:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "10.00", "currency": "USD", "payment_id": "c901414060.1", "total_unsettled_set": {"presentment_money": {"amount": "588.94", "currency": "USD"}, "shop_money": {"amount": "588.94", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278474"}}));

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
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "capture", "parent_id": 389404469, "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transaction": {"id": 1068278467, "order_id": 450789469, "kind": "void", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2024-01-02T08:57:37-05:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 389404469, "processed_at": "2024-01-02T08:57:37-05:00", "device_id": null, "error_code": null, "source_name": "755357713", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {}, "currency_exchange_adjustment": null, "amount": "0.00", "currency": "USD", "payment_id": "c901414060.1", "total_unsettled_set": {"presentment_money": {"amount": "0.0", "currency": "USD"}, "shop_money": {"amount": "0.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278467"}}));

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
      path: '/admin/api/2023-10/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {"currency": "USD", "amount": "10.00", "kind": "void", "parent_id": 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Transaction.count({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/orders/450789469/transactions/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"transaction": {"id": 389404469, "order_id": 450789469, "kind": "authorization", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-01T11:57:11-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": null, "processed_at": "2005-08-01T11:57:11-04:00", "device_id": null, "error_code": null, "source_name": "web", "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}, "receipt": {"testcase": true, "authorization": "123456"}, "currency_exchange_adjustment": null, "amount": "598.94", "currency": "USD", "authorization_expires_at": null, "extended_authorization_attributes": {}, "payment_id": "#1001.1", "total_unsettled_set": {"presentment_money": {"amount": "348.0", "currency": "USD"}, "shop_money": {"amount": "348.0", "currency": "USD"}}, "admin_graphql_api_id": "gid://shopify/OrderTransaction/389404469"}}));

    await shopify.rest.Transaction.find({
      session: session,
      order_id: 450789469,
      id: 389404469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/orders/450789469/transactions/389404469.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
