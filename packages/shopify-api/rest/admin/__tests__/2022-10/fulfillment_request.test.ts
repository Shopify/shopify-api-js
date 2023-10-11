/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('FulfillmentRequest resource', () => {
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

    queueMockResponse(JSON.stringify({"original_fulfillment_order": {"id": 1046000829, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000816, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737568, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737569, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2023-10-03T13:22:49-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000829, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000816, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737568, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737569, "shop_id": 548380009, "fulfillment_order_id": 1046000829, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2023-10-03T13:22:49-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));

    const fulfillment_request = new shopify.rest.FulfillmentRequest({session: session});
    fulfillment_request.fulfillment_order_id = 1046000829;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/fulfillment_orders/1046000829/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"original_fulfillment_order": {"id": 1046000825, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000812, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737558, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737559, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737560, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000826, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000813, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737561, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737562, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2023-10-03T13:22:46-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000827, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000814, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737563, "shop_id": 548380009, "fulfillment_order_id": 1046000827, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new shopify.rest.FulfillmentRequest({session: session});
    fulfillment_request.fulfillment_order_id = 1046000825;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        "id": 1058737558,
        "quantity": 1
      },
      {
        "id": 1058737559,
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/fulfillment_orders/1046000825/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737558, "quantity": 1}, {"id": 1058737559, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000828, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000815, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737564, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737565, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737566, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new shopify.rest.FulfillmentRequest({session: session});
    fulfillment_request.fulfillment_order_id = 1046000828;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/fulfillment_orders/1046000828/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000830, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000817, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737570, "shop_id": 548380009, "fulfillment_order_id": 1046000830, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737571, "shop_id": 548380009, "fulfillment_order_id": 1046000830, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737572, "shop_id": 548380009, "fulfillment_order_id": 1046000830, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new shopify.rest.FulfillmentRequest({session: session});
    fulfillment_request.fulfillment_order_id = 1046000830;
    await fulfillment_request.reject({
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work.", "reason": "inventory_out_of_stock", "line_items": [{"fulfillment_order_line_item_id": 1058737570, "message": "Not enough inventory."}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/fulfillment_orders/1046000830/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work.", "reason": "inventory_out_of_stock", "line_items": [{"fulfillment_order_line_item_id": 1058737570, "message": "Not enough inventory."}]} }
    }).toMatchMadeHttpRequest();
  });

});
