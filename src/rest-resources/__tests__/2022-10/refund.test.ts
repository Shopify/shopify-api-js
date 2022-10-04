/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Refund} from '../../2022-10';

describe('Refund resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refunds": [{"id": 509562969, "order_id": 450789469, "created_at": "2022-10-03T12:44:45-04:00", "note": "it broke during shipping", "user_id": 548380009, "processed_at": "2022-10-03T12:44:45-04:00", "restock": true, "admin_graphql_api_id": "gid://shopify/Refund/509562969", "refund_line_items": [{"id": 104689539, "quantity": 1, "line_item_id": 703073504, "location_id": 487838322, "restock_type": "legacy_restock", "subtotal": 195.67, "total_tax": 3.98, "subtotal_set": {"shop_money": {"amount": "195.67", "currency_code": "USD"}, "presentment_money": {"amount": "195.67", "currency_code": "USD"}}, "total_tax_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}, "line_item": {"id": 703073504, "variant_id": 457924702, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008BLACK", "variant_title": "black", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - black", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/703073504", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}}, {"id": 709875399, "quantity": 1, "line_item_id": 466157049, "location_id": 487838322, "restock_type": "legacy_restock", "subtotal": 195.66, "total_tax": 3.98, "subtotal_set": {"shop_money": {"amount": "195.66", "currency_code": "USD"}, "presentment_money": {"amount": "195.66", "currency_code": "USD"}}, "total_tax_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}, "line_item": {"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}}], "transactions": [{"id": 179259969, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T12:59:12-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2005-08-05T12:59:12-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "209.00", "currency": "USD", "admin_graphql_api_id": "gid://shopify/OrderTransaction/179259969"}], "order_adjustments": []}]}));

    await Refund.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"id": 929361463, "order_id": 450789469, "created_at": "2022-10-03T12:51:57-04:00", "note": null, "user_id": null, "processed_at": "2022-10-03T12:51:57-04:00", "restock": false, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "admin_graphql_api_id": "gid://shopify/Refund/929361463", "refund_line_items": [], "transactions": [{"id": 1068278470, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2022-10-03T12:51:57-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2022-10-03T12:51:57-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "receipt": {}, "currency_exchange_adjustment": null, "amount": "5.00", "currency": "USD", "payment_id": "c901414060.1", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278470"}], "order_adjustments": [{"id": 1030976842, "order_id": 450789469, "refund_id": 929361463, "amount": "-5.00", "tax_amount": "0.00", "kind": "shipping_refund", "reason": "Shipping refund", "amount_set": {"shop_money": {"amount": "-5.00", "currency_code": "USD"}, "presentment_money": {"amount": "-5.00", "currency_code": "USD"}}, "tax_amount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}}]}}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    refund.currency = "USD";
    refund.shipping = {
      "amount": 5.0
    };
    refund.transactions = [
      {
        "parent_id": 801038806,
        "amount": 5.0,
        "kind": "refund",
        "gateway": "bogus"
      }
    ];
    await refund.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: { "refund": {"currency": "USD", "shipping": {"amount": 5.0}, "transactions": [{"parent_id": 801038806, "amount": 5.0, "kind": "refund", "gateway": "bogus"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"id": 929361464, "order_id": 450789469, "created_at": "2022-10-03T12:52:06-04:00", "note": "wrong size", "user_id": null, "processed_at": "2022-10-03T12:52:06-04:00", "restock": false, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "admin_graphql_api_id": "gid://shopify/Refund/929361464", "refund_line_items": [{"location_id": null, "restock_type": "no_restock", "quantity": 1, "id": 1058498308, "line_item_id": 518995019, "subtotal": 195.67, "total_tax": 3.98, "subtotal_set": {"shop_money": {"amount": "195.67", "currency_code": "USD"}, "presentment_money": {"amount": "195.67", "currency_code": "USD"}}, "total_tax_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}, "line_item": {"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}}], "transactions": [{"id": 1068278471, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": "Bogus Gateway: Forced success", "created_at": "2022-10-03T12:52:05-04:00", "test": true, "authorization": null, "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2022-10-03T12:52:05-04:00", "device_id": null, "error_code": null, "source_name": "755357713", "receipt": {}, "currency_exchange_adjustment": null, "amount": "41.94", "currency": "USD", "payment_id": "c901414060.1", "admin_graphql_api_id": "gid://shopify/OrderTransaction/1068278471"}], "order_adjustments": []}}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    refund.currency = "USD";
    refund.notify = true;
    refund.note = "wrong size";
    refund.shipping = {
      "full_refund": true
    };
    refund.refund_line_items = [
      {
        "line_item_id": 518995019,
        "quantity": 1,
        "restock_type": "return",
        "location_id": 487838322
      }
    ];
    refund.transactions = [
      {
        "parent_id": 801038806,
        "amount": 41.94,
        "kind": "refund",
        "gateway": "bogus"
      }
    ];
    await refund.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: { "refund": {"currency": "USD", "notify": true, "note": "wrong size", "shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 518995019, "quantity": 1, "restock_type": "return", "location_id": 487838322}], "transactions": [{"parent_id": 801038806, "amount": 41.94, "kind": "refund", "gateway": "bogus"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"id": 509562969, "order_id": 450789469, "created_at": "2022-10-03T12:44:45-04:00", "note": "it broke during shipping", "user_id": 548380009, "processed_at": "2022-10-03T12:44:45-04:00", "restock": true, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "admin_graphql_api_id": "gid://shopify/Refund/509562969", "refund_line_items": [{"id": 104689539, "quantity": 1, "line_item_id": 703073504, "location_id": 487838322, "restock_type": "legacy_restock", "subtotal": 195.67, "total_tax": 3.98, "subtotal_set": {"shop_money": {"amount": "195.67", "currency_code": "USD"}, "presentment_money": {"amount": "195.67", "currency_code": "USD"}}, "total_tax_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}, "line_item": {"id": 703073504, "variant_id": 457924702, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008BLACK", "variant_title": "black", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - black", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/703073504", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}}, {"id": 709875399, "quantity": 1, "line_item_id": 466157049, "location_id": 487838322, "restock_type": "legacy_restock", "subtotal": 195.66, "total_tax": 3.98, "subtotal_set": {"shop_money": {"amount": "195.66", "currency_code": "USD"}, "presentment_money": {"amount": "195.66", "currency_code": "USD"}}, "total_tax_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}, "line_item": {"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}}], "transactions": [{"id": 179259969, "order_id": 450789469, "kind": "refund", "gateway": "bogus", "status": "success", "message": null, "created_at": "2005-08-05T12:59:12-04:00", "test": false, "authorization": "authorization-key", "location_id": null, "user_id": null, "parent_id": 801038806, "processed_at": "2005-08-05T12:59:12-04:00", "device_id": null, "error_code": null, "source_name": "web", "receipt": {}, "currency_exchange_adjustment": null, "amount": "209.00", "currency": "USD", "payment_id": "c901414060.3", "admin_graphql_api_id": "gid://shopify/OrderTransaction/179259969"}], "order_adjustments": []}}));

    await Refund.find({
      session: test_session,
      order_id: 450789469,
      id: 509562969,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds/509562969.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"shipping": {"amount": "5.00", "tax": "0.00", "maximum_refundable": "5.00"}, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "refund_line_items": [{"quantity": 1, "line_item_id": 518995019, "location_id": null, "restock_type": "no_restock", "price": "199.00", "subtotal": "195.67", "total_tax": "3.98", "discounted_price": "199.00", "discounted_total_price": "199.00", "total_cart_discount_amount": "3.33"}], "transactions": [{"order_id": 450789469, "kind": "suggested_refund", "gateway": "bogus", "parent_id": 801038806, "amount": "41.94", "currency": "USD", "maximum_refundable": "41.94"}], "currency": "USD"}}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {"refund": {"currency": "USD", "shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 518995019, "quantity": 1, "restock_type": "no_restock"}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {"currency": "USD", "shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 518995019, "quantity": 1, "restock_type": "no_restock"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"shipping": {"amount": "5.00", "tax": "0.00", "maximum_refundable": "5.00"}, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "refund_line_items": [{"quantity": 1, "line_item_id": 518995019, "location_id": null, "restock_type": "no_restock", "price": "199.00", "subtotal": "195.67", "total_tax": "3.98", "discounted_price": "199.00", "discounted_total_price": "199.00", "total_cart_discount_amount": "3.33"}], "transactions": [{"order_id": 450789469, "kind": "suggested_refund", "gateway": "bogus", "parent_id": 801038806, "amount": "41.94", "currency": "USD", "maximum_refundable": "41.94"}], "currency": "USD"}}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {"refund": {"shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 518995019, "quantity": 1, "restock_type": "no_restock"}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {"shipping": {"full_refund": true}, "refund_line_items": [{"line_item_id": 518995019, "quantity": 1, "restock_type": "no_restock"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"refund": {"shipping": {"amount": "2.00", "tax": "0.00", "maximum_refundable": "5.00"}, "duties": [], "total_duties_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "additional_fees": [], "total_additional_fees_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "refund_line_items": [], "transactions": [{"order_id": 450789469, "kind": "suggested_refund", "gateway": "bogus", "parent_id": 801038806, "amount": "2.00", "currency": "USD", "maximum_refundable": "41.94"}], "currency": "USD"}}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {"refund": {"currency": "USD", "shipping": {"amount": 2.0}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {"currency": "USD", "shipping": {"amount": 2.0}} }
    }).toMatchMadeHttpRequest();
  });

});
