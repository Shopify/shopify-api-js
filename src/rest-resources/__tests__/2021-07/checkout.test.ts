import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Checkout} from '../../2021-07';

describe('Checkout resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2022-02-03T16:33:29-05:00", "currency": "USD", "presentment_currency": "USD", "customer_id": null, "customer_locale": "en", "device_id": null, "discount_code": null, "email": null, "legal_notice_url": null, "location_id": null, "name": "#1066348321", "note": "", "note_attributes": {}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "995.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "755357713", "source_url": null, "subscription_policy_url": null, "subtotal_price": "995.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "c8e35a27d2a57085eade1a872d390a42", "total_price": "995.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "995.00", "updated_at": "2022-02-03T16:33:29-05:00", "user_id": null, "web_url": "https://jsmith.myshopify.com/548380009/checkouts/c8e35a27d2a57085eade1a872d390a42", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "38f11b78efa742eaee59a3ec1badb601", "key": "38f11b78efa742eaee59a3ec1badb601", "product_id": 632910392, "variant_id": 39072856, "sku": "IPOD2008GREEN", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Green", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "995.00", "properties": {}, "quantity": 5, "grams": 567, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": null, "credit_card": null, "billing_address": null, "applied_discount": null}}));

    const checkout = new Checkout({session: test_session});
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
      path: '/admin/api/2021-07/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {"line_items": [{"variant_id": 39072856, "quantity": 5}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2022-02-03T16:33:36-05:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 1073339479, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "me@example.com", "legal_notice_url": null, "location_id": null, "name": "#1066348322", "note": "", "note_attributes": {}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "0.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": false, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "755357713", "source_url": null, "subscription_policy_url": null, "subtotal_price": "0.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "c5cd06efe760743ea5ee37d80b8eb619", "total_price": "0.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "0.00", "updated_at": "2022-02-03T16:33:36-05:00", "user_id": null, "web_url": "https://jsmith.myshopify.com/548380009/checkouts/c5cd06efe760743ea5ee37d80b8eb619", "total_duties": null, "total_additional_fees": null, "line_items": [], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": null, "credit_card": null, "billing_address": null, "applied_discount": null}}));

    const checkout = new Checkout({session: test_session});
    checkout.email = "me@example.com";
    await checkout.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {"email": "me@example.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "bob.norman@hostmail.com", "legal_notice_url": null, "location_id": null, "name": "#86568385", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "0.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": false, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "0.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "b490a9220cd14d7344024f4874f640a6", "total_price": "0.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "0.00", "updated_at": "2022-02-03T16:33:41-05:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/b490a9220cd14d7344024f4874f640a6", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": 49148385, "key": 49148385, "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": false, "gift_card": false, "price": "0.00", "compare_at_price": null, "line_price": "0.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    const checkout = new Checkout({session: test_session});
    checkout.token = "b490a9220cd14d7344024f4874f640a6";
    await checkout.complete({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/checkouts/b490a9220cd14d7344024f4874f640a6/complete.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": "2005-07-31T11:57:11-04:00", "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "bob.norman@hostmail.com", "legal_notice_url": null, "location_id": null, "name": "#901414060", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": 450789469, "order_status_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c/thank_you", "order": {"id": 450789469, "name": "#1001", "status_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c/thank_you"}, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "bd5a8aa1ecd019dd3520ff791ee3a24c", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "b721507a3fc9adfd", "key": "b721507a3fc9adfd", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "2d7609685ff60030", "key": "2d7609685ff60030", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    await Checkout.find({
      session: test_session,
      token: "bd5a8aa1ecd019dd3520ff791ee3a24c",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "bob.norman@hostmail.com", "legal_notice_url": null, "location_id": null, "name": "#446514532", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [{"id": 25428999, "unique_token": "e01e661f4a99acd9dcdg6f1422d0d6f7", "payment_processing_error_message": null, "fraudulent": false, "transaction": {"amount": "598.94", "amount_in": null, "amount_out": null, "amount_rounding": null, "authorization": "authorization-key", "created_at": "2005-08-01T11:57:11-04:00", "currency": "USD", "error_code": null, "parent_id": null, "gateway": "bogus", "id": 389404469, "kind": "authorization", "message": null, "status": "success", "test": false, "receipt": {"testcase": true, "authorization": "123456"}, "location_id": null, "user_id": null, "transaction_group_id": null, "device_id": null, "payment_details": {"credit_card_bin": null, "avs_result_code": null, "cvv_result_code": null, "credit_card_number": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4242", "credit_card_company": "Visa", "credit_card_name": null, "credit_card_wallet": null, "credit_card_expiration_month": null, "credit_card_expiration_year": null}}, "credit_card": null}], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "b721507a3fc9adfd", "key": "b721507a3fc9adfd", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "2d7609685ff60030", "key": "2d7609685ff60030", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": {"first_name": "Bob", "last_name": "Norman", "first_digits": "1", "last_digits": "1", "brand": "bogus", "expiry_month": 8, "expiry_year": 2042, "customer_id": null}, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    await Checkout.find({
      session: test_session,
      token: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "bob.norman@hostmail.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "419.49", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "419.49", "total_tax": "21.49", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2012-10-12T07:05:27-04:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "b721507a3fc9adfd", "key": "b721507a3fc9adfd", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "2d7609685ff60030", "key": "2d7609685ff60030", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [{"price": "21.49", "rate": 0.06, "title": "State Tax", "compare_at": 0.06}], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    await Checkout.find({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 1073339478, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "john.smith@example.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2022-02-03T16:33:10-05:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "b721507a3fc9adfd", "key": "b721507a3fc9adfd", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "2d7609685ff60030", "key": "2d7609685ff60030", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": null, "shipping_rate": null, "shipping_address": {"id": 550558813, "first_name": "John", "last_name": "Smith", "phone": "(123)456-7890", "company": null, "address1": "126 York St.", "address2": "", "city": "Los Angeles", "province": "California", "province_code": "CA", "country": "United States", "country_code": "US", "zip": "90002"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    const checkout = new Checkout({session: test_session});
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
      path: '/admin/api/2021-07/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {"token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "email": "john.smith@example.com", "shipping_address": {"first_name": "John", "last_name": "Smith", "address1": "126 York St.", "city": "Los Angeles", "province_code": "CA", "country_code": "US", "phone": "(123)456-7890", "zip": "90002"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"checkout": {"completed_at": null, "created_at": "2012-10-12T07:05:27-04:00", "currency": "USD", "presentment_currency": "USD", "customer_id": 207119551, "customer_locale": "en", "device_id": null, "discount_code": null, "email": "bob.norman@hostmail.com", "legal_notice_url": null, "location_id": null, "name": "#862052962", "note": "", "note_attributes": {"custom engraving": "Happy Birthday", "colour": "green"}, "order_id": null, "order_status_url": null, "order": null, "payment_due": "398.00", "payment_url": "https://app.local/cardserver/sessions", "payments": [], "phone": null, "shopify_payments_account_id": null, "privacy_policy_url": null, "refund_policy_url": null, "requires_shipping": true, "reservation_time_left": 0, "reservation_time": null, "source_identifier": null, "source_name": "web", "source_url": null, "subscription_policy_url": null, "subtotal_price": "398.00", "shipping_policy_url": null, "tax_exempt": false, "taxes_included": false, "terms_of_sale_url": null, "terms_of_service_url": null, "token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "total_price": "398.00", "total_tax": "0.00", "total_tip_received": "0.00", "total_line_items_price": "398.00", "updated_at": "2022-02-03T16:33:14-05:00", "user_id": null, "web_url": "https://checkout.local/548380009/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a", "total_duties": null, "total_additional_fees": null, "line_items": [{"id": "b721507a3fc9adfd", "key": "b721507a3fc9adfd", "product_id": 632910392, "variant_id": 49148385, "sku": "IPOD2008RED", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Red", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}, {"id": "2d7609685ff60030", "key": "2d7609685ff60030", "product_id": 632910392, "variant_id": 808950810, "sku": "IPOD2008PINK", "vendor": "Apple", "title": "IPod Nano - 8GB", "variant_title": "Pink", "image_url": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1643923962", "taxable": true, "requires_shipping": true, "gift_card": false, "price": "199.00", "compare_at_price": null, "line_price": "199.00", "properties": {}, "quantity": 1, "grams": 200, "fulfillment_service": "manual", "applied_discounts": [], "discount_allocations": [], "tax_lines": []}], "gift_cards": [], "tax_lines": [], "tax_manipulations": [], "shipping_line": {"handle": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping", "tax_lines": []}, "shipping_rate": {"id": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping"}, "shipping_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "credit_card": null, "billing_address": {"id": 550558813, "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "province_code": "KY", "country": "United States", "country_code": "US", "zip": "40202"}, "applied_discount": null}}));

    const checkout = new Checkout({session: test_session});
    checkout.token = "exuw7apwoycchjuwtiqg8nytfhphr62a";
    checkout.shipping_line = {
      "handle": "shopify-Free Shipping-0.00"
    };
    await checkout.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {"token": "exuw7apwoycchjuwtiqg8nytfhphr62a", "shipping_line": {"handle": "shopify-Free Shipping-0.00"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"shipping_rates": []}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"shipping_rates": [{"id": "shopify-Free Shipping-0.00", "price": "0.00", "title": "Free Shipping", "checkout": {"total_tax": "0.00", "total_price": "398.00", "subtotal_price": "398.00"}, "phone_required": false, "delivery_range": null, "estimated_time_in_transit": null, "handle": "shopify-Free Shipping-0.00"}]}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"shipping_rates": []}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "zs9ru89kuqcdagk8bz4r9hnxt22wwd42",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/zs9ru89kuqcdagk8bz4r9hnxt22wwd42/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
