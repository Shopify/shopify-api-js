/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('Checkout resource', () => {
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

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2023-10-03T13:31:52-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": null, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": null, "legal_notice_url": null, "location_id": null, "name": "#1066348318", "note": "", "note_attributes": {}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "995.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "755357713", "source_url": null, "subscription_policy_url": null, "subtotal_price": "995.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "ba1a107c79ea98355654504e67ef4a7d", "total_price": "995.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "995.00", "updated_at": "2023-10-03T13:31:52-04:00", "user_id": null, "web_url": "https://jsmith.myshopify.com/548380009/checkouts/ba1a107c79ea98355654504e67ef4a7d", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "4a2a9a7bfdb13b5a08436352da0bd6f1", "key": "4a2a9a7bfdb13b5a08436352da0bd6f1", "product_id": 632910392, "variant_id": 39072856, "sku": "IPOD2008GREEN", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Green", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "995.00", "properties": {}, "quantity": 5, "grams": 567, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": null, "credit_card": null, "billing_address": null, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    const checkout = new shopify.rest.Checkout({session: session});
    checkout.line_items = [
      {
        "variant_id": 39072856,
        "quantity": 5
      }
    ];
    await checkout.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {"line_items": [{"variant_id": 39072856, "quantity": 5}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2023-10-03T13:31:51-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 1073339462, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "me@example.com", "legal_notice_url": null, "location_id": null, "name": "#1066348317", "note": "", "note_attributes": {}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "0.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": false, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "755357713", "source_url": null, "subscription_policy_url": null, "subtotal_price": "0.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "aad2e6187870b12fdcc4c2edf368234d", "total_price": "0.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "0.00", "updated_at": "2023-10-03T13:31:51-04:00", "user_id": null, "web_url": "https://jsmith.myshopify.com/548380009/checkouts/aad2e6187870b12fdcc4c2edf368234d", "total_duties": null, "total_additional_fees": null, "line_items": [], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": null, "credit_card": null, "billing_address": null, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    const checkout = new shopify.rest.Checkout({session: session});
    checkout.email = "me@example.com";
    await checkout.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {"email": "me@example.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#86568385", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "0.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": false, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "0.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "b490a9220cd14d7344024f4874f640a6", "total_price": "0.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "0.00", "updated_at": "2023-10-03T13:31:45-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/b490a9220cd14d7344024f4874f640a6", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": 49148385, "key": 49148385, "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": false, "gift_card": false, "price": "0.00", "compare_at_price": null, "line_price": "0.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    const checkout = new shopify.rest.Checkout({session: session});
    checkout.token = "b490a9220cd14d7344024f4874f640a6";
    await checkout.complete({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/checkouts/b490a9220cd14d7344024f4874f640a6/complete.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": "2005-07-31T11:57:11-04:00", "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#901414060", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": 450789469, "order_status_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c/thank_you", "order": {"id": 450789469, "name": "#1001", "status_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c/thank_you"}, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "bd5a8aa1ecd019dd3520ff791ee3a24c", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "c72185ef93b358d7", "key": "c72185ef93b358d7", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "486e6da9be618c40", "key": "486e6da9be618c40", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    await shopify.rest.Checkout.find({
      session: session,
      token: "bd5a8aa1ecd019dd3520ff791ee3a24c",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "fraudulent": false, "transaction": {"amount": "598.94", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": "authorization-key", "created_at": "2005-08-01T11:57:11-04:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 389404469, "kind": "authorization", "message": null, "status": "success", "test": false, "receipt": {"testcase": true, "authorization": "123456"}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}}, "credit_card": null}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "c72185ef93b358d7", "key": "c72185ef93b358d7", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "486e6da9be618c40", "key": "486e6da9be618c40", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "1", "last_digits": "1", "brand": "bogus", "expiry_month": 8, "expiry_year": 2042, "customer_id": null}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    await shopify.rest.Checkout.find({
      session: session,
      token: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "c72185ef93b358d7", "key": "c72185ef93b358d7", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "486e6da9be618c40", "key": "486e6da9be618c40", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    await shopify.rest.Checkout.find({
      session: session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2023-10-03T13:31:49-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "c72185ef93b358d7", "key": "c72185ef93b358d7", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "486e6da9be618c40", "key": "486e6da9be618c40", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    const checkout = new shopify.rest.Checkout({session: session});
    checkout.token = "exuw7apwoycchjuwtiqg8nytfhphr62a";
    checkout.shipping_line = {
      "handle": "shopify-Free%20Shipping-0.00"
    };
    await checkout.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {"shipping_line": {"handle": "shopify-Free%20Shipping-0.00"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 1073339461, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "john.smith@example.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2023-10-03T13:31:46-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a?key=10b798bfc6f5d2b1ecf754ce61dab41d", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "c72185ef93b358d7", "key": "c72185ef93b358d7", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "486e6da9be618c40", "key": "486e6da9be618c40", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1696353592", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": {"id": 550558813, "first_name": "John", "last_name": "Smith", "phone": "(123)456-7890", "company": null, "address1": "126 York St.", "address2": "", "city": "Los Angeles", "province": "California", "province_code": "CA", "country": "United States", "country_code": "US", "zip": "90002"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}));

    const checkout = new shopify.rest.Checkout({session: session});
    checkout.token = "exuw7apwoycchjuwtiqg8nytfhphr62a";
    checkout.email = "john.smith@example.com";
    checkout.shipping_address = {
      "first_name": "John",
      "last_name": "Smith",
      "address1": "126 York St.",
      "city": "Los Angeles",
      "province_code": "CA",
      "country_code": "US",
      "phone": "(123)456-7890",
      "zip": "90002"
    };
    await checkout.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {"email": "john.smith@example.com", "shipping_address": {"first_name": "John", "last_name": "Smith", "address1": "126 York St.", "city": "Los Angeles", "province_code": "CA", "country_code": "US", "phone": "(123)456-7890", "zip": "90002"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"shipping_rates": [{"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "checkout": {"total_tax": "0.00", "total_price": "398.00", "subtotal_price": "398.00"}, "phone_required": false, "delivery_range": null, "estimated_time_in_transit": null, "handle": "shopify-Free%20Shipping-0.00"}]}));

    await shopify.rest.Checkout.shipping_rates({
      session: session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"shipping_rates": []}));

    await shopify.rest.Checkout.shipping_rates({
      session: session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"shipping_rates": []}));

    await shopify.rest.Checkout.shipping_rates({
      session: session,
      token: "zs9ru89kuqcdagk8bz4r9hnxt22wwd42",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/checkouts/zs9ru89kuqcdagk8bz4r9hnxt22wwd42/shipping_rates.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
