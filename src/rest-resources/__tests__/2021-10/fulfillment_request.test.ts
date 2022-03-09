import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2021-10';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000840, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000827, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737578, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823226, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737579, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823227, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737580, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823228, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000841, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000828, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737581, "shop_id": 548380009, "fulfillment_order_id": 1046000841, "quantity": 1, "line_item_id": 1071823226, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737582, "shop_id": 548380009, "fulfillment_order_id": 1046000841, "quantity": 1, "line_item_id": 1071823227, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:33-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000842, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000829, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737583, "shop_id": 548380009, "fulfillment_order_id": 1046000842, "quantity": 1, "line_item_id": 1071823228, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000840;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        "id": 1058737578,
        "quantity": 1
      },
      {
        "id": 1058737579,
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000840/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737578, "quantity": 1}, {"id": 1058737579, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000843, "shop_id": 548380009, "order_id": 1073459993, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000830, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737584, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823229, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737585, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823230, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737586, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823231, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:36-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000843, "shop_id": 548380009, "order_id": 1073459993, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000830, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737584, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823229, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737585, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823230, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737586, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823231, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:36-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000843;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000843/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000844, "shop_id": 548380009, "order_id": 1073459994, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000831, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737587, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823232, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737588, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823233, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737589, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823234, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000844;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000844/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000845, "shop_id": 548380009, "order_id": 1073459995, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000832, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737590, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823235, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737591, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823236, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737592, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823237, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000845;
    await fulfillment_request.reject({
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000845/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work."} }
    }).toMatchMadeHttpRequest();
  });

});
