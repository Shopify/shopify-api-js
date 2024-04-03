/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-04';

describe('FulfillmentOrder resource', () => {
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

    queueMockResponse(JSON.stringify({"fulfillment_orders": [{"id": 1046000823, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000807, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737564, "shop_id": 548380009, "fulfillment_order_id": 1046000823, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:25-05:00", "updated_at": "2024-04-02T09:11:25-05:00", "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await shopify.rest.FulfillmentOrder.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/orders/450789469/fulfillment_orders.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_orders": [{"id": 1046000836, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000820, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737576, "shop_id": 548380009, "fulfillment_order_id": 1046000836, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385, "financial_summaries": [{"quantity": 1, "original_unit_price_set": "199.00", "approximate_discounted_unit_price_set": "199.00", "discount_allocations": [{"amount": "3.33", "discount_application": {"allocation_method": "across", "target_selection": "all", "target_type": "line_item"}}]}]}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:42-05:00", "updated_at": "2024-04-02T09:11:42-05:00", "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await shopify.rest.FulfillmentOrder.all({
      session: session,
      order_id: 450789469,
      include_financial_summaries: "true",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/orders/450789469/fulfillment_orders.json',
      query: 'include_financial_summaries=true',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_orders": [{"id": 1046000826, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000810, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737566, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:28-05:00", "updated_at": "2024-04-02T09:11:28-05:00", "order_name": "#1001", "order_processed_at": "2008-01-10T11:00:00-05:00", "channel_id": null, "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await shopify.rest.FulfillmentOrder.all({
      session: session,
      order_id: 450789469,
      include_order_reference_fields: "true",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/orders/450789469/fulfillment_orders.json',
      query: 'include_order_reference_fields=true',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000819, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000803, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737560, "shop_id": 548380009, "fulfillment_order_id": 1046000819, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:20-05:00", "updated_at": "2024-04-02T09:11:20-05:00", "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await shopify.rest.FulfillmentOrder.find({
      session: session,
      id: 1046000819,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000819.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000837, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000821, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737577, "shop_id": 548380009, "fulfillment_order_id": 1046000837, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385, "financial_summaries": [{"quantity": 1, "original_unit_price_set": "199.00", "approximate_discounted_unit_price_set": "199.00", "discount_allocations": [{"amount": "3.33", "discount_application": {"allocation_method": "across", "target_selection": "all", "target_type": "line_item"}}]}]}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:43-05:00", "updated_at": "2024-04-02T09:11:43-05:00", "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await shopify.rest.FulfillmentOrder.find({
      session: session,
      id: 1046000837,
      include_financial_summaries: "true",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000837.json',
      query: 'include_financial_summaries=true',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000828, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000812, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737568, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfill_at": null, "fulfill_by": null, "fulfillment_holds": [], "created_at": "2024-04-02T09:11:32-05:00", "updated_at": "2024-04-02T09:11:32-05:00", "order_name": "#1001", "order_processed_at": "2008-01-10T11:00:00-05:00", "channel_id": null, "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await shopify.rest.FulfillmentOrder.find({
      session: session,
      id: 1046000828,
      include_order_reference_fields: "true",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000828.json',
      query: 'include_order_reference_fields=true',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000824, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000808, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [], "international_duties": null, "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "replacement_fulfillment_order": {"id": 1046000825, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment"], "destination": {"id": 1046000809, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737565, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000824;
    await fulfillment_order.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000824/cancel.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000818, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "closed", "status": "incomplete", "supported_actions": ["request_fulfillment"], "destination": {"id": 1046000802, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737559, "shop_id": 548380009, "fulfillment_order_id": 1046000818, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000818;
    await fulfillment_order.close({
      body: {"fulfillment_order": {"message": "Not enough inventory to complete this work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000818/close.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"message": "Not enough inventory to complete this work."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"original_fulfillment_order": {"id": 1046000834, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 487838322, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000818, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [], "international_duties": null, "fulfillment_service_handle": "manual", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "moved_fulfillment_order": {"id": 1046000835, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 655441491, "request_status": "unsubmitted", "status": "open", "supported_actions": ["create_fulfillment", "move"], "destination": {"id": 1046000819, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737575, "shop_id": 548380009, "fulfillment_order_id": 1046000835, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfillment_service_handle": "manual", "assigned_location": {"address1": "50 Rideau Street", "address2": null, "city": "Ottawa", "country_code": "CA", "location_id": 655441491, "name": "50 Rideau Street", "phone": null, "province": "Ontario", "zip": "K1N 9J7"}, "merchant_requests": []}, "remaining_fulfillment_order": null}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000834;
    await fulfillment_order.move({
      body: {"fulfillment_order": {"new_location_id": 655441491, "fulfillment_order_line_items": [{"id": 1058737574, "quantity": 1}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000834/move.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_location_id": 655441491, "fulfillment_order_line_items": [{"id": 1058737574, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000821, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment"], "destination": {"id": 1046000805, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737562, "shop_id": 548380009, "fulfillment_order_id": 1046000821, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000821;
    await fulfillment_order.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000821/open.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000830, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "scheduled", "supported_actions": ["mark_as_open"], "destination": {"id": 1046000814, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737570, "shop_id": 548380009, "fulfillment_order_id": 1046000830, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": "2025-02-02T09:11:00-05:00", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000830;
    await fulfillment_order.reschedule({
      body: {"fulfillment_order": {"new_fulfill_at": "2025-02-02 14:11 UTC"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000830/reschedule.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_fulfill_at": "2025-02-02 14:11 UTC"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000827, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "on_hold", "supported_actions": ["release_hold"], "destination": {"id": 1046000811, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000827, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "international_duties": null, "fulfill_at": null, "fulfillment_holds": [{"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work."}], "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000827;
    await fulfillment_order.hold({
      body: {"fulfillment_hold": {"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work.", "fulfillment_order_line_items": [{"id": 1058737567, "quantity": 1}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000827/hold.json',
      query: '',
      headers,
      data: {"fulfillment_hold": {"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work.", "fulfillment_order_line_items": [{"id": 1058737567, "quantity": 1}]}}
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});

    await fulfillment_order.set_fulfillment_orders_deadline({
      body: {"fulfillment_order_ids": [1046000820], "fulfillment_deadline": "2021-05-26T10:00:00-04:00"},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/set_fulfillment_orders_deadline.json',
      query: '',
      headers,
      data: {"fulfillment_order_ids": [1046000820], "fulfillment_deadline": "2021-05-26T10:00:00-04:00"}
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000829, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000813, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737569, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "international_duties": null, "fulfill_at": null, "fulfillment_holds": [], "delivery_method": null}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000829;
    await fulfillment_order.release_hold({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/fulfillment_orders/1046000829/release_hold.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
