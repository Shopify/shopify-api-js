/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-04';

describe('Payment resource', () => {
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
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment": {"id": 1071573807, "unique_token": "client-side-idempotency-token", "payment_processing_error_message": null, "next_action": {"redirect_url": null}, "fraudulent": false, "transaction": null, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "424242", "last_digits": "4242", "brand": "bogus", "expiry_month": 9, "expiry_year": 2025, "customer_id": 207119551}, "checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "fraudulent": false, "transaction": {"amount": "598.94", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": "authorization-key", "created_at": "2005-08-01T11:57:11-04:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 389404469, "kind": "authorization", "message": null, "status": "success", "test": false, "receipt": {"testcase": true, "authorization": "123456"}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "buyer_action_info": null, "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null, "payment_method_name": "visa"}}, "credit_card": null}, {"id": 1071573807, "unique_token": "client-side-idempotency-token", "payment_processing_error_message": null, "fraudulent": false, "transaction": null, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "424242", "last_digits": "4242", "brand": "bogus", "expiry_month": 9, "expiry_year": 2025, "customer_id": 207119551}}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2024-04-02T09:29:09-05:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "a654694372b627dc", "key": "a654694372b627dc", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "d9dfc83829f91759", "key": "d9dfc83829f91759", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "424242", "last_digits": "4242", "brand": "bogus", "expiry_month": 9, "expiry_year": 2025, "customer_id": 207119551}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}}));

    const payment = new shopify.rest.Payment({session: session});
    payment.checkout_id = "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x";
    payment.request_details = {
      "ip_address": "123.1.1.1",
      "accept_language": "en-US,en;q=0.8,fr;q=0.6",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
    };
    payment.amount = "398.00";
    payment.session_id = "global-d1c544a220fe3e0f";
    payment.unique_token = "client-side-idempotency-token";
    await payment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments.json',
      query: '',
      headers,
      data: { "payment": {"request_details": {"ip_address": "123.1.1.1", "accept_language": "en-US,en;q=0.8,fr;q=0.6", "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"}, "amount": "398.00", "session_id": "global-d1c544a220fe3e0f", "unique_token": "client-side-idempotency-token"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "transaction": {"amount": "598.94", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": "authorization-key", "created_at": "2005-08-01T11:57:11-04:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 389404469, "kind": "authorization", "message": null, "status": "success", "test": false}, "credit_card": null, "checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "transaction": {"amount": "598.94", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": "authorization-key", "created_at": "2005-08-01T11:57:11-04:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 389404469, "kind": "authorization", "message": null, "status": "success", "test": false}, "credit_card": null}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "a654694372b627dc", "key": "a654694372b627dc", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "d9dfc83829f91759", "key": "d9dfc83829f91759", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "1", "last_digits": "1", "brand": "bogus", "expiry_month": 8, "expiry_year": 2042, "customer_id": null}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}]}));

    await shopify.rest.Payment.all({
      session: session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment": {"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "next_action": {"redirect_url": null}, "fraudulent": false, "transaction": {"amount": "419.49", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": null, "created_at": "2024-04-02T09:29:10-05:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 1068278521, "kind": "authorization", "message": null, "status": "failure", "test": false, "receipt": {}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": null}, "credit_card": null, "checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "fraudulent": false, "transaction": {"amount": "419.49", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": null, "created_at": "2024-04-02T09:29:10-05:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 1068278521, "kind": "authorization", "message": null, "status": "failure", "test": false, "receipt": {}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": null}, "credit_card": null}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "a654694372b627dc", "key": "a654694372b627dc", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "d9dfc83829f91759", "key": "d9dfc83829f91759", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "1", "last_digits": "1", "brand": "bogus", "expiry_month": 8, "expiry_year": 2042, "customer_id": null}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}}));

    await shopify.rest.Payment.find({
      session: session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
      id: 25428999,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/25428999.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment": {"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "next_action": {"redirect_url": null}, "fraudulent": false, "transaction": {"amount": "419.49", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": null, "created_at": "2024-04-02T09:29:06-05:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 1068278520, "kind": "authorization", "message": null, "status": "success", "test": false, "receipt": {}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": null}, "credit_card": null, "checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "discount_codes": [], "email": "bob.norman@mail.example.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "fraudulent": false, "transaction": {"amount": "419.49", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": null, "created_at": "2024-04-02T09:29:06-05:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 1068278520, "kind": "authorization", "message": null, "status": "success", "test": false, "receipt": {}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": null}, "credit_card": null}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "a654694372b627dc", "key": "a654694372b627dc", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "d9dfc83829f91759", "key": "d9dfc83829f91759", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1704205723", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free%20Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "1", "last_digits": "1", "brand": "bogus", "expiry_month": 8, "expiry_year": 2042, "customer_id": null}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null, "applied_discounts": [], "discount_violations": []}}}));

    await shopify.rest.Payment.find({
      session: session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
      id: 25428999,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/25428999.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Payment.count({
      session: session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
