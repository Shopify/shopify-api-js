/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2022-01';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
<<<<<<< HEAD
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000798, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000795, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737501, "shop_id": 548380009, "fulfillment_order_id": 1046000798, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737502, "shop_id": 548380009, "fulfillment_order_id": 1046000798, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737503, "shop_id": 548380009, "fulfillment_order_id": 1046000798, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000799, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000796, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737504, "shop_id": 548380009, "fulfillment_order_id": 1046000799, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737505, "shop_id": 548380009, "fulfillment_order_id": 1046000799, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-10-03T13:19:53-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000800, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000797, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737506, "shop_id": 548380009, "fulfillment_order_id": 1046000800, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
=======
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000840, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000827, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737578, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823226, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737579, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823227, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737580, "shop_id": 548380009, "fulfillment_order_id": 1046000840, "quantity": 1, "line_item_id": 1071823228, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000841, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000828, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737581, "shop_id": 548380009, "fulfillment_order_id": 1046000841, "quantity": 1, "line_item_id": 1071823226, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737582, "shop_id": 548380009, "fulfillment_order_id": 1046000841, "quantity": 1, "line_item_id": 1071823227, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:33-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000842, "shop_id": 548380009, "order_id": 1073459992, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000829, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737583, "shop_id": 548380009, "fulfillment_order_id": 1046000842, "quantity": 1, "line_item_id": 1071823228, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
>>>>>>> origin/isomorphic/main

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000798;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
<<<<<<< HEAD
        "id": 1058737501,
        "quantity": 1
      },
      {
        "id": 1058737502,
=======
        "id": 1058737578,
        "quantity": 1
      },
      {
        "id": 1058737579,
>>>>>>> origin/isomorphic/main
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillment_orders/1046000798/fulfillment_request.json',
      query: '',
      headers,
<<<<<<< HEAD
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737501, "quantity": 1}, {"id": 1058737502, "quantity": 1}]} }
=======
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737578, "quantity": 1}, {"id": 1058737579, "quantity": 1}]} }
>>>>>>> origin/isomorphic/main
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
<<<<<<< HEAD
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000803, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000800, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737513, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737514, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737515, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-10-03T13:20:20-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000803, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000800, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737513, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737514, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737515, "shop_id": 548380009, "fulfillment_order_id": 1046000803, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-10-03T13:20:20-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));
=======
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000843, "shop_id": 548380009, "order_id": 1073459993, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000830, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737584, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823229, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737585, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823230, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737586, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823231, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:36-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000843, "shop_id": 548380009, "order_id": 1073459993, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000830, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737584, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823229, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737585, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823230, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737586, "shop_id": 548380009, "fulfillment_order_id": 1046000843, "quantity": 1, "line_item_id": 1071823231, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-02-03T17:03:36-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));
>>>>>>> origin/isomorphic/main

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000803;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillment_orders/1046000803/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
<<<<<<< HEAD
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000801, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000798, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737507, "shop_id": 548380009, "fulfillment_order_id": 1046000801, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737508, "shop_id": 548380009, "fulfillment_order_id": 1046000801, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737509, "shop_id": 548380009, "fulfillment_order_id": 1046000801, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
=======
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000844, "shop_id": 548380009, "order_id": 1073459994, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000831, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737587, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823232, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737588, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823233, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737589, "shop_id": 548380009, "fulfillment_order_id": 1046000844, "quantity": 1, "line_item_id": 1071823234, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
>>>>>>> origin/isomorphic/main

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000801;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillment_orders/1046000801/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
<<<<<<< HEAD
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000802, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000799, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737510, "shop_id": 548380009, "fulfillment_order_id": 1046000802, "quantity": 1, "line_item_id": 466157049, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737511, "shop_id": 548380009, "fulfillment_order_id": 1046000802, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}, {"id": 1058737512, "shop_id": 548380009, "fulfillment_order_id": 1046000802, "quantity": 1, "line_item_id": 703073504, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
=======
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000845, "shop_id": 548380009, "order_id": 1073459995, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000832, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737590, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823235, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737591, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823236, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737592, "shop_id": 548380009, "fulfillment_order_id": 1046000845, "quantity": 1, "line_item_id": 1071823237, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));
>>>>>>> origin/isomorphic/main

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000802;
    await fulfillment_request.reject({
<<<<<<< HEAD
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work.", "reason": "inventory_out_of_stock", "line_items": [{"fulfillment_order_line_item_id": 1058737510, "message": "Not enough inventory."}]}},
=======
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work."}},
>>>>>>> origin/isomorphic/main
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillment_orders/1046000802/fulfillment_request/reject.json',
      query: '',
      headers,
<<<<<<< HEAD
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work.", "reason": "inventory_out_of_stock", "line_items": [{"fulfillment_order_line_item_id": 1058737510, "message": "Not enough inventory."}]} }
=======
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work."} }
>>>>>>> origin/isomorphic/main
    }).toMatchMadeHttpRequest();
  });

});
